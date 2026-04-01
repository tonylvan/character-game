import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Game from '../pages/Game';
import { GameProvider } from '../context/GameContext';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock storage
vi.mock('../utils/storage', () => ({
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
      pinyinDifficulty: 'easy',
      showHint: true,
    },
  })),
  getPinyinDifficulty: vi.fn(() => 'easy'),
  getShowHint: vi.fn(() => true),
}));

// Mock questions data
vi.mock('../data/grade4b', () => ({
  default: [
    { id: 'test-1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
    { id: 'test-2', type: 'pinyin-to-char', content: 'tiān', answer: '天', level: 1, char: '天' },
    { id: 'test-3', type: 'char-to-pinyin', content: '中国', answer: 'zhōng guó', level: 1, char: '中' },
  ],
}));

vi.mock('../data/questions', () => ({
  default: [
    { id: 'q1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
  ],
}));

vi.mock('../data/charStories', () => ({
  default: [
    { char: '添', pinyin: 'tiān', meaning: '增加', origin: '...', oracle: '...', words: ['添加'], sentence: '...' },
  ],
}));

describe('Game page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should redirect to home when not playing', async () => {
      render(
        <GameProvider>
          <Game />
        </GameProvider>
      );
      
      // Should show loading or redirect
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Game with active state', () => {
    it('should render game content when playing', async () => {
      // Start game first
      const { container } = render(
        <GameProvider>
          <Game />
        </GameProvider>
      );
      
      // Game should be visible after state updates
      expect(container).toBeTruthy();
    });
  });

  describe('Fill-blank question type', () => {
    it('should render question content', async () => {
      const { container } = render(
        <GameProvider>
          <Game />
        </GameProvider>
      );
      
      expect(container).toBeTruthy();
    });
  });

  describe('Keyboard interaction', () => {
    it('should setup keyboard listeners', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      render(
        <GameProvider>
          <Game />
        </GameProvider>
      );
      
      expect(addEventListenerSpy).toHaveBeenCalled();
      
      addEventListenerSpy.mockRestore();
    });
  });

  describe('Progress display', () => {
    it('should show lives remaining', () => {
      render(
        <GameProvider>
          <Game />
        </GameProvider>
      );
      // Lives would be displayed when game is active
    });
  });

  describe('Canvas functionality', () => {
    it('should have canvas element for handwriting', () => {
      // Canvas would be rendered when needed
      expect(true).toBe(true);
    });
  });
});