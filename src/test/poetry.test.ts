import { describe, it, expect } from 'vitest';
import { POETRY, type Poetry } from '../data/poetry';

describe('poetry data', () => {
  describe('Poetry structure validation', () => {
    it('should have valid poetry structure', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.id).toBeDefined();
        expect(poem.id.length).toBeGreaterThan(0);
        expect(poem.title).toBeDefined();
        expect(poem.title.length).toBeGreaterThan(0);
        expect(poem.author).toBeDefined();
        expect(poem.author.length).toBeGreaterThan(0);
        expect(poem.dynasty).toBeDefined();
        expect(poem.dynasty.length).toBeGreaterThan(0);
        expect(poem.content).toBeDefined();
        expect(Array.isArray(poem.content)).toBe(true);
        expect(poem.content.length).toBeGreaterThan(0);
        expect(poem.pinyin).toBeDefined();
        expect(Array.isArray(poem.pinyin)).toBe(true);
        expect(poem.pinyin.length).toBe(poem.content.length);
        expect(poem.meaning).toBeDefined();
        expect(poem.meaning.length).toBeGreaterThan(0);
        expect(poem.story).toBeDefined();
        expect(poem.story.length).toBeGreaterThan(0);
        expect(poem.appreciation).toBeDefined();
        expect(poem.appreciation.length).toBeGreaterThan(0);
        expect(poem.grade).toBeDefined();
        expect([4, 5, 6]).toContain(poem.grade);
      });
    });

    it('should have unique poetry IDs', () => {
      const ids = POETRY.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique poetry titles', () => {
      const titles = POETRY.map(p => p.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });
  });

  describe('Grade distribution', () => {
    it('should have poetry for grade 4', () => {
      const grade4Poetry = POETRY.filter(p => p.grade === 4);
      expect(grade4Poetry.length).toBeGreaterThan(0);
    });

    it('should have poetry for grade 5', () => {
      const grade5Poetry = POETRY.filter(p => p.grade === 5);
      expect(grade5Poetry.length).toBeGreaterThan(0);
    });

    it('should have poetry for grade 6', () => {
      const grade6Poetry = POETRY.filter(p => p.grade === 6);
      expect(grade6Poetry.length).toBeGreaterThan(0);
    });
  });

  describe('Content validation', () => {
    it('should have valid pinyin format', () => {
      POETRY.forEach((poem: Poetry) => {
        poem.pinyin.forEach(pinyinLine => {
          const pinyinPattern = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+$/i;
          expect(pinyinPattern.test(pinyinLine.toLowerCase())).toBe(true);
        });
      });
    });

    it('should have Chinese characters in content', () => {
      POETRY.forEach((poem: Poetry) => {
        poem.content.forEach(line => {
          const chinesePattern = /[\u4e00-\u9fff]/;
          expect(chinesePattern.test(line)).toBe(true);
        });
      });
    });

    it('should have matching content and pinyin lengths', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.content.length).toBe(poem.pinyin.length);
      });
    });

    it('should have meaningful meaning content', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.meaning.length).toBeGreaterThan(30);
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(poem.meaning)).toBe(true);
      });
    });

    it('should have meaningful story content', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.story.length).toBeGreaterThan(30);
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(poem.story)).toBe(true);
      });
    });

    it('should have meaningful appreciation content', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.appreciation.length).toBeGreaterThan(20);
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(poem.appreciation)).toBe(true);
      });
    });
  });

  describe('Poetry ID format', () => {
    it('should have proper ID format', () => {
      POETRY.forEach((poem: Poetry) => {
        expect(poem.id.startsWith('poem-')).toBe(true);
        const numPart = poem.id.split('-')[1];
        expect(/^\d+$/.test(numPart)).toBe(true);
      });
    });
  });

  describe('Famous poetry presence', () => {
    it('should include common grade 4 poetry', () => {
      const grade4Poetry = POETRY.filter(p => p.grade === 4);
      const titles = grade4Poetry.map(p => p.title);
      expect(titles).toContain('望庐山瀑布');
      expect(titles).toContain('题西林壁');
      expect(titles).toContain('游山西村');
    });

    it('should include common grade 5 poetry', () => {
      const grade5Poetry = POETRY.filter(p => p.grade === 5);
      const titles = grade5Poetry.map(p => p.title);
      expect(titles).toContain('示儿');
      expect(titles).toContain('题临安邸');
      expect(titles).toContain('己亥杂诗');
    });

    it('should include common grade 6 poetry', () => {
      const grade6Poetry = POETRY.filter(p => p.grade === 6);
      const titles = grade6Poetry.map(p => p.title);
      expect(titles).toContain('七律·长征');
      expect(titles).toContain('春望');
      expect(titles).toContain('石灰吟');
    });
  });

  describe('Author validation', () => {
    it('should have valid author names', () => {
      POETRY.forEach((poem: Poetry) => {
        const chinesePattern = /[\u4e00-\u9fff]/;
        expect(chinesePattern.test(poem.author)).toBe(true);
        // Author should be 2-4 characters typically
        expect(poem.author.length).toBeGreaterThanOrEqual(2);
        expect(poem.author.length).toBeLessThanOrEqual(4);
      });
    });

    it('should have famous authors', () => {
      const authors = POETRY.map(p => p.author);
      expect(authors).toContain('李白');
      expect(authors).toContain('杜甫');
      expect(authors).toContain('苏轼');
    });
  });

  describe('Dynasty validation', () => {
    it('should have valid dynasty names', () => {
      const validDynasties = ['唐', '宋', '明', '清', '现代', '晋', '南北朝', '春秋', '战国', '西汉', '东汉'];
      POETRY.forEach((poem: Poetry) => {
        expect(validDynasties).toContain(poem.dynasty);
      });
    });
  });

  describe('Data completeness', () => {
    it('should have sufficient total poetry', () => {
      expect(POETRY.length).toBeGreaterThanOrEqual(10);
    });

    it('should have at least 3 poetry per grade', () => {
      [4, 5, 6].forEach(grade => {
        const gradePoetry = POETRY.filter(p => p.grade === grade);
        expect(gradePoetry.length).toBeGreaterThanOrEqual(3);
      });
    });
  });
});