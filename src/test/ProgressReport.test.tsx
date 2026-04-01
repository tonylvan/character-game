import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressReport from '../pages/ProgressReport';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock storage functions
vi.mock('../utils/storage', () => ({
  getUserData: vi.fn(() => ({
    score: 100,
    level: 3,
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
    exp: 50,
    parentSettings: {
      dailyLimit: 30,
      gameTime: 15,
      isTimeLimitEnabled: false,
      wrongCharFrequency: 50,
      boostWrongChars: true,
    },
  })),
  getCharErrorRanking: vi.fn(() => [
    { char: '添', count: 3 },
    { char: '兔', count: 2 },
  ]),
  getRanking: vi.fn(() => [
    { name: '测试用户', score: 100, date: '2026-04-01' },
    { name: '其他用户', score: 50, date: '2026-04-01' },
  ]),
}));

describe('ProgressReport page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      render(<ProgressReport />);
      expect(screen.getByText('📊 学习进度报告')).toBeInTheDocument();
    });

    it('should render user name', () => {
      render(<ProgressReport />);
      expect(screen.getByText('测试用户')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(<ProgressReport />);
      expect(screen.getByText('← 返回首页')).toBeInTheDocument();
    });
  });

  describe('Stats display', () => {
    it('should display total score', () => {
      render(<ProgressReport />);
      expect(screen.getByText('总积分')).toBeInTheDocument();
    });

    it('should display current level', () => {
      render(<ProgressReport />);
      expect(screen.getByText('当前关卡')).toBeInTheDocument();
    });

    it('should display wrong characters count', () => {
      render(<ProgressReport />);
      expect(screen.getByText('错字数')).toBeInTheDocument();
    });

    it('should display wrong questions count', () => {
      render(<ProgressReport />);
      expect(screen.getByText('错题数')).toBeInTheDocument();
    });
  });

  describe('Master level display', () => {
    it('should show 入门级 for level 1-3', async () => {
      const { getUserData } = await import('../utils/storage');
      vi.mocked(getUserData).mockReturnValue({
        score: 50,
        level: 2,
        wrongQuestions: [],
        userName: '新手',
        charErrors: [],
        achievements: [],
        parentSettings: {} as any,
      } as any);
      
      render(<ProgressReport />);
      expect(screen.getByText('🌱 入门级')).toBeInTheDocument();
    });

    it('should show 进阶级 for level 4-6', async () => {
      const { getUserData } = await import('../utils/storage');
      vi.mocked(getUserData).mockReturnValue({
        score: 100,
        level: 5,
        wrongQuestions: [],
        userName: '进阶',
        charErrors: [],
        achievements: [],
        parentSettings: {} as any,
      } as any);
      
      render(<ProgressReport />);
      expect(screen.getByText('📚 进阶级')).toBeInTheDocument();
    });

    it('should show 熟练级 for level 7-9', async () => {
      const { getUserData } = await import('../utils/storage');
      vi.mocked(getUserData).mockReturnValue({
        score: 200,
        level: 8,
        wrongQuestions: [],
        userName: '熟练',
        charErrors: [],
        achievements: [],
        parentSettings: {} as any,
      } as any);
      
      render(<ProgressReport />);
      expect(screen.getByText('🎓 熟练级')).toBeInTheDocument();
    });

    it('should show 大师级 for level 10+', async () => {
      const { getUserData } = await import('../utils/storage');
      vi.mocked(getUserData).mockReturnValue({
        score: 500,
        level: 10,
        wrongQuestions: [],
        userName: '大师',
        charErrors: [],
        achievements: [],
        parentSettings: {} as any,
      } as any);
      
      render(<ProgressReport />);
      expect(screen.getByText('🏆 大师级')).toBeInTheDocument();
    });
  });

  describe('Knowledge mastery section', () => {
    it('should render mastery section', () => {
      render(<ProgressReport />);
      expect(screen.getByText('🎯 知识点掌握')).toBeInTheDocument();
    });

    it('should show pinyin mastery', () => {
      render(<ProgressReport />);
      expect(screen.getByText('拼音书写')).toBeInTheDocument();
    });

    it('should show character recognition', () => {
      render(<ProgressReport />);
      expect(screen.getByText('汉字认知')).toBeInTheDocument();
    });

    it('should show idiom understanding', () => {
      render(<ProgressReport />);
      expect(screen.getByText('成语理解')).toBeInTheDocument();
    });

    it('should show poetry memorization', () => {
      render(<ProgressReport />);
      expect(screen.getByText('古诗背诵')).toBeInTheDocument();
    });
  });

  describe('Weak areas section', () => {
    it('should render weak areas section', () => {
      render(<ProgressReport />);
      expect(screen.getByText('⚠️ 需要加强的字 TOP 5')).toBeInTheDocument();
    });

    it('should display error ranking', () => {
      render(<ProgressReport />);
      // Should show error count
      expect(screen.getByText(/错3次/)).toBeInTheDocument();
    });

    it('should show empty state when no errors', async () => {
      const { getCharErrorRanking } = await import('../utils/storage');
      vi.mocked(getCharErrorRanking).mockReturnValue([]);
      
      render(<ProgressReport />);
      expect(screen.getByText('暂无错字记录，继续加油！')).toBeInTheDocument();
    });
  });

  describe('Learning suggestions', () => {
    it('should render suggestions section', () => {
      render(<ProgressReport />);
      expect(screen.getByText('💡 学习建议')).toBeInTheDocument();
    });

    it('should show suggestion for many wrong characters', async () => {
      const { getCharErrorRanking } = await import('../utils/storage');
      vi.mocked(getCharErrorRanking).mockReturnValue([
        { char: '添', count: 3 },
        { char: '兔', count: 2 },
        { char: '牢', count: 1 },
        { char: '铃', count: 1 },
        { char: '剑', count: 1 },
        { char: '数', count: 1 },
        { char: '珠', count: 1 },
        { char: '竹', count: 1 },
        { char: '睛', count: 1 },
        { char: '琴', count: 1 },
        { char: '厉', count: 1 },
      ]);
      
      render(<ProgressReport />);
      expect(screen.getByText(/你需要加强练习错字本/)).toBeInTheDocument();
    });

    it('should show suggestion for moderate wrong characters', async () => {
      const { getCharErrorRanking } = await import('../utils/storage');
      vi.mocked(getCharErrorRanking).mockReturnValue([
        { char: '添', count: 3 },
        { char: '兔', count: 2 },
        { char: '牢', count: 1 },
        { char: '铃', count: 1 },
        { char: '剑', count: 1 },
        { char: '数', count: 1 },
      ]);
      
      render(<ProgressReport />);
      expect(screen.getByText(/继续加油/)).toBeInTheDocument();
    });

    it('should show suggestion for few wrong characters', async () => {
      const { getCharErrorRanking } = await import('../utils/storage');
      vi.mocked(getCharErrorRanking).mockReturnValue([
        { char: '添', count: 1 },
      ]);
      
      render(<ProgressReport />);
      expect(screen.getByText(/你表现很棒/)).toBeInTheDocument();
    });
  });

  describe('Daily tasks', () => {
    it('should render daily tasks section', () => {
      render(<ProgressReport />);
      expect(screen.getByText('📅 今日任务')).toBeInTheDocument();
    });

    it('should show task list', () => {
      render(<ProgressReport />);
      expect(screen.getByText('完成5道闯关题')).toBeInTheDocument();
      expect(screen.getByText('复习3个错字')).toBeInTheDocument();
      expect(screen.getByText('学习1个新汉字故事')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home on back click', async () => {
      const { fireEvent } = await import('@testing-library/react');
      render(<ProgressReport />);
      
      const backBtn = screen.getByText('← 返回首页');
      fireEvent.click(backBtn);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});