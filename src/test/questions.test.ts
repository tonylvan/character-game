import { describe, it, expect } from 'vitest';
import questions from '../data/questions';
import type { Question } from '../types';

describe('questions data', () => {
  describe('Question structure validation', () => {
    it('should have valid question structure', () => {
      questions.forEach((q: Question) => {
        expect(q.id).toBeDefined();
        expect(q.id.length).toBeGreaterThan(0);
        expect(q.type).toBeDefined();
        expect(['fill-blank', 'pinyin-to-char', 'char-to-pinyin']).toContain(q.type);
        expect(q.content).toBeDefined();
        expect(q.content.length).toBeGreaterThan(0);
        expect(q.answer).toBeDefined();
        expect(q.answer.length).toBeGreaterThan(0);
        expect(q.level).toBeDefined();
        expect(typeof q.level).toBe('number');
        expect(q.level).toBeGreaterThan(0);
        expect(q.char).toBeDefined();
        expect(q.char.length).toBeGreaterThan(0);
      });
    });

    it('should have unique question IDs', () => {
      const ids = questions.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have fill-blank questions with options', () => {
      const fillBlankQuestions = questions.filter(q => q.type === 'fill-blank');
      fillBlankQuestions.forEach((q: Question) => {
        expect(q.options).toBeDefined();
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options!.length).toBeGreaterThan(1);
        expect(q.options!).toContain(q.answer);
      });
    });
  });

  describe('Question type distribution', () => {
    it('should have char-to-pinyin questions', () => {
      const charToPinyin = questions.filter(q => q.type === 'char-to-pinyin');
      expect(charToPinyin.length).toBeGreaterThan(0);
    });

    it('should have pinyin-to-char questions', () => {
      const pinyinToChar = questions.filter(q => q.type === 'pinyin-to-char');
      expect(pinyinToChar.length).toBeGreaterThan(0);
    });

    it('should have fill-blank questions', () => {
      const fillBlank = questions.filter(q => q.type === 'fill-blank');
      expect(fillBlank.length).toBeGreaterThan(0);
    });
  });

  describe('Content validation', () => {
    it('should have valid pinyin format for char-to-pinyin questions', () => {
      const charToPinyin = questions.filter(q => q.type === 'char-to-pinyin');
      charToPinyin.forEach((q: Question) => {
        const pinyinPattern = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+$/i;
        expect(pinyinPattern.test(q.answer.toLowerCase())).toBe(true);
      });
    });

    it('should have valid Chinese characters for pinyin-to-char questions', () => {
      const pinyinToChar = questions.filter(q => q.type === 'pinyin-to-char');
      pinyinToChar.forEach((q: Question) => {
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(q.answer)).toBe(true);
      });
    });

    it('should have Chinese characters in char field', () => {
      questions.forEach((q: Question) => {
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(q.char)).toBe(true);
      });
    });

    it('should have valid options for fill-blank questions', () => {
      const fillBlank = questions.filter(q => q.type === 'fill-blank');
      fillBlank.forEach((q: Question) => {
        q.options!.forEach(opt => {
          expect(opt.length).toBeGreaterThan(0);
        });
        expect(q.options!).toContain(q.answer);
      });
    });
  });

  describe('Level distribution', () => {
    it('should have questions at different levels', () => {
      const levels = new Set(questions.map(q => q.level));
      expect(levels.size).toBeGreaterThan(1);
    });

    it('should have level 1-3 questions', () => {
      const lowLevelQuestions = questions.filter(q => q.level <= 3);
      expect(lowLevelQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('Idiom-based fill-blank questions', () => {
    it('should have idiom completion questions', () => {
      const idiomQuestions = questions.filter(q => 
        q.type === 'fill-blank' && q.id.startsWith('q') && parseInt(q.id.slice(1)) <= 10
      );
      expect(idiomQuestions.length).toBeGreaterThan(0);
    });

    it('should include common idiom questions', () => {
      const contents = questions.map(q => q.content);
      expect(contents.some(c => c.includes('画蛇'))).toBe(true);
      expect(contents.some(c => c.includes('守株待'))).toBe(true);
      expect(contents.some(c => c.includes('亡羊补'))).toBe(true);
    });
  });

  describe('Question ID format', () => {
    it('should have proper ID format', () => {
      questions.forEach((q: Question) => {
        expect(q.id.startsWith('q')).toBe(true);
        const numPart = q.id.slice(1);
        expect(/^\d+$/.test(numPart)).toBe(true);
      });
    });
  });

  describe('Data completeness', () => {
    it('should have sufficient total questions', () => {
      expect(questions.length).toBeGreaterThan(20);
    });

    it('should have all required fields for every question', () => {
      const requiredFields = ['id', 'type', 'content', 'answer', 'level', 'char'];
      questions.forEach((q: Question) => {
        requiredFields.forEach(field => {
          expect(q[field as keyof Question]).toBeDefined();
        });
      });
    });
  });
});