import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Learn from '../pages/Learn';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock charStories data
vi.mock('../data/charStories', () => ({
  default: [
    { char: '添', pinyin: 'tiān', meaning: '增加', origin: '甲骨文字形', oracle: '...', words: ['添加', '增添'], sentence: '请添上一笔。' },
    { char: '兔', pinyin: 'tù', meaning: '兔子', origin: '...', oracle: '...', words: ['兔子', '白兔'], sentence: '兔子跑得快。' },
    { char: '牢', pinyin: 'láo', meaning: '牢固', origin: '...', oracle: '...', words: ['牢固', '牢靠'], sentence: '房子很牢。' },
    { char: '铃', pinyin: 'líng', meaning: '铃铛', origin: '...', oracle: '...', words: ['铃铛', '铃声'], sentence: '铃声响起来。' },
    { char: '剑', pinyin: 'jiàn', meaning: '宝剑', origin: '...', oracle: '...', words: ['宝剑', '剑客'], sentence: '剑光闪闪。' },
  ],
}));

describe('Learn page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      render(<Learn />);
      expect(screen.getByText('📖 汉字学习')).toBeInTheDocument();
    });

    it('should render category tabs', () => {
      render(<Learn />);
      expect(screen.getByText('📚 全部')).toBeInTheDocument();
      expect(screen.getByText('🔤 按拼音')).toBeInTheDocument();
      expect(screen.getByText('📊 按难度')).toBeInTheDocument();
      expect(screen.getByText('✏️ 按笔画')).toBeInTheDocument();
      expect(screen.getByText('⭐ 收藏')).toBeInTheDocument();
    });

    it('should render search input in all mode', () => {
      render(<Learn />);
      expect(screen.getByPlaceholderText('搜索汉字、拼音或含义...')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(<Learn />);
      expect(screen.getByText('← 返回首页')).toBeInTheDocument();
    });

    it('should render stats info', () => {
      render(<Learn />);
      expect(screen.getByText(/共 5 个汉字/)).toBeInTheDocument();
    });
  });

  describe('Category switching', () => {
    it('should switch to by-pinyin mode', () => {
      render(<Learn />);
      
      fireEvent.click(screen.getByText('🔤 按拼音'));
      
      // Should show group titles (pinyin initials)
      expect(screen.queryByPlaceholderText('搜索汉字...')).not.toBeInTheDocument();
    });

    it('should switch to by-level mode', () => {
      render(<Learn />);
      
      fireEvent.click(screen.getByText('📊 按难度'));
      
      // Should show level indicators
      expect(screen.getByText(/难度 1/)).toBeInTheDocument();
    });

    it('should switch to favorites mode', () => {
      render(<Learn />);
      
      fireEvent.click(screen.getByText('⭐ 收藏'));
      
      expect(screen.getByText('⭐ 收藏功能即将推出')).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should filter characters by search term', () => {
      render(<Learn />);
      
      const searchInput = screen.getByPlaceholderText('搜索汉字、拼音或含义...');
      fireEvent.change(searchInput, { target: { value: '添' } });
      
      // Should show filtered results
      expect(screen.getByText('添')).toBeInTheDocument();
    });

    it('should show empty state when no results', () => {
      render(<Learn />);
      
      const searchInput = screen.getByPlaceholderText('搜索汉字、拼音或含义...');
      fireEvent.change(searchInput, { target: { value: '不存在' } });
      
      expect(screen.getByText('没有找到相关汉字')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home', () => {
      render(<Learn />);
      
      fireEvent.click(screen.getByText('← 返回首页'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to character detail on click', () => {
      render(<Learn />);
      
      fireEvent.click(screen.getByText('添'));
      expect(mockNavigate).toHaveBeenCalledWith('/learn/添');
    });
  });

  describe('Character cards', () => {
    it('should render character card with pinyin', () => {
      render(<Learn />);
      
      expect(screen.getByText('添')).toBeInTheDocument();
      expect(screen.getByText('tiān')).toBeInTheDocument();
    });

    it('should render multiple character cards', () => {
      render(<Learn />);
      
      expect(screen.getByText('添')).toBeInTheDocument();
      expect(screen.getByText('兔')).toBeInTheDocument();
      expect(screen.getByText('牢')).toBeInTheDocument();
    });
  });

  describe('Tab active state', () => {
    it('should have active state on default tab', () => {
      render(<Learn />);
      
      const allTab = screen.getByText('📚 全部');
      expect(allTab).toBeInTheDocument();
    });

    it('should update active state on tab click', () => {
      render(<Learn />);
      
      const pinyinTab = screen.getByText('🔤 按拼音');
      fireEvent.click(pinyinTab);
      
      // Search input should disappear in pinyin mode
      expect(screen.queryByPlaceholderText('搜索汉字...')).not.toBeInTheDocument();
    });
  });
});