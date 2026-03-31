import { Router, Response } from 'express';
import { User } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/search', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) {
      res.json([]);
      return;
    }

    const users = await User.find({
      username: { $regex: q as string, $options: 'i' },
      _id: { $ne: req.user!._id },
    })
      .select('username avatar status')
      .limit(10);

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select('username avatar status createdAt');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
