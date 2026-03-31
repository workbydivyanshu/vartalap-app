import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandSuggestions from '../components/chat/CommandSuggestions';

describe('CommandSuggestions', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows suggestions when input starts with /', () => {
    render(<CommandSuggestions input="/" onSelect={mockOnSelect} />);
    expect(screen.getByText('/shrug')).toBeInTheDocument();
    expect(screen.getByText('/me')).toBeInTheDocument();
    expect(screen.getByText('/tableflip')).toBeInTheDocument();
    expect(screen.getByText('/unflip')).toBeInTheDocument();
    expect(screen.getByText('/lenny')).toBeInTheDocument();
    expect(screen.getByText('/help')).toBeInTheDocument();
  });

  it('filters commands by prefix', () => {
    render(<CommandSuggestions input="/sh" onSelect={mockOnSelect} />);
    expect(screen.getByText('/shrug')).toBeInTheDocument();
    expect(screen.queryByText('/me')).not.toBeInTheDocument();
  });

  it('does not show suggestions for non-command input', () => {
    const { container } = render(<CommandSuggestions input="hello" onSelect={mockOnSelect} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onSelect with processed content when clicking a command', () => {
    render(<CommandSuggestions input="/shrug hello" onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('/shrug'));
    expect(mockOnSelect).toHaveBeenCalledWith('hello ¯\\_(ツ)_/¯');
  });

  it('processes /tableflip correctly', () => {
    render(<CommandSuggestions input="/tableflip" onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('/tableflip'));
    expect(mockOnSelect).toHaveBeenCalledWith('(╯°□°）╯︵ ┻━┻');
  });

  it('processes /unflip correctly', () => {
    render(<CommandSuggestions input="/unflip" onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('/unflip'));
    expect(mockOnSelect).toHaveBeenCalledWith('┬─┬ノ( º _ ºノ)');
  });

  it('processes /me with args correctly', () => {
    render(<CommandSuggestions input="/me waves" onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('/me'));
    expect(mockOnSelect).toHaveBeenCalledWith('*waves*');
  });

  it('processes /lenny correctly', () => {
    render(<CommandSuggestions input="/lenny nice" onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('/lenny'));
    expect(mockOnSelect).toHaveBeenCalledWith('nice ( ͡° ͜ʖ ͡°)');
  });

  it('shows command descriptions', () => {
    render(<CommandSuggestions input="/" onSelect={mockOnSelect} />);
    expect(screen.getByText('Append a shrug')).toBeInTheDocument();
    expect(screen.getByText('Italic action message')).toBeInTheDocument();
    expect(screen.getByText('Flip a table')).toBeInTheDocument();
  });
});
