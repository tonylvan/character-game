import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame, QUESTION_CATEGORIES, GRADE_LEVELS, UNIT_NUMBERS } from '../context/GameContext';
import { ReactNode } from 'react';

// Wrapper for testing hooks
const wrapper = ({ children }: { children: ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('GameContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('QUESTION_CATEGORIES', () => {
    it('should have valid category structure', () => {
      QUESTION_CATEGORIES.forEach(cat => {
        expect(cat.value).toBeDefined();
        expect(cat.label).toBeDefined();
        expect(cat.desc).toBeDefined();
      });
    });

    it('should have "all" category', () => {
      expect(QUESTION_CATEGORIES.some(c => c.value === 'all')).toBe(true);
    });

    it('should have idiom category', () => {
      expect(QUESTION_CATEGORIES.some(c => c.value === 'idiom')).toBe(true);
    });

    it('should have poetry category', () => {
      expect(QUESTION_CATEGORIES.some(c => c.value === 'poetry')).toBe(true);
    });

    it('should have pinyin categories', () => {
      expect(QUESTION_CATEGORIES.some(c => c.value === 'pinyin-to-char')).toBe(true);
      expect(QUESTION_CATEGORIES.some(c => c.value === 'char-to-pinyin')).toBe(true);
    });
  });

  describe('GRADE_LEVELS', () => {
    it('should have valid grade structure', () => {
      GRADE_LEVELS.forEach(grade => {
        expect(grade.value).toBeDefined();
        expect(grade.label).toBeDefined();
        expect(grade.desc).toBeDefined();
      });
    });

    it('should have grades 1-6', () => {
      for (let i = 1; i <= 6; i++) {
        expect(GRADE_LEVELS.some(g => g.value === `${i}-上册`)).toBe(true);
        expect(GRADE_LEVELS.some(g => g.value === `${i}-下册`)).toBe(true);
      }
    });
  });

  describe('UNIT_NUMBERS', () => {
    it('should have valid unit structure', () => {
      UNIT_NUMBERS.forEach(unit => {
        expect(unit.value).toBeDefined();
        expect(unit.label).toBeDefined();
      });
    });

    it('should have units 1-8', () => {
      for (let i = 1; i <= 8; i++) {
        expect(UNIT_NUMBERS.some(u => u.value === i)).toBe(true);
      }
    });
  });

  describe('useGame hook', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useGame());
      }).toThrow('useGame must be used within a GameProvider');
    });

    it('should provide initial state', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.level).toBe(1);
      expect(result.current.state.lives).toBe(3);
      expect(result.current.state.streak).toBe(0);
      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.isGameOver).toBe(false);
      expect(result.current.state.isLevelComplete).toBe(false);
    });

    it('should provide setCategory function', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.setCategory('idiom');
      });
      
      expect(result.current.state.selectedCategory).toBe('idiom');
    });

    it('should provide setGrade function', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.setGrade('4-上册');
      });
      
      expect(result.current.state.selectedGrade).toBe('4-上册');
    });

    it('should provide setUnit function', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.setUnit(3);
      });
      
      expect(result.current.state.selectedUnit).toBe(3);
    });

    it('should start game correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      expect(result.current.state.isPlaying).toBe(true);
      expect(result.current.state.currentQuestion).not.toBeNull();
      expect(result.current.state.questionIndex).toBe(0);
    });

    it('should handle correct answer', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      const initialScore = result.current.state.score;
      
      act(() => {
        result.current.answerCorrect();
      });
      
      expect(result.current.state.score).toBeGreaterThan(initialScore);
      expect(result.current.state.streak).toBe(1);
      expect(result.current.state.totalQuestionsCorrect).toBe(1);
    });

    it('should handle wrong answer', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.answerCorrect();
      });
      
      expect(result.current.state.streak).toBe(1);
      
      act(() => {
        result.current.answerWrong();
      });
      
      expect(result.current.state.lives).toBe(2);
      expect(result.current.state.streak).toBe(0);
    });

    it('should end game when lives reach 0', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      // Answer wrong 3 times
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.answerWrong();
        });
      }
      
      expect(result.current.state.lives).toBe(0);
      expect(result.current.state.isGameOver).toBe(true);
      expect(result.current.state.isPlaying).toBe(false);
    });

    it('should increment streak correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      // Answer correct multiple times
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.answerCorrect();
        });
      }
      
      expect(result.current.state.streak).toBe(5);
      expect(result.current.state.maxStreak).toBe(5);
    });

    it('should reset streak on wrong answer', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
      });
      
      // Build up streak
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.answerCorrect();
        });
      }
      
      expect(result.current.state.streak).toBe(5);
      
      // Wrong answer resets streak
      act(() => {
        result.current.answerWrong();
      });
      
      expect(result.current.state.streak).toBe(0);
      expect(result.current.state.maxStreak).toBe(5); // max streak preserved
    });

    it('should provide getStory function', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      // Use a character that exists in charStories
      const story = result.current.getStory('兔');
      expect(story).toBeDefined();
      expect(story?.char).toBe('兔');
    });

    it('should return undefined for unknown character', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      const story = result.current.getStory('未知字');
      expect(story).toBeUndefined();
    });

    it('should provide resetGame function', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.startGame();
        result.current.answerCorrect();
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.streak).toBe(0);
      expect(result.current.state.isPlaying).toBe(false);
    });

    it('should provide newlyUnlockedAchievements state', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      expect(result.current.newlyUnlockedAchievements).toEqual([]);
      expect(result.current.clearNewlyUnlocked).toBeDefined();
    });

    it('should clear newly unlocked achievements', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      // Start game and answer correct to potentially unlock achievements
      act(() => {
        result.current.startGame();
        result.current.answerCorrect();
      });
      
      act(() => {
        result.current.clearNewlyUnlocked();
      });
      
      expect(result.current.newlyUnlockedAchievements).toEqual([]);
    });
  });
});