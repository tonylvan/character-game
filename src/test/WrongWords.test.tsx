import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WrongWords from '../pages/WrongWords';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock storage functions
vi.mock('../utils/storage', () => ({
  getWrongQuestions: vi.fn(() => []),
  removeWrongQuestion: vi.fn(),
}));

describe('WrongWords page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      render(<WrongWords />);
      expect(screen.getByText('📚 错题本')).toBeInTheDocument();
    });

    it('should render empty state when no wrong questions', () => {
      render(<WrongWords />);
      expect(screen.getByText('🎉 太棒了！没有错题')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(<WrongWords />);
      expect(screen.getByText('← 返回')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home on back click', () => {
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('← 返回'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('With wrong questions', () => {
    it('should display wrong questions list', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足'], level: 1, char: '添' },
        { id: 'w2', type: 'pinyin-to-char', content: 'tiān', answer: '天', level: 1, char: '天' },
      ]);
      
      render(<WrongWords />);
      
      expect(screen.getByText('共 2 道错题')).toBeInTheDocument();
      expect(screen.getByText('📝 开始练习')).toBeInTheDocument();
    });

    it('should show clear all button', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      expect(screen.getByText('🗑️ 清空所有')).toBeInTheDocument();
    });

    it('should remove wrong question', async () => {
      const { getWrongQuestions, removeWrongQuestion } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      // Find remove button (✕)
      const removeBtn = screen.getByText('✕');
      fireEvent.click(removeBtn);
      
      expect(removeWrongQuestion).toHaveBeenCalledWith('w1');
    });
  });

  describe('Practice mode', () => {
    it('should enter practice mode on button click', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('📝 开始练习'));
      
      expect(screen.getByText('📚 错题练习')).toBeInTheDocument();
    });

    it('should show question in practice mode', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('📝 开始练习'));
      
      expect(screen.getByText('画蛇_____')).toBeInTheDocument();
    });

    it('should show options for fill-blank question', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('📝 开始练习'));
      
      expect(screen.getByText('添足')).toBeInTheDocument();
      expect(screen.getByText('填足')).toBeInTheDocument();
    });

    it('should return to list from practice mode', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
      ]);
      
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('📝 开始练习'));
      fireEvent.click(screen.getByText('返回'));
      
      expect(screen.getByText('📚 错题本')).toBeInTheDocument();
    });
  });

  describe('Clear all functionality', () => {
    it('should confirm before clearing all', async () => {
      const { getWrongQuestions } = await import('../utils/storage');
      vi.mocked(getWrongQuestions).mockReturnValue([
        { id: 'w1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足'], level: 1, char: '添' },
      ]);
      
      // Mock confirm
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      render(<WrongWords />);
      
      fireEvent.click(screen.getByText('🗑️ 清空所有'));
      
      expect(window.confirm).toHaveBeenCalledWith('确定要清空所有错题吗？');
    });
  });
});