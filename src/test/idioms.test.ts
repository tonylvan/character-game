import { describe, it, expect } from 'vitest';
import { IDIOMS, type Idiom } from '../data/idioms';

describe('idioms data', () => {
  describe('Idiom structure validation', () => {
    it('should have valid idiom structure', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        expect(idiom.id).toBeDefined();
        expect(idiom.id.length).toBeGreaterThan(0);
        expect(idiom.idiom).toBeDefined();
        expect(idiom.idiom.length).toBeGreaterThan(0);
        expect(idiom.pinyin).toBeDefined();
        expect(idiom.pinyin.length).toBeGreaterThan(0);
        expect(idiom.meaning).toBeDefined();
        expect(idiom.meaning.length).toBeGreaterThan(0);
        expect(idiom.story).toBeDefined();
        expect(idiom.story.length).toBeGreaterThan(0);
        expect(idiom.source).toBeDefined();
        expect(idiom.source.length).toBeGreaterThan(0);
        expect(idiom.example).toBeDefined();
        expect(idiom.example.length).toBeGreaterThan(0);
        expect(idiom.grade).toBeDefined();
        expect([4, 5, 6]).toContain(idiom.grade);
      });
    });

    it('should have unique idiom IDs', () => {
      const ids = IDIOMS.map(i => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique idiom phrases', () => {
      const idioms = IDIOMS.map(i => i.idiom);
      const uniqueIdioms = new Set(idioms);
      expect(uniqueIdioms.size).toBe(idioms.length);
    });
  });

  describe('Grade distribution', () => {
    it('should have idioms for grade 4', () => {
      const grade4Idioms = IDIOMS.filter(i => i.grade === 4);
      expect(grade4Idioms.length).toBeGreaterThan(0);
    });

    it('should have idioms for grade 5', () => {
      const grade5Idioms = IDIOMS.filter(i => i.grade === 5);
      expect(grade5Idioms.length).toBeGreaterThan(0);
    });

    it('should have idioms for grade 6', () => {
      const grade6Idioms = IDIOMS.filter(i => i.grade === 6);
      expect(grade6Idioms.length).toBeGreaterThan(0);
    });
  });

  describe('Content validation', () => {
    it('should have valid pinyin format', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        // Pinyin should contain spaces and valid pinyin characters
        const pinyinPattern = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+$/i;
        expect(pinyinPattern.test(idiom.pinyin.toLowerCase())).toBe(true);
      });
    });

    it('should have Chinese characters in idiom', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(idiom.idiom)).toBe(true);
        // Idioms should be 4 characters typically
        expect(idiom.idiom.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('should have meaningful story content', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        expect(idiom.story.length).toBeGreaterThan(50);
        // Story should contain Chinese characters
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(idiom.story)).toBe(true);
      });
    });

    it('should have valid example usage', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        // Example should contain the idiom
        expect(idiom.example.includes(idiom.idiom)).toBe(true);
        // Example should be a meaningful sentence
        expect(idiom.example.length).toBeGreaterThan(10);
      });
    });

    it('should have valid source citation', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        // Source should reference a historical text or book
        expect(idiom.source.length).toBeGreaterThan(5);
      });
    });
  });

  describe('Idiom ID format', () => {
    it('should have proper ID format', () => {
      IDIOMS.forEach((idiom: Idiom) => {
        expect(idiom.id.startsWith('idiom-')).toBe(true);
        // ID should have numeric suffix
        const numPart = idiom.id.split('-')[1];
        expect(/^\d+$/.test(numPart)).toBe(true);
      });
    });
  });

  describe('Famous idioms presence', () => {
    it('should include common grade 4 idioms', () => {
      const grade4Idioms = IDIOMS.filter(i => i.grade === 4);
      const idiomNames = grade4Idioms.map(i => i.idiom);
      expect(idiomNames).toContain('画龙点睛');
      expect(idiomNames).toContain('守株待兔');
      expect(idiomNames).toContain('亡羊补牢');
      expect(idiomNames).toContain('掩耳盗铃');
      expect(idiomNames).toContain('刻舟求剑');
    });

    it('should include common grade 5 idioms', () => {
      const grade5Idioms = IDIOMS.filter(i => i.grade === 5);
      const idiomNames = grade5Idioms.map(i => i.idiom);
      expect(idiomNames).toContain('卧薪尝胆');
      expect(idiomNames).toContain('完璧归赵');
      expect(idiomNames).toContain('负荆请罪');
      expect(idiomNames).toContain('纸上谈兵');
      expect(idiomNames).toContain('闻鸡起舞');
    });

    it('should include common grade 6 idioms', () => {
      const grade6Idioms = IDIOMS.filter(i => i.grade === 6);
      const idiomNames = grade6Idioms.map(i => i.idiom);
      expect(idiomNames).toContain('悬梁刺股');
      expect(idiomNames).toContain('凿壁偷光');
      expect(idiomNames).toContain('程门立雪');
      expect(idiomNames).toContain('铁杵成针');
      expect(idiomNames).toContain('囊萤映雪');
    });
  });

  describe('Data completeness', () => {
    it('should have sufficient total idioms', () => {
      expect(IDIOMS.length).toBeGreaterThanOrEqual(15);
    });

    it('should have at least 5 idioms per grade', () => {
      [4, 5, 6].forEach(grade => {
        const gradeIdioms = IDIOMS.filter(i => i.grade === grade);
        expect(gradeIdioms.length).toBeGreaterThanOrEqual(5);
      });
    });
  });
});