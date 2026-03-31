import { describe, it, expect } from 'vitest';
import ACHIEVEMENTS, { ACHIEVEMENT_CATEGORIES } from '../data/achievements';
import type { Achievement } from '../types';

describe('achievements data', () => {
  describe('ACHIEVEMENTS', () => {
    it('should have valid achievement structure', () => {
      ACHIEVEMENTS.forEach((achievement: Achievement) => {
        expect(achievement.id).toBeDefined();
        expect(achievement.id.length).toBeGreaterThan(0);
        expect(achievement.name).toBeDefined();
        expect(achievement.desc).toBeDefined();
        expect(achievement.icon).toBeDefined();
        expect(achievement.category).toBeDefined();
        expect(['game', 'score', 'checkin', 'level']).toContain(achievement.category);
        expect(achievement.condition).toBeDefined();
        expect(achievement.condition.type).toBeDefined();
        expect(achievement.condition.value).toBeDefined();
        expect(typeof achievement.condition.value).toBe('number');
      });
    });

    it('should have unique achievement IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid condition types', () => {
      const validTypes = ['questions_correct', 'streak', 'total_score', 'checkin_streak', 'level'];
      ACHIEVEMENTS.forEach((achievement: Achievement) => {
        expect(validTypes).toContain(achievement.condition.type);
      });
    });

    it('should have positive condition values', () => {
      ACHIEVEMENTS.forEach((achievement: Achievement) => {
        expect(achievement.condition.value).toBeGreaterThan(0);
      });
    });

    it('should have game achievements', () => {
      const gameAchievements = ACHIEVEMENTS.filter(a => a.category === 'game');
      expect(gameAchievements.length).toBeGreaterThan(0);
      expect(gameAchievements.some(a => a.id === 'first_correct')).toBe(true);
      expect(gameAchievements.some(a => a.id === 'streak_5')).toBe(true);
      expect(gameAchievements.some(a => a.id === 'streak_10')).toBe(true);
    });

    it('should have score achievements', () => {
      const scoreAchievements = ACHIEVEMENTS.filter(a => a.category === 'score');
      expect(scoreAchievements.length).toBeGreaterThan(0);
      expect(scoreAchievements.some(a => a.id === 'score_100')).toBe(true);
      expect(scoreAchievements.some(a => a.id === 'score_500')).toBe(true);
    });

    it('should have checkin achievements', () => {
      const checkinAchievements = ACHIEVEMENTS.filter(a => a.category === 'checkin');
      expect(checkinAchievements.length).toBeGreaterThan(0);
      expect(checkinAchievements.some(a => a.id === 'checkin_3')).toBe(true);
      expect(checkinAchievements.some(a => a.id === 'checkin_7')).toBe(true);
    });

    it('should have level achievements', () => {
      const levelAchievements = ACHIEVEMENTS.filter(a => a.category === 'level');
      expect(levelAchievements.length).toBeGreaterThan(0);
      expect(levelAchievements.some(a => a.id === 'level_5')).toBe(true);
    });

    it('should have increasing difficulty for streak achievements', () => {
      const streakAchievements = ACHIEVEMENTS
        .filter(a => a.condition.type === 'streak')
        .sort((a, b) => a.condition.value - b.condition.value);
      
      for (let i = 1; i < streakAchievements.length; i++) {
        expect(streakAchievements[i].condition.value).toBeGreaterThan(
          streakAchievements[i - 1].condition.value
        );
      }
    });

    it('should have increasing difficulty for score achievements', () => {
      const scoreAchievements = ACHIEVEMENTS
        .filter(a => a.condition.type === 'total_score')
        .sort((a, b) => a.condition.value - b.condition.value);
      
      for (let i = 1; i < scoreAchievements.length; i++) {
        expect(scoreAchievements[i].condition.value).toBeGreaterThan(
          scoreAchievements[i - 1].condition.value
        );
      }
    });
  });

  describe('ACHIEVEMENT_CATEGORIES', () => {
    it('should have valid category structure', () => {
      ACHIEVEMENT_CATEGORIES.forEach(cat => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
        expect(cat.icon).toBeDefined();
      });
    });

    it('should have unique category IDs', () => {
      const ids = ACHIEVEMENT_CATEGORIES.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have "all" category', () => {
      expect(ACHIEVEMENT_CATEGORIES.some(c => c.id === 'all')).toBe(true);
    });

    it('should have all achievement categories', () => {
      const categoryIds = ACHIEVEMENT_CATEGORIES.map(c => c.id);
      expect(categoryIds).toContain('all');
      expect(categoryIds).toContain('game');
      expect(categoryIds).toContain('score');
      expect(categoryIds).toContain('checkin');
      expect(categoryIds).toContain('level');
    });

    it('should have matching category icons', () => {
      ACHIEVEMENT_CATEGORIES.forEach(cat => {
        expect(cat.icon.length).toBeGreaterThan(0);
        // Icons should be emoji or icon-like strings
        expect(typeof cat.icon).toBe('string');
      });
    });
  });

  describe('achievement matching', () => {
    it('should have achievements for each category', () => {
      ACHIEVEMENT_CATEGORIES.forEach(cat => {
        if (cat.id === 'all') return;
        const matchingAchievements = ACHIEVEMENTS.filter(a => a.category === cat.id);
        expect(matchingAchievements.length).toBeGreaterThan(0);
      });
    });
  });
});