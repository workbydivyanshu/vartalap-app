import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, TypingUser } from '../types';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  joinDM: (conversationId: string) => void;
  sendMessage: (data: { channelId?: string; dmConversationId?: string; content: string }) => void;
  startTyping: (data: { channelId?: string; dmConversationId?: string }) => void;
  stopTyping: (data: { channelId?: string; dmConversationId?: string }) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onTypingStart: (callback: (data: TypingUser) => void) => void;
  onTypingStop: (callback: (data: TypingUser) => void) => void;
  onUserStatus: (callback: (data: { userId: string; status: string }) => void) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const newSocket = io(window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const joinChannel = useCallback((channelId: string) => {
    socket?.emit('channel:join', channelId);
  }, [socket]);

  const leaveChannel = useCallback((channelId: string) => {
    socket?.emit('channel:leave', channelId);
  }, [socket]);

  const joinDM = useCallback((conversationId: string) => {
    socket?.emit('dm:join', conversationId);
  }, [socket]);

  const sendMessage = useCallback((data: { channelId?: string; dmConversationId?: string; content: string }) => {
    socket?.emit('message:send', data);
  }, [socket]);

  const startTyping = useCallback((data: { channelId?: string; dmConversationId?: string }) => {
    socket?.emit('typing:start', data);
  }, [socket]);

  const stopTyping = useCallback((data: { channelId?: string; dmConversationId?: string }) => {
    socket?.emit('typing:stop', data);
  }, [socket]);

  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    socket?.on('message:new', callback);
    return () => { socket?.off('message:new', callback); };
  }, [socket]);

  const onTypingStart = useCallback((callback: (data: TypingUser) => void) => {
    socket?.on('typing:start', callback);
    return () => { socket?.off('typing:start', callback); };
  }, [socket]);

  const onTypingStop = useCallback((callback: (data: TypingUser) => void) => {
    socket?.on('typing:stop', callback);
    return () => { socket?.off('typing:stop', callback); };
  }, [socket]);

  const onUserStatus = useCallback((callback: (data: { userId: string; status: string }) => void) => {
    socket?.on('user:status', callback);
    return () => { socket?.off('user:status', callback); };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinChannel,
        leaveChannel,
        joinDM,
        sendMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        onTypingStart,
        onTypingStop,
        onUserStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
