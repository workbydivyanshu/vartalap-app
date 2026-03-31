export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  servers: string[];
  createdAt: string;
}

export interface Server {
  _id: string;
  name: string;
  icon: string;
  owner: string;
  members: User[];
  channels: Channel[];
  inviteCode: string;
}

export interface Channel {
  _id: string;
  name: string;
  type: 'text' | 'voice';
  server: string;
  topic: string;
}

export interface Message {
  _id: string;
  content: string;
  author: User;
  channel?: string;
  dmConversation?: string;
  attachments?: string[];
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: { _id: string; content: string; author: User } | null;
  editedAt?: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DMConversation {
  _id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  channelId?: string;
  conversationId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
