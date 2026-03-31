import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { Message, User } from '../../types';
import './ThreadPanel.css';

interface ThreadPanelProps {
  parentMessage: Message;
  channelId: string;
  user: User;
  onClose: () => void;
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function formatTime(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString();
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

export default function ThreadPanel({ parentMessage, channelId, user, onClose }: ThreadPanelProps) {
  const [replies, setReplies] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadThread = async () => {
      try {
        const { data } = await api.get(`/channels/${channelId}/messages/${parentMessage._id}/thread`);
        setReplies(data.replies || []);
      } catch (error) {
        console.error('Failed to load thread');
      } finally {
        setLoading(false);
      }
    };
    loadThread();
  }, [channelId, parentMessage._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const { data } = await api.post(`/channels/${channelId}/messages`, {
        content: content.trim(),
        replyTo: parentMessage._id,
      });
      setReplies((prev) => [...prev, data]);
      setContent('');
    } catch (error) {
      console.error('Failed to send reply');
    }
  };

  const handleReact = async (msgId: string, emoji: string) => {
    try {
      const { data } = await api.post(`/channels/${channelId}/messages/${msgId}/react`, { emoji });
      setReplies((prev) => prev.map((m) => m._id === msgId ? data : m));
    } catch (error) {
      console.error('Failed to react');
    }
  };

  return (
    <div className="thread-panel" role="complementary" aria-label="Thread">
      <div className="thread-header">
        <h3>Thread</h3>
        <button className="thread-close" onClick={onClose} aria-label="Close thread">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="thread-messages">
        {/* Parent message */}
        <div className="thread-parent">
          <div className="thread-parent-header">
            <div className="message-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {parentMessage.author.avatar ? (
                <img src={parentMessage.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                getInitials(parentMessage.author.username)
              )}
            </div>
            <span className="message-author">{parentMessage.author.username}</span>
            <span className="message-time">{formatTime(parentMessage.createdAt)}</span>
          </div>
          <div className="message-text">{parentMessage.content}</div>
        </div>

        <div className="thread-divider">
          <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
        </div>

        {/* Thread replies */}
        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /></div>
        ) : (
          replies.map((msg) => (
            <div key={msg._id} className="thread-message">
              <div className="message-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                {msg.author.avatar ? (
                  <img src={msg.author.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  getInitials(msg.author.username)
                )}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">{msg.author.username}</span>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
                <div className="message-text">{msg.content}</div>
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="message-reactions">
                    {msg.reactions.map((r, ri) => (
                      <button key={ri} className={`reaction-btn ${r.users.includes(user._id) ? 'reaction-active' : ''}`} onClick={() => handleReact(msg._id, r.emoji)}>
                        {r.emoji} <span className="reaction-count">{r.users.length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="thread-input">
        <input
          placeholder="Reply to thread..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button onClick={handleSend} disabled={!content.trim()} aria-label="Send reply">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
