import React, { useState } from 'react';
import api from '../../api';
import './NewDM.css';

interface NewDMProps {
  onClose: () => void;
  onCreate: (conversationId: string, participantName: string) => void;
}

interface UserResult {
  _id: string;
  username: string;
  avatar: string;
  status: string;
}

export default function NewDM({ onClose, onCreate }: NewDMProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(data);
    } catch (error) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (userId: string, username: string) => {
    setCreating(true);
    try {
      const { data } = await api.post('/dms', { recipientId: userId });
      onCreate(data._id, username);
      onClose();
    } catch (error) {
      console.error('Failed to create DM');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal new-dm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>New Conversation</h2>
        <p className="new-dm-desc">Search for a user to start a conversation</p>

        <input
          className="new-dm-search"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />

        <div className="new-dm-results">
          {loading && <div className="loading-center"><div className="loading-spinner" /></div>}
          {!loading && results.length === 0 && query && (
            <div className="new-dm-empty">No users found</div>
          )}
          {results.map((user) => (
            <button
              key={user._id}
              className="new-dm-user"
              onClick={() => handleCreate(user._id, user.username)}
              disabled={creating}
            >
              <div className="new-dm-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  user.username.slice(0, 2).toUpperCase()
                )}
                <div className={`new-dm-status ${user.status}`} />
              </div>
              <span className="new-dm-name">{user.username}</span>
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
