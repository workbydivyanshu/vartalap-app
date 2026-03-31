import { Router, Response } from 'express';
import { Message, Channel } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/:channelId/messages', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { before, limit = '50' } = req.query;
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    const query: any = { channel: req.params.channelId };
    if (before) {
      query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
      .populate('author', 'username avatar status')
      .populate({ path: 'replyTo', populate: { path: 'author', select: 'username avatar' } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:channelId/messages', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, replyTo, attachments } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    const messageData: any = {
      content: content.trim(),
      author: req.user!._id,
      channel: channel._id,
    };

    if (replyTo) messageData.replyTo = replyTo;
    if (attachments && attachments.length > 0) messageData.attachments = attachments;

    const message = new Message(messageData);
    await message.save();

    const populated = await Message.findById(message._id)
      .populate('author', 'username avatar status')
      .populate({ path: 'replyTo', populate: { path: 'author', select: 'username avatar' } });

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle reaction on a message
router.post('/:messageId/react', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { emoji } = req.body;
    if (!emoji) {
      res.status(400).json({ error: 'Emoji is required' });
      return;
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const existingReaction = message.reactions?.find((r) => r.emoji === emoji);
    if (existingReaction) {
      const userIndex = existingReaction.users.findIndex((u) => u.toString() === req.user!._id.toString());
      if (userIndex >= 0) {
        existingReaction.users.splice(userIndex, 1);
        if (existingReaction.users.length === 0) {
          message.reactions = message.reactions!.filter((r) => r.emoji !== emoji);
        }
      } else {
        existingReaction.users.push(req.user!._id);
      }
    } else {
      if (!message.reactions) message.reactions = [];
      message.reactions.push({ emoji, users: [req.user!._id] });
    }

    await message.save();
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a message
router.patch('/:channelId/messages/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.author.toString() !== req.user!._id.toString()) {
      res.status(403).json({ error: 'You can only edit your own messages' });
      return;
    }

    message.content = content.trim();
    message.editedAt = new Date();
    await message.save();

    const populated = await Message.findById(message._id)
      .populate('author', 'username avatar status')
      .populate({ path: 'replyTo', populate: { path: 'author', select: 'username avatar' } });

    res.json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete('/:channelId/messages/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.author.toString() !== req.user!._id.toString()) {
      res.status(403).json({ error: 'You can only delete your own messages' });
      return;
    }

    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true, messageId: req.params.messageId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search messages in a channel
router.get('/:channelId/search', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) {
      res.json([]);
      return;
    }

    const messages = await Message.find({
      channel: req.params.channelId,
      content: { $regex: q as string, $options: 'i' },
    })
      .populate('author', 'username avatar status')
      .sort({ createdAt: -1 })
      .limit(25);

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Pin a message
router.post('/:channelId/pins/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    message.pinned = true;
    await message.save();
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Unpin a message
router.delete('/:channelId/pins/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    message.pinned = false;
    await message.save();
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get pinned messages
router.get('/:channelId/pins', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pins = await Message.find({ channel: req.params.channelId, pinned: true })
      .populate('author', 'username avatar status')
      .sort({ createdAt: -1 });
    res.json(pins);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get thread replies for a message
router.get('/:channelId/messages/:messageId/thread', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentMessage = await Message.findById(req.params.messageId)
      .populate('author', 'username avatar status');

    if (!parentMessage) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    // Find all messages that reply to this message
    const replies = await Message.find({ replyTo: req.params.messageId })
      .populate('author', 'username avatar status')
      .sort({ createdAt: 1 });

    res.json({ parent: parentMessage, replies });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
