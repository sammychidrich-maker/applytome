import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

const questionSchema = z.object({
  type: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.string().optional(),
  config: z.string().optional(),
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = questionSchema.parse(req.body);
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    const maxOrder = await prisma.question.aggregate({
      where: { formId: req.params.id },
      _max: { order: true },
    });
    const question = await prisma.question.create({
      data: {
        ...data,
        formId: req.params.id,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

router.put('/:qid', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = questionSchema.partial().parse(req.body);
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    const question = await prisma.question.update({
      where: { id: req.params.qid, formId: req.params.id },
      data,
    });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

router.delete('/:qid', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    await prisma.question.delete({
      where: { id: req.params.qid, formId: req.params.id },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reorder', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { questionIds } = z.object({ questionIds: z.array(z.string()) }).parse(req.body);
    const form = await prisma.form.findFirst({
      where: { id: req.params.id, creatorId: req.user!.id },
    });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }
    await prisma.$transaction(
      questionIds.map((id, index) =>
        prisma.question.update({ where: { id, formId: req.params.id }, data: { order: index + 1 } })
      )
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid input' });
  }
});

export default router;
