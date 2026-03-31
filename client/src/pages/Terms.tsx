import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

export default function Terms() {
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
        <h1>Terms of Service</h1>
        <p className="legal-effective">Effective Date: March 1, 2026</p>

        <div className="legal-summary">
          <h2>The short version</h2>
          <p>By using Vartalap, you agree to follow the rules. Don't do anything harmful or illegal. We may update these terms from time to time. If you don't agree, please don't use the service.</p>
        </div>

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Vartalap, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the service.</p>
        </section>

        <section className="legal-section">
          <h2>2. Your Account</h2>
          <p>You are responsible for maintaining the security of your account and password. You must provide accurate information when creating your account. You must be at least 13 years old to use Vartalap.</p>
        </section>

        <section className="legal-section">
          <h2>3. Acceptable Use</h2>
          <p>You agree not to use Vartalap to:</p>
          <ul>
            <li>Post harmful, abusive, or illegal content</li>
            <li>Harass, threaten, or intimidate other users</li>
            <li>Spam or send unsolicited messages</li>
            <li>Attempt to gain unauthorized access to other accounts</li>
            <li>Distribute malware or engage in phishing</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Content</h2>
          <p>You retain ownership of content you post on Vartalap. By posting content, you grant us a license to host, store, and display it as necessary to provide the service. We reserve the right to remove content that violates these terms.</p>
        </section>

        <section className="legal-section">
          <h2>5. Privacy</h2>
          <p>Your privacy is important to us. Please review our <Link to="/privacy">Privacy Policy</Link> to understand how we collect, use, and protect your information.</p>
        </section>

        <section className="legal-section">
          <h2>6. Termination</h2>
          <p>We may terminate or suspend your account at any time for violations of these terms. You may delete your account at any time through your account settings.</p>
        </section>

        <section className="legal-section">
          <h2>7. Disclaimer</h2>
          <p>Vartalap is provided "as is" without warranties of any kind. We do not guarantee the service will be uninterrupted or error-free.</p>
        </section>

        <section className="legal-section">
          <h2>8. Changes</h2>
          <p>We may update these terms from time to time. Continued use of Vartalap after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section className="legal-section">
          <h2>9. Contact</h2>
          <p>Questions about these terms? Contact us at <a href="mailto:hello@vartalap.app">hello@vartalap.app</a>.</p>
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
