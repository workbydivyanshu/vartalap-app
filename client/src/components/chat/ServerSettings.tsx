import React, { useState } from 'react';

interface Server { _id: string; name: string; icon: string; inviteCode?: string; }

interface ServerSettingsProps {
  server: Server;
  onClose: () => void;
  onUpdate: (name: string) => void;
  onLeave: () => void;
}

export default function ServerSettings({ server, onClose, onUpdate, onLeave }: ServerSettingsProps) {
  const [name, setName] = useState(server.name);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (name.trim() && name !== server.name) {
      onUpdate(name.trim());
    }
    onClose();
  };

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/invite/${server.inviteCode || server._id}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Server Settings</h2>
        <div className="form-group">
          <label>Server Name</label>
          <input
            className="modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Server name"
          />
        </div>
        <div className="form-group">
          <label>Invite Link</label>
          <div className="invite-row">
            <input
              className="modal-input"
              value={`${window.location.origin}/invite/${server.inviteCode || server._id}`}
              readOnly
              style={{ flex: 1 }}
            />
            <button className="modal-btn modal-btn-secondary" onClick={handleCopyInvite}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-danger" onClick={onLeave}>Leave Server</button>
          <div style={{ flex: 1 }} />
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
