import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

const submitSchema = z.object({
  applicantName: z.string().min(1),
  applicantEmail: z.string().email(),
  answers: z.record(z.string()),
});

const statusSchema = z.object({
  status: z.enum(['submitted', 'viewed', 'shortlisted', 'accepted', 'rejected']),
});

// Submit application (public)
router.post('/forms/s/:slug/responses', async (req, res) => {
  try {
    const data = submitSchema.parse(req.body);
    const form = await prisma.form.findUnique({
      where: { slug: req.params.slug },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!form || !form.isActive) {
      res.status(404).json({ error: 'Form not found or inactive' });
      return;
    }

    // Validate required questions
    const requiredQuestions = form.questions.filter((q) => q.required);
    for (const q of requiredQuestions) {
      if (!data.answers[q.id] || data.answers[q.id].trim() === '') {
        res.status(400).json({ error: `Missing required answer: ${q.label}` });
        return;
      }
    }

    const response = await prisma.response.create({
      data: {
        formId: form.id,
        applicantName: data.applicantName,
        applicantEmail: data.applicantEmail,
        status: 'submitted',
      },
    });

    const answerRecords = Object.entries(data.answers).map(([questionId, value]) => ({
      responseId: response.id,
      questionId,
      value: value.toString(),
    }));

    await prisma.answer.createMany({ data: answerRecords });

    res.json({ success: true, responseId: response.id });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

// List responses for a form (creator only)
router.get('/forms/:id/responses', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    const responses = await prisma.response.findMany({
      where: { formId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: { include: { question: true } },
      },
    });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single response (creator only)
router.get('/responses/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const response = await prisma.response.findUnique({
      where: { id: req.params.id },
      include: {
        form: true,
        answers: { include: { question: true } },
      },
    });
    if (!response || response.form.creatorId !== req.user!.id) {
      res.status(404).json({ error: 'Response not found' });
      return;
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update response status
router.put('/responses/:id/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = statusSchema.parse(req.body);
    const response = await prisma.response.findUnique({
      where: { id: req.params.id },
      include: { form: true },
    });
    if (!response || response.form.creatorId !== req.user!.id) {
      res.status(404).json({ error: 'Response not found' });
      return;
    }
    const updated = await prisma.response.update({
      where: { id: req.params.id },
      data: { status: data.status },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

// Delete response
router.delete('/responses/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const response = await prisma.response.findUnique({
      where: { id: req.params.id },
      include: { form: true },
    });
    if (!response || response.form.creatorId !== req.user!.id) {
      res.status(404).json({ error: 'Response not found' });
      return;
    }
    await prisma.response.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
