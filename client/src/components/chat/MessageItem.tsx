import React from 'react';
import { Message, User } from '../../types';

interface MessageItemProps {
  msg: Message;
  index: number;
  messages: Message[];
  user: User;
  showHeader: boolean;
  showDateDivider: boolean;
  editingMessage: string | null;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onSaveEdit: (msgId: string) => void;
  onCancelEdit: () => void;
  onViewProfile: (userId: string) => void;
  onReply: (msg: Message) => void;
  onReact: (msgId: string, emoji: string) => void;
  onPin: (msg: Message) => void;
  onEdit: (msg: Message) => void;
  onDelete: (msg: Message) => void;
  onOpenThread: (msg: Message) => void;
  showEmojiPicker: string | null;
  setShowEmojiPicker: (id: string | null) => void;
  EmojiPickerComponent: React.ComponentType<{ onSelect: (emoji: string) => void; onClose: () => void }>;
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

export default function MessageItem({
  msg, index, messages, user, showHeader, showDateDivider,
  editingMessage, editContent, onEditContentChange, onSaveEdit, onCancelEdit,
  onViewProfile, onReply, onReact, onPin, onEdit, onDelete, onOpenThread,
  showEmojiPicker, setShowEmojiPicker, EmojiPickerComponent,
}: MessageItemProps) {
  return (
    <React.Fragment>
      {showDateDivider && (
        <div className="date-divider">
          <span>{new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}
      <div id={`msg-${msg._id}`} className={`message ${showHeader ? 'message-header-visible' : 'message-compact'}`}>
        {showHeader ? (
          <div className="message-avatar" onClick={() => onViewProfile(msg.author._id)} title="View Profile">
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
              <span className="message-author" onClick={() => onViewProfile(msg.author._id)}>{msg.author.username}</span>
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
              <textarea className="message-edit-input" value={editContent} onChange={(e) => onEditContentChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSaveEdit(msg._id); } if (e.key === 'Escape') onCancelEdit(); }} autoFocus />
              <div className="message-edit-hint">escape to <span onClick={onCancelEdit}>cancel</span> • enter to <span onClick={() => onSaveEdit(msg._id)}>save</span></div>
            </div>
          ) : (
            <div className="message-text">{msg.content}{msg.editedAt && <span className="message-edited">(edited)</span>}{msg.pinned && <span className="message-pinned">📌</span>}</div>
          )}
          {msg.attachments && msg.attachments.length > 0 && (
            <div className="message-attachments">{msg.attachments.map((att, ai) => (<img key={ai} src={att} alt="attachment" className="message-attachment-img" />))}</div>
          )}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="message-reactions">
              {msg.reactions.map((reaction, ri) => (
                <button key={ri} className={`reaction-btn ${reaction.users.includes(user._id) ? 'reaction-active' : ''}`} onClick={() => onReact(msg._id, reaction.emoji)}>
                  {reaction.emoji} <span className="reaction-count">{reaction.users.length}</span>
                </button>
              ))}
              <button className="reaction-btn reaction-add" onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          )}
          {showEmojiPicker === msg._id && <EmojiPickerComponent onSelect={(emoji) => onReact(msg._id, emoji)} onClose={() => setShowEmojiPicker(null)} />}
        </div>
        <div className="message-actions">
          <button className="message-action-btn" onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)} title="React">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          <button className="message-action-btn" onClick={() => { onReply(msg); onOpenThread(msg); }} title="Reply">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
          </button>
          <button className="message-action-btn" onClick={() => onPin(msg)} title={msg.pinned ? "Unpin" : "Pin"}>
            <svg viewBox="0 0 24 24" fill={msg.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M12 2L8 6M12 2L16 6"/><path d="M4 12h16"/></svg>
          </button>
          {msg.author._id === user._id && (
            <>
              <button className="message-action-btn" onClick={() => onEdit(msg)} title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="message-action-btn message-action-danger" onClick={() => onDelete(msg)} title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
