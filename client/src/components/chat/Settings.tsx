import React, { useState, useEffect } from 'react';
import api from '../../api';
import './Settings.css';

interface SettingsProps {
  user: { _id: string; username: string; email: string; avatar: string; status: string };
  onClose: () => void;
  onLogout: () => void;
}

// Load preferences from localStorage
function loadPrefs() {
  try {
    const saved = localStorage.getItem('vartalap-prefs');
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

// Save preferences to localStorage
function savePrefs(prefs: Record<string, any>) {
  localStorage.setItem('vartalap-prefs', JSON.stringify(prefs));
}

const sections = [
  { id: 'account', label: 'My Account', icon: '👤' },
  { id: 'profile', label: 'User Profile', icon: '🎨' },
  { id: 'privacy', label: 'Privacy & Safety', icon: '🔒' },
  { id: 'apps', label: 'Authorized Apps', icon: '📱' },
  { id: 'connections', label: 'Connections', icon: '🔗' },
  { id: 'devices', label: 'Devices', icon: '💻' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  { id: 'voice', label: 'Voice & Video', icon: '🎤' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'keybinds', label: 'Keybinds', icon: '⌨️' },
  { id: 'language', label: 'Language', icon: '🌐' },
  { id: 'streamer', label: 'Streamer Mode', icon: '📺' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️' },
];

export default function Settings({ user, onClose, onLogout }: SettingsProps) {
  const [activeSection, setActiveSection] = useState('account');
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState(() => loadPrefs().theme || 'dark');
  const [language, setLanguage] = useState(() => loadPrefs().language || 'en');
  const [notifDesktop, setNotifDesktop] = useState(() => loadPrefs().notifDesktop ?? true);
  const [notifSound, setNotifSound] = useState(() => loadPrefs().notifSound ?? true);
  const [notifDMs, setNotifDMs] = useState(() => loadPrefs().notifDMs ?? true);
  const [reducedMotion, setReducedMotion] = useState(() => loadPrefs().reducedMotion ?? false);
  const [developerMode, setDeveloperMode] = useState(() => loadPrefs().developerMode ?? false);
  const [streamerMode, setStreamerMode] = useState(() => loadPrefs().streamerMode ?? false);
  const [autoStart, setAutoStart] = useState(() => loadPrefs().autoStart ?? false);
  const [minimizeTray, setMinimizeTray] = useState(() => loadPrefs().minimizeTray ?? true);
  const [showMemberList, setShowMemberList] = useState(() => loadPrefs().showMemberList ?? true);
  const [fontSize, setFontSize] = useState(() => loadPrefs().fontSize || 16);
  const [zoom, setZoom] = useState(() => loadPrefs().zoom || 100);
  const [saving, setSaving] = useState(false);

  // Apply theme on mount and when changed
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Save all settings
  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to API
      await api.patch('/auth/me', { username, displayName, email });

      // Save to localStorage
      savePrefs({
        theme, language, notifDesktop, notifSound, notifDMs,
        reducedMotion, developerMode, streamerMode, autoStart,
        minimizeTray, showMemberList, fontSize, zoom,
      });

      // Apply font size
      document.documentElement.style.fontSize = `${fontSize}px`;
      // Apply zoom
      document.body.style.zoom = `${zoom}%`;

      onClose();
    } catch (error) {
      console.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="settings-content">
            <h2>My Account</h2>
            <p className="settings-desc">Manage your account settings and preferences.</p>

            <div className="settings-card">
              <div className="account-header">
                <div className="account-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" />
                  ) : (
                    <div className="account-avatar-placeholder">{user.username.slice(0, 2).toUpperCase()}</div>
                  )}
                  <div className={`account-status ${user.status}`} />
                </div>
                <div className="account-info">
                  <h3>{displayName || user.username}</h3>
                  <span className="account-tag">@{user.username}</span>
                </div>
                <button className="settings-btn settings-btn-secondary">Edit User Profile</button>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-field">
                <label>Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What should people call you?" />
              </div>
              <div className="settings-field">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="settings-field">
                <label>Email</label>
                <div className="settings-field-row">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button className="settings-btn settings-btn-small">Edit</button>
                </div>
              </div>
              <div className="settings-field">
                <label>Phone Number</label>
                <button className="settings-btn settings-btn-secondary settings-btn-small">Add a phone number</button>
              </div>
            </div>

            <div className="settings-card">
              <h3>Password and Authentication</h3>
              <button className="settings-btn settings-btn-secondary">Change Password</button>
            </div>

            <div className="settings-card">
              <h3>Two-Factor Authentication</h3>
              <p>Protect your account with an extra layer of security.</p>
              <button className="settings-btn settings-btn-primary">Enable Two-Factor Auth</button>
            </div>

            <div className="settings-card settings-card-danger">
              <h3>Account Removal</h3>
              <p>Disabling your account means you can recover it at any time after leaving.</p>
              <div className="settings-danger-actions">
                <button className="settings-btn settings-btn-danger">Disable Account</button>
                <button className="settings-btn settings-btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="settings-content">
            <h2>User Profile</h2>
            <p className="settings-desc">Customize how others see you on Vartalap.</p>
            <div className="settings-card">
              <div className="profile-preview">
                <div className="profile-preview-card">
                  <div className="profile-banner" />
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-large">
                      {user.avatar ? <img src={user.avatar} alt="" /> : user.username.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="profile-details">
                    <h3>{displayName || user.username}</h3>
                    <span>@{user.username}</span>
                    <div className="profile-about">
                      <h4>About Me</h4>
                      <textarea placeholder="Tell us about yourself..." rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-content">
            <h2>Privacy & Safety</h2>
            <p className="settings-desc">Manage your privacy settings.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Allow DMs from server members</h4>
                  <p>When you join a new server, members of that server can send you DMs.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={notifDMs} onChange={() => setNotifDMs(!notifDMs)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Data collection</h4>
                  <p>Allow Vartalap to collect usage data to improve the service.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="settings-content">
            <h2>Accessibility</h2>
            <p className="settings-desc">Configure accessibility settings for a better experience.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Reduce Motion</h4>
                  <p>Reduces the amount of animation in the interface.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Play Animated Emoji</h4>
                  <p>Animated emoji will play when this is enabled.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Show Role Colors</h4>
                  <p>Show role colors next to usernames in chat.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
            <div className="settings-card">
              <h3>Text & Display</h3>
              <div className="settings-field">
                <label>Chat Font Scaling: {fontSize}px</label>
                <input type="range" min={12} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
              </div>
              <div className="settings-field">
                <label>Zoom Level: {zoom}%</label>
                <input type="range" min={50} max={200} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="settings-content">
            <h2>Voice & Video</h2>
            <p className="settings-desc">Configure your voice and video settings.</p>
            <div className="settings-card">
              <div className="settings-field">
                <label>Input Device</label>
                <select className="settings-select"><option>Default</option></select>
              </div>
              <div className="settings-field">
                <label>Output Device</label>
                <select className="settings-select"><option>Default</option></select>
              </div>
              <div className="settings-field">
                <label>Input Volume</label>
                <input type="range" min={0} max={100} defaultValue={100} />
              </div>
              <div className="settings-field">
                <label>Output Volume</label>
                <input type="range" min={0} max={100} defaultValue={100} />
              </div>
            </div>
            <div className="settings-card">
              <h3>Noise Suppression</h3>
              <p>Reduce background noise in voice calls.</p>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-content">
            <h2>Notifications</h2>
            <p className="settings-desc">Manage your notification preferences.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Enable Desktop Notifications</h4>
                  <p>Show notifications on your desktop.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={notifDesktop} onChange={() => setNotifDesktop(!notifDesktop)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Enable Notification Sounds</h4>
                  <p>Play a sound when you receive a notification.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={notifSound} onChange={() => setNotifSound(!notifSound)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Enable Unread Message Badge</h4>
                  <p>Show a badge on the app icon for unread messages.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="settings-content">
            <h2>Chat</h2>
            <p className="settings-desc">Customize your chat experience.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Show Member List</h4>
                  <p>Show the member list on the right side of the chat.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={showMemberList} onChange={() => setShowMemberList(!showMemberList)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Compact Mode</h4>
                  <p>Show messages with less spacing.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Show Embeds</h4>
                  <p>Show link previews and embeds in chat.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Show Reactions</h4>
                  <p>Show emoji reactions on messages.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="settings-content">
            <h2>Language</h2>
            <p className="settings-desc">Select your preferred language.</p>
            <div className="settings-card">
              <div className="settings-field">
                <label>Language</label>
                <select className="settings-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="es">Espa&ntilde;ol</option>
                  <option value="fr">Fran&ccedil;ais</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Portugu&ecirc;s</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="zh">中文</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="settings-content">
            <h2>Advanced</h2>
            <p className="settings-desc">Advanced settings for power users.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Developer Mode</h4>
                  <p>Enables right-click copying of IDs for developers.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={developerMode} onChange={() => setDeveloperMode(!developerMode)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Hardware Acceleration</h4>
                  <p>Use GPU to render the app for better performance.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Auto-start on Login</h4>
                  <p>Start Vartalap when your computer starts.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={autoStart} onChange={() => setAutoStart(!autoStart)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Minimize to Tray</h4>
                  <p>Minimize Vartalap to the system tray instead of closing.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={minimizeTray} onChange={() => setMinimizeTray(!minimizeTray)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
            <div className="settings-card">
              <h3>Cache</h3>
              <p>Clear cached data to free up space.</p>
              <button className="settings-btn settings-btn-secondary">Clear Cache</button>
            </div>
          </div>
        );

      case 'streamer':
        return (
          <div className="settings-content">
            <h2>Streamer Mode</h2>
            <p className="settings-desc">Hide personal information while streaming.</p>
            <div className="settings-card">
              <div className="settings-toggle-row">
                <div>
                  <h4>Enable Streamer Mode</h4>
                  <p>Hides personal information from your stream.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={streamerMode} onChange={() => setStreamerMode(!streamerMode)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Hide Personal Information</h4>
                  <p>Hides your email, username, and connected accounts.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <h4>Hide Invite Links</h4>
                  <p>Hides invite links in chat.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-content">
            <h2>{sections.find((s) => s.id === activeSection)?.label}</h2>
            <p className="settings-desc">This section is under construction.</p>
            <div className="settings-card">
              <p>Settings for this section will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-scroll">
            <div className="settings-sidebar-section">USER SETTINGS</div>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
            <div className="settings-sidebar-divider" />
            <button className="settings-sidebar-item settings-sidebar-logout" onClick={onLogout}>
              Log Out
            </button>
          </div>
          <div className="settings-sidebar-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>ESC</span>
          </div>
        </div>

        {/* Content */}
        <div className="settings-content-area">
          {renderContent()}
          <div className="settings-actions">
            <button className="settings-btn settings-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="settings-btn settings-btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
          <button className="settings-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
