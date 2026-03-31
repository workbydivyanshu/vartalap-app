import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

export default function HelpCenter() {
  const categories = [
    { title: 'Getting Started', desc: 'How to create an account and get started with Vartalap.', articles: 5 },
    { title: 'Servers & Channels', desc: 'Creating, managing, and configuring your servers.', articles: 8 },
    { title: 'Messaging', desc: 'Sending messages, reactions, replies, and media.', articles: 6 },
    { title: 'Voice & Video', desc: 'Joining calls, screen sharing, and audio settings.', articles: 4 },
    { title: 'Privacy & Security', desc: 'Account security, privacy settings, and data management.', articles: 3 },
    { title: 'Billing & Premium', desc: 'Premium subscription, payments, and refunds.', articles: 2 },
  ];

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

      <div className="help-center">
        <h1>Help Center</h1>
        <p>Find answers to common questions and learn how to get the most out of Vartalap.</p>

        <div className="help-search">
          <input type="text" placeholder="Search for articles..." />
        </div>

        <div className="help-categories">
          {categories.map((cat, i) => (
            <div key={i} className="help-category-card">
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <span className="help-article-count">{cat.articles} articles</span>
            </div>
          ))}
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
