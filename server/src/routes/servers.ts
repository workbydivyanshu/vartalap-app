import { Router, Response } from 'express';
import { Server, Channel, User } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Server name is required' });
      return;
    }

    const server = new Server({
      name,
      owner: req.user!._id,
      members: [req.user!._id],
      channels: [],
    });
    await server.save();

    const generalChannel = new Channel({ name: 'general', type: 'text', server: server._id });
    await generalChannel.save();

    server.channels.push(generalChannel._id);
    await server.save();

    req.user!.servers.push(server._id);
    await req.user!.save();

    const populated = await Server.findById(server._id)
      .populate('channels')
      .populate('members', 'username avatar status');

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const servers = await Server.find({ members: req.user!._id })
      .populate('channels')
      .populate('members', 'username avatar status');
    res.json(servers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:serverId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const server = await Server.findById(req.params.serverId)
      .populate('channels')
      .populate('members', 'username avatar status');

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    res.json(server);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:serverId/channels', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Channel name is required' });
      return;
    }

    const server = await Server.findById(req.params.serverId);
    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    const channel = new Channel({
      name,
      type: type || 'text',
      server: server._id,
    });
    await channel.save();

    server.channels.push(channel._id);
    await server.save();

    res.status(201).json(channel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/join/:inviteCode', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const server = await Server.findOne({ inviteCode: req.params.inviteCode });
    if (!server) {
      res.status(404).json({ error: 'Invalid invite code' });
      return;
    }

    if (server.members.includes(req.user!._id)) {
      res.status(400).json({ error: 'Already a member' });
      return;
    }

    server.members.push(req.user!._id);
    await server.save();

    req.user!.servers.push(server._id);
    await req.user!.save();

    const populated = await Server.findById(server._id)
      .populate('channels')
      .populate('members', 'username avatar status');

    res.json(populated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update server (PATCH)
router.patch('/:serverId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }
    if (server.owner.toString() !== req.user!._id.toString()) {
      res.status(403).json({ error: 'Only the owner can update the server' });
      return;
    }
    const { name, icon, topic } = req.body;
    if (name) server.name = name;
    if (icon) server.icon = icon;
    await server.save();
    res.json(server);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Leave server (DELETE)
router.delete('/:serverId/leave', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }
    server.members = server.members.filter((m: any) => m.toString() !== req.user!._id.toString());
    await server.save();
    await User.findByIdAndUpdate(req.user!._id, { $pull: { servers: server._id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate invite code
router.post('/:serverId/invite', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    // Generate new invite code
    const inviteCode = Math.random().toString(36).substring(2, 10);
    server.inviteCode = inviteCode;
    await server.save();

    res.json({ inviteCode, inviteUrl: `/invite/${inviteCode}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
