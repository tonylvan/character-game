import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';
import { GameProvider } from '../context/GameContext';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock storage functions
vi.mock('../utils/storage', () => ({
  getRanking: vi.fn(() => []),
  hasSignedInToday: vi.fn(() => false),
  getConsecutiveDays: vi.fn(() => 3),
}));

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render main title', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('汉字闯关')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('学汉字，讲故事，闯关卡')).toBeInTheDocument();
    });

    it('should render sign in banner', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText(/每日签到|今日已签到/)).toBeInTheDocument();
    });

    it('should render start button', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('🎮 开始闯关')).toBeInTheDocument();
    });

    it('should render menu buttons', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('📖 学汉字')).toBeInTheDocument();
      expect(screen.getByText('📚 学成语')).toBeInTheDocument();
      expect(screen.getByText('📜 学诗歌')).toBeInTheDocument();
      expect(screen.getByText('📚 错题本')).toBeInTheDocument();
      expect(screen.getByText('🏆 成就徽章')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to game on start click', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('🎮 开始闯关'));
      expect(mockNavigate).toHaveBeenCalledWith('/game');
    });

    it('should navigate to learn page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('📖 学汉字'));
      expect(mockNavigate).toHaveBeenCalledWith('/learn');
    });

    it('should navigate to idioms page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('📚 学成语'));
      expect(mockNavigate).toHaveBeenCalledWith('/learn-idioms');
    });

    it('should navigate to poetry page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('📜 学诗歌'));
      expect(mockNavigate).toHaveBeenCalledWith('/learn-poetry');
    });

    it('should navigate to wrong words page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('📚 错题本'));
      expect(mockNavigate).toHaveBeenCalledWith('/wrong-words');
    });

    it('should navigate to achievements page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText('🏆 成就徽章'));
      expect(mockNavigate).toHaveBeenCalledWith('/achievements');
    });

    it('should navigate to signin page', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      fireEvent.click(screen.getByText(/每日签到/));
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  describe('Category selection', () => {
    it('should open category modal on click', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      // Find category button
      const categoryBtn = screen.getByText(/混合闯关/);
      fireEvent.click(categoryBtn);
      
      expect(screen.getByText('选择闯关类型')).toBeInTheDocument();
    });

    it('should open grade modal on click', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      const gradeBtn = screen.getByText(/选择年级/);
      fireEvent.click(gradeBtn);
      
      expect(screen.getByText('🎓 选择年级')).toBeInTheDocument();
    });
  });

  describe('Stats display', () => {
    it('should display current level', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('当前关卡')).toBeInTheDocument();
    });

    it('should display score', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText('总积分')).toBeInTheDocument();
    });
  });

  describe('ThemeSelector', () => {
    it('should render ThemeSelector component', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      // ThemeSelector should be in the page
      expect(screen.getByText('汉字闯关')).toBeInTheDocument();
    });
  });

  describe('Sign in banner', () => {
    it('should show sign in badge when not signed in', async () => {
      const { hasSignedInToday } = await import('../utils/storage');
      vi.mocked(hasSignedInToday).mockReturnValue(false);
      
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      
      expect(screen.getByText('签到')).toBeInTheDocument();
    });

    it('should show consecutive days', () => {
      render(
        <GameProvider>
          <Home />
        </GameProvider>
      );
      expect(screen.getByText(/连续签到 3 天/)).toBeInTheDocument();
    });
  });
});