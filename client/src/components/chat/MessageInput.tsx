import React, { useRef } from 'react';
import { Message } from '../../types';

interface MessageInputProps {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  previewImage: string | null;
  previewImageName: string;
  uploading: boolean;
  uploadProgress: number;
  uploadedFileUrl: string | null;
  onClearPreview: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onCommandSelect: (processedContent: string) => void;
  showEmojiPicker: string | null;
  setShowEmojiPicker: (id: string | null) => void;
  EmojiPickerComponent: React.ComponentType<{ onSelect: (emoji: string) => void; onClose: () => void }>;
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CommandSuggestions({ input, onSelect }: { input: string; onSelect: (content: string) => void }) {
  const commands = [
    { name: '/shrug', desc: 'Append a shrug', exec: (a: string) => `${a} ¯\\_(ツ)_/¯`.trim() },
    { name: '/me', desc: 'Italic action', exec: (a: string) => `*${a}*` },
    { name: '/tableflip', desc: 'Flip a table', exec: () => '(╯°□°）╯︵ ┻━┻' },
    { name: '/unflip', desc: 'Unflip a table', exec: () => '┬─┬ノ( º _ ºノ)' },
    { name: '/lenny', desc: 'Lenny face', exec: (a: string) => `${a} ( ͡° ͜ʖ ͡°)`.trim() },
    { name: '/help', desc: 'Show commands', exec: () => 'Commands: /shrug, /me, /tableflip, /unflip, /lenny' },
  ];
  const query = input.split(' ')[0].toLowerCase();
  const filtered = commands.filter(c => c.name.startsWith(query));
  if (!input.startsWith('/') || filtered.length === 0) return null;
  return (
    <div className="command-suggestions" role="listbox">
      {filtered.map(cmd => (
        <button key={cmd.name} className="command-item" onClick={() => onSelect(cmd.exec(input.slice(cmd.name.length).trim()))}>
          <span className="command-name">{cmd.name}</span>
          <span className="command-desc">{cmd.desc}</span>
        </button>
      ))}
    </div>
  );
}

export default function MessageInput({
  messageInput, onMessageInputChange, replyingTo, onCancelReply,
  previewImage, previewImageName, uploading, uploadProgress, uploadedFileUrl,
  onClearPreview, onFileUpload, onSendMessage, onCommandSelect,
  showEmojiPicker, setShowEmojiPicker, EmojiPickerComponent,
}: MessageInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="message-input-container">
      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Preview" />
          <div className="image-preview-info">
            <span>{previewImageName}</span>
            {uploading && <div className="upload-progress"><div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} /></div>}
            {uploadedFileUrl && <span className="upload-ready">Ready to send</span>}
          </div>
          <button className="image-preview-remove" onClick={onClearPreview}>✕</button>
        </div>
      )}
      {replyingTo && (
        <div className="reply-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
          <span>Replying to <strong>{replyingTo.author.username}</strong></span>
          <span className="reply-preview">{replyingTo.content}</span>
          <button className="reply-cancel" onClick={onCancelReply}>✕</button>
        </div>
      )}
      {messageInput.startsWith('/') && <CommandSuggestions input={messageInput} onSelect={onCommandSelect} />}
      <form onSubmit={onSendMessage} className="message-input-wrapper">
        <div className="input-actions">
          <button type="button" className="input-action-btn" onClick={() => document.getElementById('file-upload')?.click()} title="Attach file" aria-label="Attach file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input id="file-upload" type="file" style={{ display: 'none' }} accept="image/*" onChange={onFileUpload} />
          <button type="button" className="input-action-btn" onClick={() => setShowEmojiPicker(showEmojiPicker === 'input' ? null : 'input')} title="Emoji" aria-label="Emoji picker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          {showEmojiPicker === 'input' && (
            <EmojiPickerComponent onSelect={(emoji: string) => { onMessageInputChange(messageInput + emoji); setShowEmojiPicker(null); }} onClose={() => setShowEmojiPicker(null)} />
          )}
        </div>
        <textarea
          ref={inputRef}
          className="message-input"
          id="message-input"
          placeholder="Message #general"
          value={messageInput}
          onChange={(e) => onMessageInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(e); } }}
          rows={1}
        />
        <div className="input-actions">
          <button type="submit" className="input-action-btn" disabled={(!messageInput.trim() && !uploadedFileUrl) || uploading} aria-label="Send message">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
