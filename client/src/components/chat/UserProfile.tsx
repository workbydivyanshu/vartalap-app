import React, { useEffect, useState } from 'react';
import api from '../../api';
import './UserProfile.css';

interface UserProfileProps {
  userId: string;
  onClose: () => void;
  onStartDM: (userId: string) => void;
}

interface UserData {
  _id: string;
  username: string;
  avatar: string;
  status: string;
  createdAt: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online': return 'var(--success)';
    case 'idle': return 'var(--warning)';
    case 'dnd': return 'var(--danger)';
    default: return 'var(--text-muted)';
  }
}

export default function UserProfile({ userId, onClose, onStartDM }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal user-profile-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-center"><div className="loading-spinner" /></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal user-profile-modal" onClick={(e) => e.stopPropagation()}>
          <h2>User not found</h2>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const joinDate = new Date(userData.createdAt).toLocaleDateString(undefined, {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-profile-banner" />
        <div className="user-profile-avatar-section">
          <div className="user-profile-avatar">
            {userData.avatar ? (
              <img src={userData.avatar} alt="" />
            ) : (
              userData.username.slice(0, 2).toUpperCase()
            )}
            <div className="user-profile-status" style={{ background: getStatusColor(userData.status) }} />
          </div>
        </div>
        <div className="user-profile-info">
          <h2>{userData.username}</h2>
          <span className="user-profile-tag">@{userData.username}</span>
          <div className="user-profile-status-text">
            <span style={{ color: getStatusColor(userData.status) }}>● {userData.status}</span>
          </div>
        </div>
        <div className="user-profile-section">
          <h4>Member Since</h4>
          <p>{joinDate}</p>
        </div>
        <div className="user-profile-actions">
          <button className="modal-btn modal-btn-primary" onClick={() => { onStartDM(userId); onClose(); }}>
            Send Message
          </button>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
