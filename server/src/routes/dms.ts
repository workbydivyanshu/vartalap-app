import { Router, Response } from 'express';
import { DMConversation, Message, User } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await DMConversation.find({
      participants: req.user!._id,
    }).populate('participants', 'username avatar status');

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      res.status(400).json({ error: 'Recipient ID is required' });
      return;
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let conversation = await DMConversation.findOne({
      participants: { $all: [req.user!._id, recipientId], $size: 2 },
    });

    if (!conversation) {
      conversation = new DMConversation({
        participants: [req.user!._id, recipientId],
      });
      await conversation.save();
    }

    const populated = await DMConversation.findById(conversation._id).populate(
      'participants',
      'username avatar status'
    );

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:conversationId/messages', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { before, limit = '50' } = req.query;

    const conversation = await DMConversation.findById(req.params.conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (!conversation.participants.includes(req.user!._id)) {
      res.status(403).json({ error: 'Not a participant' });
      return;
    }

    const query: any = { dmConversation: req.params.conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
      .populate('author', 'username avatar status')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:conversationId/messages', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const conversation = await DMConversation.findById(req.params.conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    if (!conversation.participants.includes(req.user!._id)) {
      res.status(403).json({ error: 'Not a participant' });
      return;
    }

    const message = new Message({
      content: content.trim(),
      author: req.user!._id,
      dmConversation: conversation._id,
    });
    await message.save();

    const populated = await Message.findById(message._id).populate(
      'author',
      'username avatar status'
    );

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
