import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import { GameProvider } from '../context/GameContext';
import { ThemeProvider } from '../context/ThemeContext';

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
  getUserData: vi.fn(() => ({
    score: 0,
    level: 1,
    lives: 3,
    streak: 0,
    wrongQuestions: [],
    customQuestions: [],
    deletedQuestionIds: [],
    ranking: [],
    userName: '测试用户',
    charErrors: [],
    favorites: [],
    achievements: [],
    exp: 0,
    parentSettings: {
      dailyLimit: 30,
      gameTime: 15,
      isTimeLimitEnabled: false,
      wrongCharFrequency: 50,
      boostWrongChars: true,
    },
  })),
  getThemeId: vi.fn(() => 'default'),
  setThemeId: vi.fn(),
}));

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render main title', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('汉字闯关')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('学汉字，讲故事，闯关卡')).toBeInTheDocument();
    });

    it('should render sign in banner', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText(/每日签到|今日已签到/)).toBeInTheDocument();
    });

    it('should render start button', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('🎮 开始闯关')).toBeInTheDocument();
    });

    it('should render menu buttons', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('📖 学汉字')).toBeInTheDocument();
      expect(screen.getByText('📚 学成语')).toBeInTheDocument();
      expect(screen.getByText('📜 学诗歌')).toBeInTheDocument();
      expect(screen.getByText('📚 错题本')).toBeInTheDocument();
      expect(screen.getByText('🏆 成就徽章')).toBeInTheDocument();
    });
  });

  describe('Stats display', () => {
    it('should display current level', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('当前关卡')).toBeInTheDocument();
    });

    it('should display score', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText('总积分')).toBeInTheDocument();
    });
  });

  describe('Sign in banner', () => {
    it('should show sign in badge when not signed in', async () => {
      const { hasSignedInToday } = await import('../utils/storage');
      vi.mocked(hasSignedInToday).mockReturnValue(false);
      
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      
      expect(screen.getByText('签到')).toBeInTheDocument();
    });

    it('should show consecutive days', () => {
      render(
        <ThemeProvider>
          <GameProvider>
            <Home />
          </GameProvider>
        </ThemeProvider>
      );
      expect(screen.getByText(/连续签到 3 天/)).toBeInTheDocument();
    });
  });
});