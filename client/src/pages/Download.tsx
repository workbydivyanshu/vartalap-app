import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

export default function Download() {
  return (
    <div className="pages-container">
      <div className="pages-nav">
        <Link to="/" className="pages-logo">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#8C24EC" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">V</text>
          </svg>
          Vartalap
        </Link>
        <div className="pages-nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="pages-nav-cta">Sign Up Free</Link>
        </div>
      </div>

      <div className="download-page">
        <h1>Download Vartalap</h1>
        <p>Get Vartalap on all your devices for the best experience.</p>

        <div className="download-grid">
          <div className="download-card">
            <div className="download-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
            </div>
            <h3>Windows</h3>
            <p>Windows 10 or later</p>
            <button className="download-btn">Download for Windows</button>
          </div>

          <div className="download-card">
            <div className="download-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            </div>
            <h3>macOS</h3>
            <p>macOS 10.15 or later</p>
            <button className="download-btn">Download for macOS</button>
          </div>

          <div className="download-card">
            <div className="download-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.56.88-.13 1.37-.567 2.03-.567.66 0 1.13.41 2 .567.66.13 1.73-.13 2.39-.566.66-.4 1.09-.73 1.86-.73.77 0 1.37.464 1.94.596.57.136 1.04.136 1.37-.2.33-.334.41-.934.2-1.6-.21-.666-.35-1.133-.18-1.6.18-.466.41-.733.77-1.066.37-.334.77-.867 1.05-1.8.28-.93.28-1.867.08-2.534-.19-.666-.49-1.066-.89-1.533-.4-.467-.87-.867-1.37-1.4-.5-.534-1.08-1.067-1.37-1.6-.28-.534-.37-1.067-.37-1.6 0-.534.13-1.067.53-1.6.4-.534 1.05-.8 1.65-1.067.6-.267 1.14-.4 1.57-.733.44-.334.74-.8.89-1.334.15-.533.1-1.066-.08-1.533-.19-.466-.52-.866-1.05-1.133-.54-.267-1.05-.267-1.54-.267-.49 0-.94.067-1.34.334-.4.266-.7.666-1.05 1.066-.35.4-.7.8-1.09 1.067-.39.266-.8.4-1.25.4-.44 0-.84-.134-1.24-.4-.4-.267-.8-.667-1.15-1.067-.35-.4-.65-.8-.99-1.067-.35-.267-.74-.334-1.2-.334z"/></svg>
            </div>
            <h3>Linux</h3>
            <p>Ubuntu, Debian, Fedora, and more</p>
            <button className="download-btn">Download for Linux</button>
          </div>
        </div>

        <div className="download-mobile">
          <h2>Mobile apps are underway</h2>
          <p>While we work on native mobile apps, you can install Vartalap as a Progressive Web App for the best mobile experience.</p>
          <ol>
            <li>Open <Link to="/app">vartalap.app</Link> in your mobile browser</li>
            <li>Tap "Add to Home Screen" when prompted</li>
            <li>Use Vartalap like a native app</li>
          </ol>
        </div>
      </div>

      <footer className="pages-footer">
        <Link to="/" className="pages-logo">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#8C24EC" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">V</text>
          </svg>
          Vartalap
        </Link>
        <span>&copy; Vartalap, {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
