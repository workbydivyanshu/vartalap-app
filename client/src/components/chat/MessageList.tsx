import React, { useRef, useEffect, useCallback } from 'react';
import { Message, User } from '../../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  user: User;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
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

export default function MessageList({
  messages, user, loadingMore, hasMore, onLoadMore,
  editingMessage, editContent, onEditContentChange, onSaveEdit, onCancelEdit,
  onViewProfile, onReply, onReact, onPin, onEdit, onDelete, onOpenThread,
  showEmojiPicker, setShowEmojiPicker, EmojiPickerComponent,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Scroll handler for pagination
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop < 100 && !loadingMore && hasMore) {
        onLoadMore();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, loadingMore, hasMore]);

  return (
    <div ref={containerRef} className="messages-container" role="log" aria-live="polite" aria-label="Messages">
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
                <MessageItem
                  msg={msg}
                  index={index}
                  messages={messages}
                  user={user}
                  showHeader={showHeader}
                  showDateDivider={showDateDivider}
                  editingMessage={editingMessage}
                  editContent={editContent}
                  onEditContentChange={onEditContentChange}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onViewProfile={onViewProfile}
                  onReply={onReply}
                  onReact={onReact}
                  onPin={onPin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenThread={onOpenThread}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  EmojiPickerComponent={EmojiPickerComponent}
                />
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
