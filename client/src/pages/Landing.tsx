import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './landing.css';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useStaggerReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.children;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, i) => {
              setTimeout(() => child.classList.add('revealed'), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#8C24EC" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="Inter">V</text>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r="0.5" />
      <circle cx="17.5" cy="10.5" r="0.5" />
      <circle cx="8.5" cy="7.5" r="0.5" />
      <circle cx="6.5" cy="12.5" r="0.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="M6 8h2M16 8h2M6 14h2M16 14h2M8 20h8M12 2v4" />
    </svg>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useScrollReveal();
  const featuresRef = useStaggerReveal();
  const ctaRef = useScrollReveal();
  const footerRef = useScrollReveal();

  const features = [
    {
      icon: <ChatBubbleIcon />,
      title: "Messaging",
      desc: "DM your friends, chat with groups, or build communities with channels.",
      bullets: ["Full Markdown support in messages", "Private DMs and group chats", "Organized channels for communities", "Share files and preview links"],
    },
    {
      icon: <MicIcon />,
      title: "Voice and Video",
      desc: "Hop in a call with friends or share your screen to work together.",
      bullets: ["Join from multiple devices at once", "Built-in screen sharing", "Noise suppression and echo cancellation", "Mute, deafen, and camera controls"],
    },
    {
      icon: <ShieldIcon />,
      title: "Moderation Tools",
      desc: "Keep your community running smoothly with roles, permissions, and logs.",
      bullets: ["Granular roles and permissions", "Moderation actions and tools", "Audit logs for transparency", "Webhooks and bot support"],
    },
    {
      icon: <SearchIcon />,
      title: "Search and Quick Switcher",
      desc: "Find old messages or jump between communities and channels in seconds.",
      bullets: ["Search message history", "Filter by users, dates, and more", "Quick switcher with keyboard shortcuts", "Manage friends and block users"],
    },
    {
      icon: <PaletteIcon />,
      title: "Customization",
      desc: "Add custom emojis, save media for later, and style the app with custom CSS.",
      bullets: ["Upload custom emojis and stickers", "Save images, videos, GIFs, and audio", "Custom CSS themes", "Compact mode and display options"],
    },
    {
      icon: <ServerIcon />,
      title: "Self-Hosting",
      desc: "Run the Vartalap backend on your own hardware and connect with our apps.",
      bullets: ["Fully open source", "Host your own instance", "Use the desktop client", "Switch between multiple instances"],
    },
  ];

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <LogoIcon />
          Vartalap
        </div>
        <div className="nav-links">
          {user ? (
            <button className="nav-link nav-link-primary" onClick={() => navigate('/app')}>
              Open App
            </button>
          ) : (
            <>
              <button className="nav-link" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="nav-link nav-link-primary" onClick={() => navigate('/register')}>
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="landing-hero reveal">
        <div className="hero-content">
          <div className="hero-cta-links">
            <span className="hero-cta-link">
              Open source &amp; self-hostable
            </span>
            <span className="hero-cta-link">
              End-to-end encrypted messaging
            </span>
          </div>
          <h1 className="gradient-text">A chat app that puts you first</h1>
          <div className="hero-badge">
            <span className="hero-badge-flag">&#127470;&#127475;</span>
            Made in India
          </div>
          <p>
            Vartalap is a free and open source instant messaging platform built for friends, groups, and communities.
          </p>
          <div className="hero-actions">
            {user ? (
              <button className="hero-btn hero-btn-primary" onClick={() => navigate('/app')}>
                Open Vartalap
              </button>
            ) : (
              <>
                <button className="hero-btn hero-btn-primary" onClick={() => navigate('/register')}>
                  Get Started
                </button>
                <button className="hero-btn hero-btn-secondary" onClick={() => navigate('/login')}>
                  Open in browser
                </button>
              </>
            )}
          </div>
          <a href="/register" className="hero-trial-link">
            Try Vartalap without an email in 30 seconds <ArrowIcon />
          </a>
        </div>

        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" />
              <div className="mockup-dot" />
              <div className="mockup-dot" />
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-server active">V</div>
                <div className="mockup-server">GC</div>
                <div className="mockup-server">DS</div>
                <div className="mockup-server">+</div>
              </div>
              <div className="mockup-channels">
                <div className="mockup-channel-label">Text Channels</div>
                <div className="mockup-channel active">general</div>
                <div className="mockup-channel">random</div>
                <div className="mockup-channel">announcements</div>
                <div className="mockup-channel">dev-talk</div>
              </div>
              <div className="mockup-chat">
                <div className="mockup-message">
                  <div className="mockup-msg-avatar" style={{ background: '#e74c3c' }}>A</div>
                  <div className="mockup-msg-content">
                    <div className="mockup-msg-author">Alex</div>
                    <div className="mockup-msg-text">Hey everyone! Welcome to the server 🎉</div>
                  </div>
                </div>
                <div className="mockup-message">
                  <div className="mockup-msg-avatar" style={{ background: '#3498db' }}>S</div>
                  <div className="mockup-msg-content">
                    <div className="mockup-msg-author">Sarah</div>
                    <div className="mockup-msg-text">Thanks! Excited to be here. What's everyone working on?</div>
                  </div>
                </div>
                <div className="mockup-message">
                  <div className="mockup-msg-avatar" style={{ background: '#2ecc71' }}>M</div>
                  <div className="mockup-msg-content">
                    <div className="mockup-msg-author">Mike</div>
                    <div className="mockup-msg-text">Building something cool with Vartalap!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-header">
          <h2>What's available today</h2>
          <p>All the basics you expect, plus a few things you don't.</p>
        </div>

        <div ref={featuresRef} className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card reveal-item" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul className="feature-bullets">
                {f.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="landing-cta reveal">
        <h2>Ready to get started?</h2>
        <p>Open Vartalap in your browser to start connecting with your communities.</p>
        <div className="cta-actions">
          <button className="hero-btn hero-btn-primary" onClick={() => navigate(user ? '/app' : '/register')}>
            {user ? 'Open Vartalap' : 'Get Started'}
          </button>
          <button className="hero-btn hero-btn-secondary" onClick={() => navigate('/login')}>
            Open in browser
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h3>Vartalap</h3>
            <ul>
              <li><a href="/download">Download</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">Source code</a></li>
              <li><a href="/help">Help center</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Policies</h3>
            <ul>
              <li><a href="/terms">Terms of service</a></li>
              <li><a href="/privacy">Privacy policy</a></li>
              <li><a href="/terms">Community guidelines</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <ul>
              <li><a href="mailto:hello@vartalap.app">hello@vartalap.app</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand">
            <LogoIcon />
            Vartalap
          </div>
          <div className="footer-credits">
            <span>Made by Divyanshu</span>
            <span>© Vartalap, {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
