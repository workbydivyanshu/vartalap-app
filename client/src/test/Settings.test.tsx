import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../components/chat/Settings';

const mockUser = {
  _id: 'user1',
  username: 'testuser',
  email: 'test@test.com',
  avatar: '',
  status: 'online' as const,
};

describe('Settings', () => {
  const mockOnClose = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settings modal with sidebar sections', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    const sidebarItems = screen.getAllByRole('button');
    const sectionNames = sidebarItems.map(b => b.textContent).filter(t => t);
    expect(sectionNames).toContain('My Account');
    expect(sectionNames).toContain('Accessibility');
    expect(sectionNames).toContain('Voice & Video');
    expect(sectionNames).toContain('Notifications');
  });

  it('renders My Account section by default', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('switches section when clicking sidebar item', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Accessibility'));
    expect(screen.getByText('Reduce Motion')).toBeInTheDocument();
  });

  it('renders toggle switches in Accessibility section', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Accessibility'));
    const toggles = screen.getAllByRole('checkbox');
    expect(toggles.length).toBeGreaterThanOrEqual(3);
  });

  it('renders Log Out button', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('calls onLogout when clicking Log Out', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Log Out'));
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('renders Save Changes and Cancel buttons', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onClose when clicking Cancel', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders language selector in Language section', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Language'));
    expect(screen.getByText('English (US)')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('renders Voice & Video section', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Voice & Video'));
    expect(screen.getByText('Input Device')).toBeInTheDocument();
    expect(screen.getByText('Output Device')).toBeInTheDocument();
  });

  it('renders Notifications section', () => {
    render(<Settings user={mockUser} onClose={mockOnClose} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Enable Desktop Notifications')).toBeInTheDocument();
    expect(screen.getByText('Enable Notification Sounds')).toBeInTheDocument();
  });
});
