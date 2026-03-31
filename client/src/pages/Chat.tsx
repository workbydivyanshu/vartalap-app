import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useVirtualizer } from '@tanstack/react-virtual';
import api from '../api';
import { Server, Channel, Message, DMConversation, User, TypingUser } from '../types';
import QuickSwitcher from '../components/chat/QuickSwitcher';
import ServerSettings from '../components/chat/ServerSettings';
import Settings from '../components/chat/Settings';
import EmojiPicker from '../components/chat/EmojiPicker';
import UserProfile from '../components/chat/UserProfile';
import NewDM from '../components/chat/NewDM';
import JoinServer from '../components/chat/JoinServer';
import ThreadPanel from '../components/chat/ThreadPanel';
import CommandSuggestions from '../components/chat/CommandSuggestions';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChannelHeader from '../components/chat/ChannelHeader';
import './chat.css';
import '../components/chat/QuickSwitcher.css';
import '../components/chat/Settings.css';
import '../components/chat/EmojiPicker.css';
import '../components/chat/UserProfile.css';
import '../components/chat/NewDM.css';
import '../components/chat/ThreadPanel.css';
import '../components/chat/CommandSuggestions.css';

function HashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function HashBoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function Chat() {
  const { serverId, channelId, conversationId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
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
  } = useSocket();

  const [servers, setServers] = useState<Server[]>([]);
  const [activeServer, setActiveServer] = useState<Server | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [showMembers, setShowMembers] = useState(true);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [dmConversations, setDmConversations] = useState<DMConversation[]>([]);
  const [activeDM, setActiveDM] = useState<DMConversation | null>(null);
  const [viewMode, setViewMode] = useState<'servers' | 'dms'>('servers');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [searching, setSearching] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [showNewDM, setShowNewDM] = useState(false);
  const [showJoinServer, setShowJoinServer] = useState(false);
  const [openThread, setOpenThread] = useState<Message | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadServers = useCallback(async () => {
    try {
      const { data } = await api.get<Server[]>('/servers');
      setServers(data);
    } catch (error) {
      console.error('Failed to load servers');
    }
  }, []);

  const loadDMs = useCallback(async () => {
    try {
      const { data } = await api.get<DMConversation[]>('/dms');
      setDmConversations(data);
    } catch (error) {
      console.error('Failed to load DMs');
    }
  }, []);

  const loadMessages = useCallback(async (chId: string) => {
    try {
      const { data } = await api.get<Message[]>(`/channels/${chId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages');
    }
  }, []);

  const loadDMMessages = useCallback(async (convId: string) => {
    try {
      const { data } = await api.get<Message[]>(`/dms/${convId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load DM messages');
    }
  }, []);

  useEffect(() => {
    loadServers();
    loadDMs();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickSwitcher((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadServers, loadDMs]);

  useEffect(() => {
    if (serverId && servers.length > 0) {
      const server = servers.find((s) => s._id === serverId);
      if (server) {
        setActiveServer(server);
        setViewMode('servers');
        if (channelId) {
          const channel = server.channels.find((c) => c._id === channelId);
          if (channel) {
            setActiveChannel(channel);
            setActiveDM(null);
            loadMessages(channelId);
            joinChannel(channelId);
          }
        }
      }
    }
  }, [serverId, channelId, servers, loadMessages, joinChannel]);

  useEffect(() => {
    if (conversationId && dmConversations.length > 0) {
      const dm = dmConversations.find((d) => d._id === conversationId);
      if (dm) {
        setActiveDM(dm);
        setActiveChannel(null);
        setActiveServer(null);
        setViewMode('dms');
        loadDMMessages(conversationId);
        joinDM(conversationId);
      }
    }
  }, [conversationId, dmConversations, loadDMMessages, joinDM]);

  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });
    return cleanup;
  }, [onNewMessage]);

  useEffect(() => {
    const cleanup = onTypingStart((data) => {
      if (data.userId !== user?._id) {
        setTypingUsers((prev) => {
          if (prev.find((u) => u.userId === data.userId)) return prev;
          return [...prev, data];
        });
      }
    });
    return cleanup;
  }, [onTypingStart, user]);

  useEffect(() => {
    const cleanup = onTypingStop((data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });
    return cleanup;
  }, [onTypingStop]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectChannel = (channel: Channel, server?: Server) => {
    const srv = server || activeServer;
    if (activeChannel) {
      leaveChannel(activeChannel._id);
    }
    setActiveChannel(channel);
    setActiveDM(null);
    setMessages([]);
    setTypingUsers([]);
    loadMessages(channel._id);
    joinChannel(channel._id);
    navigate(`/app/${srv?._id}/${channel._id}`);
  };

  const handleSelectDM = (dm: DMConversation) => {
    if (activeChannel) {
      leaveChannel(activeChannel._id);
    }
    setActiveDM(dm);
    setActiveChannel(null);
    setMessages([]);
    setTypingUsers([]);
    loadDMMessages(dm._id);
    joinDM(dm._id);
    navigate(`/app/dm/${dm._id}`);
  };

  // Command suggestion handler
  const handleCommandSelect = (processedContent: string) => {
    setMessageInput('');
    const payload: any = { content: processedContent };
    if (replyingTo) payload.replyTo = replyingTo._id;
    if (activeChannel) {
      sendMessage({ channelId: activeChannel._id, ...payload });
    }
    setReplyingTo(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !uploadedFileUrl) return;

    const payload: any = {};
    if (replyingTo) payload.replyTo = replyingTo._id;
    if (uploadedFileUrl) {
      payload.attachments = [uploadedFileUrl];
      payload.content = messageInput || previewImageName;
    } else {
      payload.content = messageInput;
    }

    if (activeChannel) {
      sendMessage({ channelId: activeChannel._id, ...payload });
    } else if (activeDM) {
      sendMessage({ dmConversationId: activeDM._id, ...payload });
    }

    setMessageInput('');
    setReplyingTo(null);
    clearPreview();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping({
      channelId: activeChannel?._id,
      dmConversationId: activeDM?._id,
    });
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleReact = (msgId: string, emoji: string) => {
    // Toggle reaction locally
    setMessages((prev) =>
      prev.map((m) => {
        if (m._id !== msgId) return m;
        const existingReaction = m.reactions?.find((r) => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(user!._id)) {
            return {
              ...m,
              reactions: m.reactions!.map((r) =>
                r.emoji === emoji
                  ? { ...r, users: r.users.filter((u) => u !== user!._id) }
                  : r
              ),
            };
          }
          return {
            ...m,
            reactions: m.reactions!.map((r) =>
              r.emoji === emoji ? { ...r, users: [...r.users, user!._id] } : r
            ),
          };
        }
        return {
          ...m,
          reactions: [...(m.reactions || []), { emoji, users: [user!._id] }],
        };
      })
    );
    setShowEmojiPicker(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target?.result as string);
      setPreviewImageName(file.name);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploadedFileUrl(response.data.url);
    } catch (error) {
      console.error('File upload failed');
      clearPreview();
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreviewImage(null);
    setPreviewImageName('');
    setUploadedFileUrl(null);
    setUploadProgress(0);
  };

  // Edit message handler
  const handleEditMessage = (msg: Message) => {
    setEditingMessage(msg._id);
    setEditContent(msg.content);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editContent.trim() || !activeChannel) return;
    try {
      const { data } = await api.patch(`/channels/${activeChannel._id}/messages/${msgId}`, { content: editContent });
      setMessages((prev) => prev.map((m) => m._id === msgId ? data : m));
    } catch (error) {
      console.error('Failed to edit message');
    }
    setEditingMessage(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  // Delete message handler
  const handleDeleteConfirm = async () => {
    if (!deleteMessage || !activeChannel) return;
    try {
      await api.delete(`/channels/${activeChannel._id}/messages/${deleteMessage._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleteMessage._id));
    } catch (error) {
      console.error('Failed to delete message');
    }
    setDeleteMessage(null);
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim() || !activeChannel) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/channels/${activeChannel._id}/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  // Pin/unpin handler
  const handlePinMessage = async (msg: Message) => {
    if (!activeChannel) return;
    const newPinned = !msg.pinned;
    try {
      if (newPinned) {
        await api.post(`/channels/${activeChannel._id}/pins/${msg._id}`);
      } else {
        await api.delete(`/channels/${activeChannel._id}/pins/${msg._id}`);
      }
      setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, pinned: newPinned } : m));
    } catch (error) {
      console.error('Failed to pin message');
    }
  };

  const loadPinnedMessages = async () => {
    if (!activeChannel) return;
    try {
      const { data } = await api.get(`/channels/${activeChannel._id}/pins`);
      setPinnedMessages(data);
    } catch (error) {
      console.error('Failed to load pinned messages');
    }
  };

  // User profile handler
  const handleViewProfile = (userId: string) => {
    setViewingProfile(userId);
  };

  // DM creation handler
  const handleCreateDM = async (userId: string) => {
    try {
      const { data } = await api.post('/dms', { recipientId: userId });
      setDmConversations((prev) => {
        if (prev.find((d) => d._id === data._id)) return prev;
        return [data, ...prev];
      });
      handleSelectDM(data);
    } catch (error) {
      console.error('Failed to create DM');
    }
  };

  // DM created from NewDM modal
  const handleDMCreated = (conversationId: string, participantName: string) => {
    // Find or create DM in list
    const existingDM = dmConversations.find((d) => d._id === conversationId);
    if (existingDM) {
      handleSelectDM(existingDM);
    } else {
      const newDM: DMConversation = {
        _id: conversationId,
        participants: [{ _id: '', username: participantName, avatar: '', status: 'online', email: '', servers: [], createdAt: '' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDmConversations((prev) => [newDM, ...prev]);
      handleSelectDM(newDM);
    }
  };

  // Join server handler
  const handleJoinServer = (server: Server) => {
    setServers((prev) => {
      if (prev.find((s) => s._id === server._id)) return prev;
      return [server, ...prev];
    });
    setActiveServer(server);
    if (server.channels.length > 0) {
      handleSelectChannel(server.channels[0], server);
      navigate(`/app/${server._id}/${server.channels[0]._id}`);
    }
  };

  // Thread handler
  const handleOpenThread = (msg: Message) => {
    setOpenThread(msg);
  };

  const handleCloseThread = () => {
    setOpenThread(null);
  };

  // Notification handler
  const showNotification = (title: string, body: string, channelId?: string) => {
    if (Notification.permission !== 'granted') return;
    const notif = new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag: channelId || 'vartalap',
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Message pagination (load older messages)
  const loadMoreMessages = useCallback(async () => {
    if (!activeChannel || loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    try {
      const oldest = messages[0];
      const { data } = await api.get(`/channels/${activeChannel._id}/messages?before=${oldest.createdAt}&limit=50`);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to load more messages');
    } finally {
      setLoadingMore(false);
    }
  }, [activeChannel, messages, loadingMore, hasMore]);

  // Scroll handler for pagination
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 100 && !loadingMore && hasMore) {
        loadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMoreMessages, loadingMore, hasMore]);

  const handleQuickSwitcherSelect = (type: string, serverId?: string, channelId?: string, dmId?: string) => {
    if (type === 'channel' && serverId && channelId) {
      handleSelectChannel({ _id: channelId, name: '', type: 'text', server: serverId, topic: '' } as Channel, servers.find((s) => s._id === serverId));
      navigate(`/app/${serverId}/${channelId}`);
    } else if (type === 'dm' && dmId) {
      const dm = dmConversations.find((d) => d._id === dmId);
      if (dm) handleSelectDM(dm);
    }
  };

  const handleServerUpdate = async (newName: string) => {
    if (!activeServer) return;
    try {
      await api.patch(`/servers/${activeServer._id}`, { name: newName });
      setActiveServer((prev) => prev ? { ...prev, name: newName } : prev);
      setServers((prev) => prev.map((s) => s._id === activeServer._id ? { ...s, name: newName } : s));
    } catch (error) {
      console.error('Failed to update server');
    }
  };

  const handleServerLeave = async () => {
    if (!activeServer) return;
    try {
      await api.delete(`/servers/${activeServer._id}/leave`);
      setServers((prev) => prev.filter((s) => s._id !== activeServer._id));
      setActiveServer(null);
      setActiveChannel(null);
      navigate('/app');
      setShowServerSettings(false);
    } catch (error) {
      console.error('Failed to leave server');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    if (activeChannel) {
      startTyping({ channelId: activeChannel._id });
    } else if (activeDM) {
      startTyping({ dmConversationId: activeDM._id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping({
        channelId: activeChannel?._id,
        dmConversationId: activeDM?._id,
      });
    }, 2000);
  };

  const handleCreateServer = async () => {
    if (!newServerName.trim()) return;
    try {
      const { data } = await api.post('/servers', { name: newServerName });
      setServers((prev) => [...prev, data]);
      setNewServerName('');
      setShowCreateServer(false);
      navigate(`/app/${data._id}/${data.channels[0]._id}`);
    } catch (error) {
      console.error('Failed to create server');
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !activeServer) return;
    try {
      const { data } = await api.post(`/servers/${activeServer._id}/channels`, {
        name: newChannelName,
      });
      setActiveServer((prev) => {
        if (!prev) return prev;
        return { ...prev, channels: [...prev.channels, data] };
      });
      setServers((prev) =>
        prev.map((s) =>
          s._id === activeServer._id ? { ...s, channels: [...s.channels, data] } : s
        )
      );
      setNewChannelName('');
      setShowCreateChannel(false);
    } catch (error) {
      console.error('Failed to create channel');
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString();
  };

  const onlineMembers = activeServer?.members.filter((m) => m.status === 'online') || [];
  const offlineMembers = activeServer?.members.filter((m) => m.status !== 'online') || [];

  const getDMName = (dm: DMConversation) => {
    const other = dm.participants.find((p) => p._id !== user?._id);
    return other?.username || 'Unknown';
  };

  return (
    <div className="chat-layout">
      <a href="#message-input" className="skip-link">Skip to message input</a>
      {/* Server Sidebar */}
      <div className="server-sidebar" role="navigation" aria-label="Servers">
        <div
          className={`dm-icon ${viewMode === 'dms' && !activeDM ? 'active' : ''}`}
          onClick={() => {
            setViewMode('dms');
            setActiveServer(null);
            setActiveChannel(null);
            navigate('/app');
          }}
          title="Direct Messages"
        >
          <ChatIcon />
        </div>

        <div className="server-divider" />

        {servers.map((server) => (
          <div
            key={server._id}
            className={`server-icon ${viewMode === 'servers' && activeServer?._id === server._id ? 'active' : ''}`}
            onClick={() => {
              setViewMode('servers');
              setActiveServer(server);
              if (server.channels.length > 0) {
                handleSelectChannel(server.channels[0], server);
              }
            }}
            title={server.name}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
            ) : (
              getInitials(server.name)
            )}
          </div>
        ))}

        <div
          className="server-icon server-add"
          onClick={() => setShowCreateServer(true)}
          title="Add a Server"
        >
          +
        </div>
        <div
          className="server-icon server-add"
          onClick={() => setShowJoinServer(true)}
          title="Join a Server"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', fontSize: '18px' }}
        >
          →
        </div>
      </div>

      {/* Channel Sidebar */}
      <div className="channel-sidebar" role="navigation" aria-label="Channels">
        {viewMode === 'dms' ? (
          <>
            <div className="channel-header">Direct Messages</div>
            <div className="dm-list">
              <div className="dm-list-header">Direct Messages</div>
              <button className="add-channel-btn" onClick={() => setShowNewDM(true)} style={{ marginBottom: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Conversation
              </button>
              {dmConversations.map((dm) => (
                <div
                  key={dm._id}
                  className={`dm-item ${activeDM?._id === dm._id ? 'active' : ''}`}
                  onClick={() => handleSelectDM(dm)}
                >
                  <div className="dm-item-avatar">
                    {getInitials(getDMName(dm))}
                    <div className={`status-dot ${dm.participants.find((p) => p._id !== user?._id)?.status || 'offline'}`} />
                  </div>
                  <span className="dm-item-name">{getDMName(dm)}</span>
                </div>
              ))}
              {dmConversations.length === 0 && (
                <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                  No conversations yet
                </div>
              )}
            </div>
          </>
        ) : activeServer ? (
          <>
            <div className="channel-header" onClick={() => setShowServerSettings(true)}>
              <span>{activeServer.name}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginLeft: 'auto', opacity: 0.5 }}>
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div className="channel-list">
              <div className="channel-category">
                <span>Text Channels</span>
              </div>
              {activeServer.channels.map((channel) => (
                <div
                  key={channel._id}
                  className={`channel-item ${activeChannel?._id === channel._id ? 'active' : ''}`}
                  onClick={() => handleSelectChannel(channel)}
                >
                  <HashIcon />
                  <span>{channel.name}</span>
                </div>
              ))}
              <button
                className="add-channel-btn"
                onClick={() => setShowCreateChannel(true)}
              >
                <PlusIcon />
                <span>Add Channel</span>
              </button>
            </div>
          </>
        ) : (
          <div className="channel-header">Select a server</div>
        )}

        {/* User Panel */}
        <div className="user-panel" role="complementary" aria-label="User settings">
          <div className="user-avatar">
            {user?.username ? getInitials(user.username) : '??'}
            <div className={`status-dot ${user?.status || 'online'}`} />
          </div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-status-text">Online</div>
          </div>
          <div className="user-actions">
            <button className="user-action-btn" onClick={() => setShowUserSettings(true)} title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button className="user-action-btn" onClick={logout} title="Logout">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" role="main" aria-label="Chat">
        {activeChannel || activeDM ? (
          <>
            <ChannelHeader
              channel={activeChannel}
              dmName={activeDM ? getDMName(activeDM) : undefined}
              showMembers={showMembers}
              showSearch={showSearch}
              showPins={showPins}
              onToggleMembers={() => setShowMembers(!showMembers)}
              onToggleSearch={() => setShowSearch(!showSearch)}
              onTogglePins={() => setShowPins(!showPins)}
              onLoadPins={loadPinnedMessages}
              onSettingsClick={() => setShowServerSettings(true)}
              showMobileMenu={false}
              onToggleMobileMenu={() => {}}
              hasServer={!!activeServer}
            />

            <div ref={messagesContainerRef} className="messages-container" role="log" aria-live="polite" aria-label="Messages">
              {loadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner loading-spinner-small" />
                  <span>Loading older messages...</span>
                </div>
              )}
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <div style={{ height: messages.length * 40, position: 'relative', width: '100%' }}>
                  {messages.map((msg, index) => {
                    const showHeader =
                      index === 0 ||
                      messages[index - 1].author._id !== msg.author._id ||
                      new Date(msg.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000;

                    let showDateDivider = false;
                    if (index > 0) {
                      const prevDate = new Date(messages[index - 1].createdAt).toDateString();
                      const currDate = new Date(msg.createdAt).toDateString();
                      showDateDivider = prevDate !== currDate;
                    }

                    return (
                      <div key={msg._id} style={{ position: 'absolute', top: index * 40, left: 0, right: 0 }}>
                        <React.Fragment>
                          {showDateDivider && (
                            <div className="date-divider">
                              <span>{new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          )}
                          <div id={`msg-${msg._id}`} className={`message ${showHeader ? 'message-header-visible' : 'message-compact'}`}>
                            {showHeader ? (
                              <div className="message-avatar" onClick={() => handleViewProfile(msg.author._id)} title="View Profile">
                                {msg.author.avatar ? (
                                  <img src={msg.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  getInitials(msg.author.username)
                                )}
                              </div>
                            ) : (
                              <div className="message-timestamp-inline">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                            <div className="message-content">
                              {showHeader && (
                                <div className="message-header">
                                  <span className="message-author" onClick={() => handleViewProfile(msg.author._id)}>{msg.author.username}</span>
                                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                                </div>
                              )}
                              {msg.replyTo && (
                                <div className="message-reply-indicator">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                                  <span className="message-reply-author">{msg.replyTo.author.username}</span>
                                  <span className="message-reply-content">{msg.replyTo.content}</span>
                                </div>
                              )}
                              {editingMessage === msg._id ? (
                                <div className="message-edit">
                                  <textarea
                                    className="message-edit-input"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(msg._id); }
                                      if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    autoFocus
                                  />
                                  <div className="message-edit-hint">escape to <span onClick={handleCancelEdit}>cancel</span> • enter to <span onClick={() => handleSaveEdit(msg._id)}>save</span></div>
                                </div>
                              ) : (
                                <div className="message-text">
                                  {msg.content}
                                  {msg.editedAt && <span className="message-edited">(edited)</span>}
                                  {msg.pinned && <span className="message-pinned">📌</span>}
                                </div>
                              )}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="message-attachments">
                                  {msg.attachments.map((att, ai) => (
                                    <img key={ai} src={att} alt="attachment" className="message-attachment-img" />
                                  ))}
                                </div>
                              )}
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div className="message-reactions">
                                  {msg.reactions.map((reaction, ri) => (
                                    <button
                                      key={ri}
                                      className={`reaction-btn ${reaction.users.includes(user!._id) ? 'reaction-active' : ''}`}
                                      onClick={() => handleReact(msg._id, reaction.emoji)}
                                    >
                                      {reaction.emoji} <span className="reaction-count">{reaction.users.length}</span>
                                    </button>
                                  ))}
                                  <button className="reaction-btn reaction-add" onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                  </button>
                                </div>
                              )}
                              {showEmojiPicker === msg._id && (
                                <EmojiPicker
                                  onSelect={(emoji) => handleReact(msg._id, emoji)}
                                  onClose={() => setShowEmojiPicker(null)}
                                />
                              )}
                            </div>
                            <div className="message-actions">
                              <button className="message-action-btn" onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)} title="React">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                              </button>
                              <button className="message-action-btn" onClick={() => { handleReply(msg); handleOpenThread(msg); }} title="Reply">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                              </button>
                              <button className="message-action-btn" onClick={() => handlePinMessage(msg)} title={msg.pinned ? "Unpin" : "Pin"}>
                                <svg viewBox="0 0 24 24" fill={msg.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M12 2L8 6M12 2L16 6"/><path d="M4 12h16"/><path d="M17.5 7.5L6.5 18.5"/></svg>
                              </button>
                              {msg.author._id === user?._id && (
                                <>
                                  <button className="message-action-btn" onClick={() => handleEditMessage(msg)} title="Edit">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                  </button>
                                  <button className="message-action-btn message-action-danger" onClick={() => setDeleteMessage(msg)} title="Delete">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div className="typing-indicator">
              {typingUsers.length > 0 && (
                <>
                  <span className="typing-dots">
                    <span /><span /><span />
                  </span>
                  {typingUsers.map((u) => u.username).join(', ')}{' '}
                  {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </>
              )}
            </div>

            <MessageInput
              messageInput={messageInput}
              onMessageInputChange={setMessageInput}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              previewImage={previewImage}
              previewImageName={previewImageName}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadedFileUrl={uploadedFileUrl}
              onClearPreview={clearPreview}
              onFileUpload={handleFileUpload}
              onSendMessage={handleSendMessage}
              onCommandSelect={handleCommandSelect}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              EmojiPickerComponent={EmojiPicker}
            />
          </>
        ) : (
          <div className="empty-state">
            <ChatIcon />
            <h3>{viewMode === 'dms' ? 'Select a conversation' : 'Select a channel'}</h3>
            <p>
              {viewMode === 'dms'
                ? 'Choose a direct message from the list to start chatting.'
                : 'Choose a text channel from the sidebar to start chatting.'}
            </p>
          </div>
        )}
      </div>

      {/* Thread Panel */}
      {openThread && activeChannel && user && (
        <ThreadPanel
          parentMessage={openThread}
          channelId={activeChannel._id}
          user={user}
          onClose={handleCloseThread}
        />
      )}

      {/* Member Sidebar */}
      {showMembers && activeServer && viewMode === 'servers' && (
        <div className="member-sidebar" role="complementary" aria-label="Members">
          {onlineMembers.length > 0 && (
            <>
              <div className="member-category">Online - {onlineMembers.length}</div>
              {onlineMembers.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      getInitials(member.username)
                    )}
                    <div className={`status-dot ${member.status}`} />
                  </div>
                  <span className="member-name">{member.username}</span>
                </div>
              ))}
            </>
          )}
          {offlineMembers.length > 0 && (
            <>
              <div className="member-category">Offline - {offlineMembers.length}</div>
              {offlineMembers.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar" style={{ opacity: 0.5 }}>
                    {member.avatar ? (
                      <img src={member.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      getInitials(member.username)
                    )}
                    <div className={`status-dot ${member.status}`} />
                  </div>
                  <span className="member-name" style={{ opacity: 0.5 }}>{member.username}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Create Server Modal */}
      {showCreateServer && (
        <div className="modal-overlay" onClick={() => setShowCreateServer(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create a Server</h2>
            <input
              className="modal-input"
              placeholder="Server name"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateServer()}
            />
            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowCreateServer(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handleCreateServer}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="modal-overlay" onClick={() => setShowCreateChannel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create a Channel</h2>
            <input
              className="modal-input"
              placeholder="Channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateChannel()}
            />
            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowCreateChannel(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handleCreateChannel}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Switcher */}
      {showQuickSwitcher && (
        <QuickSwitcher
          servers={servers}
          dmConversations={dmConversations}
          onSelect={handleQuickSwitcherSelect}
          onClose={() => setShowQuickSwitcher(false)}
        />
      )}

      {/* Server Settings */}
      {showServerSettings && activeServer && (
        <ServerSettings
          server={activeServer}
          onClose={() => setShowServerSettings(false)}
          onUpdate={handleServerUpdate}
          onLeave={handleServerLeave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteMessage && (
        <div className="modal-overlay" onClick={() => setDeleteMessage(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Message</h2>
            <p>Are you sure you want to delete this message?</p>
            <div className="delete-preview">
              <strong>{deleteMessage.author.username}</strong>
              <span>{deleteMessage.content}</span>
            </div>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setDeleteMessage(null)}>Cancel</button>
              <button className="modal-btn modal-btn-danger" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div className="search-panel" onClick={(e) => e.stopPropagation()}>
          <div className="search-panel-header">
            <input
              className="search-panel-input"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              autoFocus
            />
            <button className="search-panel-close" onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}>✕</button>
          </div>
          <div className="search-panel-results">
            {searching && <div className="loading-center"><div className="loading-spinner" /></div>}
            {!searching && searchResults.length === 0 && searchQuery && (
              <div className="search-empty">No messages found</div>
            )}
            {searchResults.map((msg) => (
              <div key={msg._id} className="search-result" onClick={() => {
                setShowSearch(false);
                // Scroll to message
                const el = document.getElementById(`msg-${msg._id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}>
                <div className="search-result-author">{msg.author.username}</div>
                <div className="search-result-content">{msg.content}</div>
                <div className="search-result-time">{new Date(msg.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Messages Panel */}
      {showPins && (
        <div className="search-panel" onClick={(e) => e.stopPropagation()}>
          <div className="search-panel-header">
            <span className="search-panel-title">Pinned Messages</span>
            <button className="search-panel-close" onClick={() => setShowPins(false)}>✕</button>
          </div>
          <div className="search-panel-results">
            {pinnedMessages.length === 0 && <div className="search-empty">No pinned messages</div>}
            {pinnedMessages.map((msg) => (
              <div key={msg._id} className="search-result">
                <div className="search-result-author">{msg.author.username}</div>
                <div className="search-result-content">{msg.content}</div>
                <div className="search-result-actions">
                  <button onClick={() => handlePinMessage(msg)}>Unpin</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Settings */}
      {showUserSettings && user && (
        <Settings
          user={user}
          onClose={() => setShowUserSettings(false)}
          onLogout={logout}
        />
      )}

      {/* User Profile */}
      {viewingProfile && (
        <UserProfile
          userId={viewingProfile}
          onClose={() => setViewingProfile(null)}
          onStartDM={handleCreateDM}
        />
      )}

      {/* New DM */}
      {showNewDM && (
        <NewDM
          onClose={() => setShowNewDM(false)}
          onCreate={handleDMCreated}
        />
      )}

      {/* Join Server */}
      {showJoinServer && (
        <JoinServer
          onClose={() => setShowJoinServer(false)}
          onJoin={handleJoinServer}
        />
      )}
    </div>
  );
}
