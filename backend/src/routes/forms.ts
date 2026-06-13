import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateSlug } from '../utils/slug.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

const createFormSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
});

const updateFormSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  allowsAnonymous: z.boolean().optional(),
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = createFormSchema.parse(req.body);
    const slug = generateSlug(data.title);
    const form = await prisma.form.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        slug,
        creatorId: req.user!.id,
      },
    });
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: { creatorId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { responses: true } },
      },
    });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { responses: true } },
      },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = updateFormSchema.parse(req.body);
    const form = await prisma.form.updateMany({
      where: { id: req.params.id, creatorId: req.user!.id },
      data,
    });
    if (form.count === 0) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    const updated = await prisma.form.findUnique({ where: { id: req.params.id } });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.form.deleteMany({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public form by slug
router.get('/s/:slug', async (req, res) => {
  try {
    const form = await prisma.form.findUnique({
      where: { slug: req.params.slug },
      include: {
        questions: { orderBy: { order: 'asc' } },
        creator: { select: { name: true, photoUrl: true, bio: true } },
      },
    });
    if (!form || !form.isActive) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
