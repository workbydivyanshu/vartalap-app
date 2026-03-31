import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import HelpCenter from './pages/HelpCenter';
import Download from './pages/Download';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import './styles/ui-improvements.css';
import './components/common/Toast.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/download" element={<Download />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/app" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/app/:serverId/:channelId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/app/dm/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}
