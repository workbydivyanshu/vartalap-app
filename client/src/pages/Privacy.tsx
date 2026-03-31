import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

export default function Privacy() {
  return (
    <div className="pages-container">
      <div className="pages-nav">
        <Link to="/" className="pages-logo">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#5865f2" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">V</text>
          </svg>
          Vartalap
        </Link>
        <div className="pages-nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="pages-nav-cta">Sign Up Free</Link>
        </div>
      </div>

      <div className="legal-page">
        <h1>Privacy Policy</h1>
        <p className="legal-effective">Effective Date: March 1, 2026</p>

        <div className="legal-summary">
          <h2>The short version</h2>
          <p>We collect only what we need to run Vartalap. We don't sell your data. We use industry-standard security. You can delete your account and data at any time.</p>
        </div>

        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul>
            <li>Account information (email, username, display name)</li>
            <li>Messages and content you send</li>
            <li>Profile information (avatar, status)</li>
            <li>Server and channel data you create</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Vartalap service</li>
            <li>Deliver messages and notifications</li>
            <li>Improve and develop new features</li>
            <li>Ensure security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul>
            <li>Service providers who help us operate Vartalap</li>
            <li>Law enforcement when required by law</li>
            <li>Other users, only the information you choose to share</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Security</h2>
          <p>We use industry-standard security measures to protect your data. Messages are transmitted over encrypted connections. We recommend enabling two-factor authentication for additional security.</p>
        </section>

        <section className="legal-section">
          <h2>5. Data Retention</h2>
          <p>We retain your data as long as your account is active. When you delete your account, we delete your personal data within 30 days. Messages may be retained in server backups for up to 90 days.</p>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt out of non-essential data collection</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Cookies</h2>
          <p>We use essential cookies to maintain your session and provide the service. We do not use tracking cookies for advertising purposes.</p>
        </section>

        <section className="legal-section">
          <h2>8. Children's Privacy</h2>
          <p>Vartalap is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section className="legal-section">
          <h2>9. Changes</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via email or in-app notification.</p>
        </section>

        <section className="legal-section">
          <h2>10. Contact</h2>
          <p>Questions about privacy? Contact us at <a href="mailto:hello@vartalap.app">hello@vartalap.app</a>.</p>
        </section>
      </div>

      <footer className="pages-footer">
        <Link to="/" className="pages-logo">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#5865f2" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">V</text>
          </svg>
          Vartalap
        </Link>
        <div className="footer-credits">
          <span>Made by Divyanshu</span>
          <span>&copy; Vartalap, {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
