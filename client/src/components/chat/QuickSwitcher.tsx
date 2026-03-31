import React, { useState, useEffect, useRef } from 'react';

interface Server { _id: string; name: string; channels: Channel[]; }
interface Channel { _id: string; name: string; type: string; server?: string; }
interface DMConversation { _id: string; participants: { _id: string; username: string }[]; }

interface QuickSwitcherProps {
  servers: Server[];
  dmConversations: DMConversation[];
  onSelect: (type: 'server' | 'channel' | 'dm', serverId?: string, channelId?: string, dmId?: string) => void;
  onClose: () => void;
}

export default function QuickSwitcher({ servers, dmConversations, onSelect, onClose }: QuickSwitcherProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getResults = () => {
    const q = query.toLowerCase();
    const results: { type: string; label: string; sublabel?: string; serverId?: string; channelId?: string; dmId?: string; icon: string }[] = [];

    // DMs
    dmConversations.forEach((dm) => {
      const name = dm.participants.map((p) => p.username).join(', ');
      if (!q || name.toLowerCase().includes(q)) {
        results.push({ type: 'dm', label: name, icon: 'DM', dmId: dm._id });
      }
    });

    // Servers and channels
    servers.forEach((server) => {
      const serverMatch = !q || server.name.toLowerCase().includes(q);
      server.channels.forEach((ch) => {
        if (serverMatch || ch.name.toLowerCase().includes(q)) {
          results.push({
            type: 'channel',
            label: `# ${ch.name}`,
            sublabel: server.name,
            serverId: server._id,
            channelId: ch._id,
            icon: '#',
          });
        }
      });
    });

    return results.slice(0, 20);
  };

  const results = getResults();

  return (
    <div className="quick-switcher-overlay" onClick={onClose}>
      <div className="quick-switcher" onClick={(e) => e.stopPropagation()}>
        <div className="quick-switcher-header">
          <span className="quick-switcher-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="quick-switcher-input"
            placeholder="Search channels, DMs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="quick-switcher-results">
          {results.length === 0 && (
            <div className="quick-switcher-empty">No results found</div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              className="quick-switcher-item"
              onClick={() => {
                onSelect(r.type as any, r.serverId, r.channelId, r.dmId);
                onClose();
              }}
            >
              <span className="quick-switcher-item-icon">{r.icon}</span>
              <div className="quick-switcher-item-text">
                <span className="quick-switcher-item-label">{r.label}</span>
                {r.sublabel && <span className="quick-switcher-item-sublabel">{r.sublabel}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
