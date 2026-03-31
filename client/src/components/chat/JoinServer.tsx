import React, { useState } from 'react';
import api from '../../api';

interface JoinServerProps {
  onClose: () => void;
  onJoin: (server: any) => void;
}

export default function JoinServer({ onClose, onJoin }: JoinServerProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Extract invite code from URL or use directly
      const code = inviteCode.includes('/') ? inviteCode.split('/').pop() : inviteCode;
      const { data } = await api.post(`/servers/join/${code}`);
      onJoin(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal join-server-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Join a Server</h2>
        <p className="join-server-desc">Enter an invite code to join an existing server</p>

        <input
          className="join-server-input"
          placeholder="Enter invite code or link..."
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
          autoFocus
        />

        {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="modal-actions">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn-primary" onClick={handleJoin} disabled={loading || !inviteCode.trim()}>
            {loading ? 'Joining...' : 'Join Server'}
          </button>
        </div>
      </div>
    </div>
  );
}
