export type QuestionType = 'fill-blank' | 'pinyin-to-char' | 'char-to-pinyin';

// 题目分类
export type QuestionCategory = 'all' | 'idiom' | 'poetry' | 'common-mistake' | 'pinyin-to-char' | 'char-to-pinyin';

// 学期分类 (上册/下册)
export type Semester = '上册' | '下册';

// 年级分类 (用于词语闯关) - 格式：年级-学期，如 "1-上册"
export type GradeLevel = string | 'all';

// 单元分类
export type UnitNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'all';

export interface Question {
  id: string;
  type: QuestionType;
  category?: QuestionCategory;
  grade?: GradeLevel; // 年级
  unit?: UnitNumber; // 单元
  content: string;
  answer: string;
  options?: string[];
  level: number;
  char: string;
}

// 汉字学习分类
export type LearnCategory = 'all' | 'by-pinyin' | 'by-level' | 'by-stroke' | 'favorites';

// 错字统计
export interface CharErrorStat {
  char: string;
  count: number;
  lastWrong: string; // ISO date string
  sources: string[]; // 来源：'game' | 'ocr'
}

export interface CharStory {
  char: string;
  pinyin: string;
  meaning: string;
  origin: string;
  oracle: string;
  words: string[];
  sentence: string;
}

export interface UserData {
  score: number;
  level: number;
  lives: number;
  streak: number;
  wrongQuestions: Question[];
  customQuestions: Question[];
  deletedQuestionIds: string[]; // 已删除的题目ID
  questionOverrides?: Record<string, Question>; // 题目覆盖（用于编辑系统题目）
  ranking: RankingEntry[];
  userName: string;
  charErrors: CharErrorStat[];
  favorites: string[];
  achievements: string[]; // 已解锁的成就ID列表
  achievementUnlocks?: Record<string, string>; // 成就ID -> 解锁时间 ISO string
  checkins?: CheckinRecord[]; // 签到记录
  checkinStreak?: number; // 连续签到天数
  lastCheckinDate?: string; // 最后签到日期 YYYY-MM-DD
  totalQuestionsCorrect?: number; // 累计答对题数
  maxStreak?: number; // 最大连续答对数
  exp: number; // 经验值
  // 家长管控设置
  parentSettings: {
    dailyLimit: number;
    gameTime: number;
    isTimeLimitEnabled: boolean;
    wrongCharFrequency: number; // 错字出现频率 0-100
    boostWrongChars: boolean; // 是否提升错字出现概率
    tasks?: Array<{
      id: number;
      title: string;
      reward: number;
      completed: boolean;
    }>;
    // 闯关倒计时设置
    countdownEnabled?: boolean;
    countdownMinutes?: number;
    questionCount?: number;
    // 拼音写汉字难度设置
    pinyinDifficulty?: 'easy' | 'medium' | 'hard'; // easy: 显示完整拼音, medium: 首字母, hard: 纯声调
    showHint?: boolean; // 是否显示提示
  };
}

export interface RankingEntry {
  name: string;
  score: number;
  date: string;
}

// 成就条件类型
export interface AchievementCondition {
  type: 'questions_correct' | 'streak' | 'total_score' | 'checkin_streak' | 'level';
  value: number;
}

// 成就定义
export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: 'game' | 'score' | 'checkin' | 'level';
  condition: AchievementCondition;
  unlocked?: boolean; // 可选的状态标记
}

// 已解锁成就记录
export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO date string
}

// 签到记录
export interface CheckinRecord {
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO date string
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  streak: number;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  isPlaying: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  selectedCategory: QuestionCategory; // 当前选择的题目分类
  selectedGrade: GradeLevel; // 当前选择的年级
  selectedUnit: UnitNumber; // 当前选择的单元
  usedQuestionIds: string[]; // 已出现的题目ID（防止重复）
  totalQuestionsCorrect: number; // 累计答对题数
  maxStreak: number; // 最大连续答对数
}

export interface AchievementUnlockResult {
  unlocked: Achievement[];
  newlyUnlocked: Achievement[];
}

export type GameAction =
  | { type: 'START_GAME'; payload: { question: Question } }
  | { type: 'SET_CATEGORY'; payload: { category: QuestionCategory } }
  | { type: 'SET_GRADE'; payload: { grade: GradeLevel } }
  | { type: 'SET_UNIT'; payload: { unit: UnitNumber } }
  | { type: 'ANSWER_CORRECT' }
  | { type: 'ANSWER_WRONG' }
  | { type: 'NEXT_QUESTION'; payload: { question: Question } }
  | { type: 'USE_LIFE' }
  | { type: 'LEVEL_UP' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' };

// 签到记录
export interface SignInRecord {
  date: string; // ISO date string (YYYY-MM-DD)
  reward: number; // 获得的积分
  streakAtSign: number; // 签到时的连续天数
}

// 签到数据
export interface SignInData {
  lastSignInDate: string | null; // 最后签到日期 (YYYY-MM-DD)
  consecutiveDays: number; // 连续签到天数
  totalDays: number; // 累计签到天数
  records: SignInRecord[]; // 签到记录
}

// 签到奖励配置
export interface SignInReward {
  streakDays: number;
  bonusPoints: number;
  label: string;
}
