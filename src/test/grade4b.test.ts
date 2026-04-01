import { describe, it, expect } from 'vitest';
import grade4b from '../data/grade4b';
import type { Question } from '../types';

describe('grade4b data', () => {
  describe('Question structure validation', () => {
    it('should have valid question structure', () => {
      grade4b.forEach((q: Question) => {
        expect(q.id).toBeDefined();
        expect(q.id.length).toBeGreaterThan(0);
        expect(q.id.startsWith('g4b-')).toBe(true);
        expect(q.type).toBeDefined();
        expect(['fill-blank', 'pinyin-to-char', 'char-to-pinyin']).toContain(q.type);
        expect(q.content).toBeDefined();
        expect(q.content.length).toBeGreaterThan(0);
        expect(q.answer).toBeDefined();
        expect(q.answer.length).toBeGreaterThan(0);
        expect(q.level).toBeDefined();
        expect(q.level).toBe(4);
        expect(q.grade).toBeDefined();
        expect(q.grade).toBe('4-下册');
        expect(q.unit).toBeDefined();
        expect([1, 2, 3, 4, 5, 6, 7, 8]).toContain(q.unit);
        expect(q.char).toBeDefined();
        expect(q.char.length).toBeGreaterThan(0);
      });
    });

    it('should have unique question IDs', () => {
      const ids = grade4b.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have fill-blank questions with options', () => {
      const fillBlankQuestions = grade4b.filter(q => q.type === 'fill-blank');
      fillBlankQuestions.forEach((q: Question) => {
        expect(q.options).toBeDefined();
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options!.length).toBeGreaterThan(1);
        expect(q.options!).toContain(q.answer);
      });
    });
  });

  describe('Unit coverage', () => {
    it('should have questions for all 8 units', () => {
      const units = [1, 2, 3, 4, 5, 6, 7, 8];
      units.forEach(unit => {
        const unitQuestions = grade4b.filter(q => q.unit === unit);
        expect(unitQuestions.length).toBeGreaterThan(0);
      });
    });

    it('should have balanced question distribution across units', () => {
      const unitCounts = [1, 2, 3, 4, 5, 6, 7, 8].map(unit => 
        grade4b.filter(q => q.unit === unit).length
      );
      // Each unit should have at least 15 questions
      unitCounts.forEach(count => {
        expect(count).toBeGreaterThan(15);
      });
    });
  });

  describe('Question type distribution', () => {
    it('should have char-to-pinyin questions', () => {
      const charToPinyin = grade4b.filter(q => q.type === 'char-to-pinyin');
      expect(charToPinyin.length).toBeGreaterThan(0);
    });

    it('should have pinyin-to-char questions', () => {
      const pinyinToChar = grade4b.filter(q => q.type === 'pinyin-to-char');
      expect(pinyinToChar.length).toBeGreaterThan(0);
    });

    it('should have fill-blank questions', () => {
      const fillBlank = grade4b.filter(q => q.type === 'fill-blank');
      expect(fillBlank.length).toBeGreaterThan(0);
    });
  });

  describe('Content validation', () => {
    it('should have valid pinyin format for char-to-pinyin questions', () => {
      const charToPinyin = grade4b.filter(q => q.type === 'char-to-pinyin');
      charToPinyin.forEach((q: Question) => {
        // Pinyin should contain spaces between syllables and have tone markers or be valid pinyin
        const pinyinPattern = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+$/i;
        expect(pinyinPattern.test(q.answer.toLowerCase().replace(/[0-9]/g, ''))).toBe(true);
      });
    });

    it('should have valid Chinese characters for pinyin-to-char questions', () => {
      const pinyinToChar = grade4b.filter(q => q.type === 'pinyin-to-char');
      pinyinToChar.forEach((q: Question) => {
        // Answer should contain Chinese characters
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(q.answer)).toBe(true);
      });
    });

    it('should have Chinese characters in char field', () => {
      grade4b.forEach((q: Question) => {
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(q.char)).toBe(true);
      });
    });

    it('should have valid options for fill-blank questions', () => {
      const fillBlank = grade4b.filter(q => q.type === 'fill-blank');
      fillBlank.forEach((q: Question) => {
        // All options should be non-empty strings
        q.options!.forEach(opt => {
          expect(opt.length).toBeGreaterThan(0);
        });
        // Answer should be one of the options
        expect(q.options!).toContain(q.answer);
      });
    });
  });

  describe('Question ID format', () => {
    it('should have proper ID format with unit and type indicators', () => {
      grade4b.forEach((q: Question) => {
        const parts = q.id.split('-');
        expect(parts.length).toBeGreaterThanOrEqual(4);
        expect(parts[0]).toBe('g4b');
        expect(parts[1]).toBe(`u${q.unit}`);
        // Type indicator: py (pinyin), zc (字词), cy (成语), gs (古诗), wx (文学常识)
        const typeIndicators = ['py', 'zc', 'cy', 'gs', 'wx'];
        expect(typeIndicators.some(ti => parts[2] === ti)).toBe(true);
      });
    });

    it('should match question type with ID indicator', () => {
      grade4b.forEach((q: Question) => {
        const parts = q.id.split('-');
        const typeIndicator = parts[2];
        
        if (typeIndicator === 'py') {
          expect(q.type).toBe('char-to-pinyin');
        } else if (typeIndicator === 'zc') {
          expect(q.type).toBe('pinyin-to-char');
        } else if (['cy', 'gs', 'wx'].includes(typeIndicator)) {
          expect(q.type).toBe('fill-blank');
        }
      });
    });
  });

  describe('Data completeness', () => {
    it('should have sufficient total questions', () => {
      expect(grade4b.length).toBeGreaterThan(150);
    });

    it('should have all required fields for every question', () => {
      const requiredFields = ['id', 'type', 'content', 'answer', 'level', 'grade', 'unit', 'char'];
      grade4b.forEach((q: Question) => {
        requiredFields.forEach(field => {
          expect(q[field as keyof Question]).toBeDefined();
        });
      });
    });
  });
});