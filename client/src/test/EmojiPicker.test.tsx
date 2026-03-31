import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmojiPicker from '../components/chat/EmojiPicker';

describe('EmojiPicker', () => {
  const mockOnSelect = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText('Search emojis...')).toBeInTheDocument();
  });

  it('renders category buttons', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    expect(screen.getByTitle('Smileys')).toBeInTheDocument();
    expect(screen.getByTitle('People')).toBeInTheDocument();
    expect(screen.getByTitle('Animals')).toBeInTheDocument();
  });

  it('shows emojis for default category (Smileys)', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    const items = screen.getAllByRole('button').filter(b => b.className === 'emoji-item');
    expect(items.length).toBeGreaterThan(50);
  });

  it('switches category when clicking category button', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTitle('Animals'));
    const items = screen.getAllByRole('button').filter(b => b.className === 'emoji-item');
    expect(items.length).toBeGreaterThan(50);
  });

  it('filters emojis by search query', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText('Search emojis...');
    fireEvent.change(input, { target: { value: '😂' } });
    const items = screen.getAllByRole('button').filter(b => b.textContent === '😂');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onSelect when clicking an emoji', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    const emojiButtons = screen.getAllByRole('button').filter(b => b.className === 'emoji-item');
    fireEvent.click(emojiButtons[0]);
    expect(mockOnSelect).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders all 8 categories', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    const categoryButtons = screen.getAllByRole('button').filter(b => b.title);
    expect(categoryButtons.length).toBe(8);
  });

  it('shows different emojis for each category', () => {
    render(<EmojiPicker onSelect={mockOnSelect} onClose={mockOnClose} />);
    const initialCount = screen.getAllByRole('button').filter(b => b.className === 'emoji-item').length;
    fireEvent.click(screen.getByTitle('Food'));
    const foodCount = screen.getAllByRole('button').filter(b => b.className === 'emoji-item').length;
    expect(foodCount).toBeGreaterThan(50);
    expect(foodCount).not.toBe(initialCount);
  });
});
