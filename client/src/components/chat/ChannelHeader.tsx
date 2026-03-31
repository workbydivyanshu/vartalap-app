import React from 'react';
import { Channel } from '../../types';

interface ChannelHeaderProps {
  channel: Channel | null;
  dmName?: string;
  showMembers: boolean;
  showSearch: boolean;
  showPins: boolean;
  onToggleMembers: () => void;
  onToggleSearch: () => void;
  onTogglePins: () => void;
  onLoadPins: () => void;
  onSettingsClick: () => void;
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
  hasServer: boolean;
}

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

export default function ChannelHeader({
  channel, dmName, showMembers, showSearch, showPins,
  onToggleMembers, onToggleSearch, onTogglePins, onLoadPins,
  onSettingsClick, showMobileMenu, onToggleMobileMenu, hasServer,
}: ChannelHeaderProps) {
  return (
    <div className="chat-header">
      <button className="mobile-menu-btn" onClick={onToggleMobileMenu} aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <HashIcon />
      <span className="chat-header-title">{channel?.name || dmName || 'Chat'}</span>
      {channel?.topic && <span className="chat-header-topic">{channel.topic}</span>}
      <div className="chat-header-actions">
        <button className="header-action-btn" onClick={onToggleSearch} title="Search" aria-label="Search messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button className="header-action-btn" onClick={() => { onTogglePins(); if (!showPins) onLoadPins(); }} title="Pinned Messages" aria-label="Pinned messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M12 2L8 6M12 2L16 6M4 12h16"/></svg>
        </button>
        {hasServer && (
          <button className="header-action-btn" onClick={onToggleMembers} title="Toggle Member List" aria-label="Toggle member list">
            <MembersIcon />
          </button>
        )}
      </div>
    </div>
  );
}
