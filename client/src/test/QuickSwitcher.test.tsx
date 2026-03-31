import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickSwitcher from '../components/chat/QuickSwitcher';

const mockServers = [
  {
    _id: 'server1',
    name: 'Test Server',
    channels: [
      { _id: 'ch1', name: 'general', type: 'text' as const, server: 'server1', topic: '' },
      { _id: 'ch2', name: 'random', type: 'text' as const, server: 'server1', topic: '' },
    ],
  },
];

const mockDMs = [
  { _id: 'dm1', participants: [{ _id: 'u1', username: 'alice' }] },
];

describe('QuickSwitcher', () => {
  const mockOnSelect = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByPlaceholderText('Search channels, DMs...')).toBeInTheDocument();
  });

  it('shows channels by default', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('# general')).toBeInTheDocument();
    expect(screen.getByText('# random')).toBeInTheDocument();
  });

  it('filters channels by search query', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    const input = screen.getByPlaceholderText('Search channels, DMs...');
    fireEvent.change(input, { target: { value: 'gen' } });
    expect(screen.getByText('# general')).toBeInTheDocument();
    expect(screen.queryByText('# random')).not.toBeInTheDocument();
  });

  it('shows no results message when no matches', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    const input = screen.getByPlaceholderText('Search channels, DMs...');
    fireEvent.change(input, { target: { value: 'xyz123' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('calls onSelect when clicking a result', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    fireEvent.click(screen.getByText('# general'));
    expect(mockOnSelect).toHaveBeenCalledWith('channel', 'server1', 'ch1', undefined);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows DM conversations', () => {
    render(
      <QuickSwitcher
        servers={mockServers}
        dmConversations={mockDMs as any}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('alice')).toBeInTheDocument();
  });
});
