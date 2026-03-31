import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User, Message } from '../models';

interface SocketUser {
  userId: string;
  username: string;
  socketId: string;
}

const onlineUsers = new Map<string, SocketUser>();

export function setupSocket(io: SocketServer): void {
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      (socket as any).userId = user._id.toString();
      (socket as any).username = user.username;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const userId = (socket as any).userId;
    const username = (socket as any).username;

    onlineUsers.set(userId, {
      userId,
      username,
      socketId: socket.id,
    });

    await User.findByIdAndUpdate(userId, { status: 'online' });
    io.emit('user:status', { userId, status: 'online' });

    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on('dm:join', (conversationId: string) => {
      socket.join(`dm:${conversationId}`);
    });

    socket.on('message:send', async (data: { channelId?: string; dmConversationId?: string; content: string; replyTo?: string; attachments?: string[] }) => {
      try {
        if (!data.content?.trim()) return;

        const messageData: any = {
          content: data.content.trim(),
          author: userId,
        };

        if (data.channelId) {
          messageData.channel = data.channelId;
        } else if (data.dmConversationId) {
          messageData.dmConversation = data.dmConversationId;
        }

        if (data.replyTo) messageData.replyTo = data.replyTo;
        if (data.attachments && data.attachments.length > 0) messageData.attachments = data.attachments;

        const message = new Message(messageData);
        await message.save();

        const populated = await Message.findById(message._id)
          .populate('author', 'username avatar status')
          .populate({ path: 'replyTo', populate: { path: 'author', select: 'username avatar' } });

        if (data.channelId) {
          io.to(`channel:${data.channelId}`).emit('message:new', populated);
        } else if (data.dmConversationId) {
          io.to(`dm:${data.dmConversationId}`).emit('message:new', populated);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing:start', (data: { channelId?: string; dmConversationId?: string }) => {
      if (data.channelId) {
        socket.to(`channel:${data.channelId}`).emit('typing:start', {
          userId,
          username,
          channelId: data.channelId,
        });
      } else if (data.dmConversationId) {
        socket.to(`dm:${data.dmConversationId}`).emit('typing:start', {
          userId,
          username,
          conversationId: data.dmConversationId,
        });
      }
    });

    socket.on('typing:stop', (data: { channelId?: string; dmConversationId?: string }) => {
      if (data.channelId) {
        socket.to(`channel:${data.channelId}`).emit('typing:stop', {
          userId,
          channelId: data.channelId,
        });
      } else if (data.dmConversationId) {
        socket.to(`dm:${data.dmConversationId}`).emit('typing:stop', {
          userId,
          conversationId: data.dmConversationId,
        });
      }
    });

    // Edit message
    socket.on('message:edit', async (data: { channelId: string; messageId: string; content: string }) => {
      try {
        const message = await Message.findById(data.messageId);
        if (!message || message.author.toString() !== userId) return;

        message.content = data.content.trim();
        message.editedAt = new Date();
        await message.save();

        const populated = await Message.findById(message._id)
          .populate('author', 'username avatar status');

        io.to(`channel:${data.channelId}`).emit('message:update', populated);
      } catch (error) {
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('message:delete', async (data: { channelId: string; messageId: string }) => {
      try {
        const message = await Message.findById(data.messageId);
        if (!message || message.author.toString() !== userId) return;

        await Message.findByIdAndDelete(data.messageId);
        io.to(`channel:${data.channelId}`).emit('message:delete', { messageId: data.messageId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Pin/unpin message
    socket.on('message:pin', async (data: { channelId: string; messageId: string; pinned: boolean }) => {
      try {
        const message = await Message.findById(data.messageId);
        if (!message) return;

        message.pinned = data.pinned;
        await message.save();

        io.to(`channel:${data.channelId}`).emit('message:update', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to pin message' });
      }
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { status: 'offline' });
      io.emit('user:status', { userId, status: 'offline' });
    });
  });
}
