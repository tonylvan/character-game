import { UserData, Question, RankingEntry, CharErrorStat, SignInData, SignInRecord, SignInReward, Achievement, AchievementUnlockResult } from '../types';
import questions from '../data/questions';
import unitQuestions from '../data/unitVocab';
import textbookQuestions from '../data/textbook';
import grade4bQuestions from '../data/grade4b';
import achievementsData from '../data/achievements';

const STORAGE_KEY = 'chinese-character-game';
const THEME_KEY = 'chinese-character-theme';

// AchievementWithStatus 类型定义
export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockTime?: string | null;
}

export const defaultUserData: UserData = {
  score: 0,
  level: 1,
  lives: 3,
  streak: 0,
  wrongQuestions: [],
  customQuestions: [],
  deletedQuestionIds: [],
  ranking: [],
  userName: '玩家',
  charErrors: [],
  favorites: [],
  achievements: [],
  achievementUnlocks: {},
  checkins: [],
  checkinStreak: 0,
  lastCheckinDate: '',
  totalQuestionsCorrect: 0,
  maxStreak: 0,
  exp: 0,
  parentSettings: {
    dailyLimit: 30,
    gameTime: 15,
    isTimeLimitEnabled: false,
    wrongCharFrequency: 50, // 默认50%概率
    boostWrongChars: true, // 默认启用错字提升
    pinyinDifficulty: 'easy', // 默认简单模式
    showHint: true, // 默认显示提示
  },
};

export function getUserData(): UserData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultUserData, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load user data:', e);
  }
  return defaultUserData;
}

export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
}

export function updateScore(add: number): number {
  const data = getUserData();
  data.score = Math.max(0, data.score + add);
  saveUserData(data);
  return data.score;
}

export function updateLevel(level: number): void {
  const data = getUserData();
  data.level = level;
  saveUserData(data);
}

export function addWrongQuestion(question: Question): void {
  const data = getUserData();
  const exists = data.wrongQuestions.some(q => q.id === question.id);
  if (!exists) {
    data.wrongQuestions.push(question);
    saveUserData(data);
  }
}

export function removeWrongQuestion(questionId: string): void {
  const data = getUserData();
  data.wrongQuestions = data.wrongQuestions.filter(q => q.id !== questionId);
  saveUserData(data);
}

export function getWrongQuestions(): Question[] {
  return getUserData().wrongQuestions;
}

export function addCustomQuestion(question: Question): void {
  const data = getUserData();
  data.customQuestions.push(question);
  saveUserData(data);
}

export function removeCustomQuestion(questionId: string): void {
  const data = getUserData();
  data.customQuestions = data.customQuestions.filter(q => q.id !== questionId);
  saveUserData(data);
}

export function getCustomQuestions(): Question[] {
  return getUserData().customQuestions;
}

// 验证题目是否有效
function isValidQuestion(q: Question): boolean {
  if (!q || !q.type) return false;
  // 选字填空：content 不能以"_____"开头，必须有 options
  if (q.type === 'fill-blank') {
    if (q.content && q.content.startsWith('_____')) return false;
    if (!q.options || q.options.length === 0) return false;
  }
  return true;
}

export function getAllQuestions(): Question[] {
  const data = getUserData()
  const deletedIds = data.deletedQuestionIds || []
  const overrides = data.questionOverrides || {}
  
  // 合并所有题目源
  const all = [...questions, ...unitQuestions, ...textbookQuestions, ...grade4bQuestions, ...data.customQuestions]
  
  // 应用覆盖修改（如编辑过的题目）
  const withOverrides = all.map(q => overrides[q.id] ? { ...q, ...overrides[q.id] } : q)
  
  // 过滤掉已删除的题目和无效题目
  return withOverrides.filter(q => !deletedIds.includes(q.id) && isValidQuestion(q))
}

export function addRanking(name: string, score: number): void {
  const data = getUserData();
  data.ranking.push({
    name,
    score,
    date: new Date().toISOString(),
  });
  data.ranking.sort((a, b) => b.score - a.score);
  data.ranking = data.ranking.slice(0, 10);
  saveUserData(data);
}

export function getRanking(): RankingEntry[] {
  return getUserData().ranking;
}

export function resetUserData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// 记录错字
export function addCharError(char: string, source: 'game' | 'ocr' = 'game'): void {
  const data = getUserData();
  const existing = data.charErrors.find(e => e.char === char);
  
  if (existing) {
    existing.count += 1;
    existing.lastWrong = new Date().toISOString();
    if (!existing.sources.includes(source)) {
      existing.sources.push(source);
    }
  } else {
    data.charErrors.push({
      char,
      count: 1,
      lastWrong: new Date().toISOString(),
      sources: [source],
    });
  }
  
  // 按错误次数排序
  data.charErrors.sort((a, b) => b.count - a.count);
  saveUserData(data);
}

// 获取错字排行榜
export function getCharErrorRanking(): CharErrorStat[] {
  return getUserData().charErrors;
}

// 获取错字统计
export function getCharErrorStats(): { total: number; topWrong: CharErrorStat | null } {
  const errors = getCharErrorRanking();
  return {
    total: errors.reduce((sum, e) => sum + e.count, 0),
    topWrong: errors[0] || null,
  };
}

// 清空错字记录
export function clearCharErrors(): void {
  const data = getUserData();
  data.charErrors = [];
  saveUserData(data);
}

// 添加收藏
export function addFavorite(char: string): void {
  const data = getUserData();
  if (!data.favorites.includes(char)) {
    data.favorites.push(char);
    saveUserData(data);
  }
}

// 移除收藏
export function removeFavorite(char: string): void {
  const data = getUserData();
  data.favorites = data.favorites.filter(c => c !== char);
  saveUserData(data);
}

// 获取收藏列表
export function getFavorites(): string[] {
  return getUserData().favorites;
}

// 解锁成就
export function unlockAchievement(achievementId: string): boolean {
  const data = getUserData();
  if (!data.achievements.includes(achievementId)) {
    data.achievements.push(achievementId);
    if (!data.achievementUnlocks) {
      data.achievementUnlocks = {};
    }
    data.achievementUnlocks[achievementId] = new Date().toISOString();
    saveUserData(data);
    return true;
  }
  return false;
}

// 获取已解锁成就
export function getUnlockedAchievements(): string[] {
  return getUserData().achievements;
}

// 获取成就解锁时间
export function getAchievementUnlockTime(achievementId: string): string | null {
  const data = getUserData();
  return data.achievementUnlocks?.[achievementId] || null;
}

// 检查并解锁成就
export function checkAndUnlockAchievements(stats: {
  totalQuestionsCorrect: number;
  streak: number;
  totalScore: number;
  level: number;
  checkinStreak: number;
}): AchievementUnlockResult {
  const data = getUserData();
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of achievementsData) {
    if (data.achievements.includes(achievement.id)) continue;
    
    let shouldUnlock = false;
    switch (achievement.condition.type) {
      case 'questions_correct':
        shouldUnlock = stats.totalQuestionsCorrect >= achievement.condition.value;
        break;
      case 'streak':
        shouldUnlock = stats.streak >= achievement.condition.value;
        break;
      case 'total_score':
        shouldUnlock = stats.totalScore >= achievement.condition.value;
        break;
      case 'checkin_streak':
        shouldUnlock = stats.checkinStreak >= achievement.condition.value;
        break;
      case 'level':
        shouldUnlock = stats.level >= achievement.condition.value;
        break;
    }
    
    if (shouldUnlock) {
      data.achievements.push(achievement.id);
      if (!data.achievementUnlocks) {
        data.achievementUnlocks = {};
      }
      data.achievementUnlocks[achievement.id] = new Date().toISOString();
      newlyUnlocked.push(achievement);
    }
  }
  
  if (newlyUnlocked.length > 0) {
    saveUserData(data);
  }
  
  return {
    unlocked: achievementsData.filter(a => data.achievements.includes(a.id)),
    newlyUnlocked,
  };
}

// 获取所有成就状态
export function getAllAchievementsWithStatus(): AchievementWithStatus[] {
  const data = getUserData();
  return achievementsData.map(achievement => ({
    ...achievement,
    unlocked: data.achievements.includes(achievement.id),
    unlockTime: data.achievementUnlocks?.[achievement.id] || null,
  }));
}

// 签到
export function checkin(): { success: boolean; streak: number; newlyUnlocked: Achievement[] } {
  const data = getUserData();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // 已签到
  if (data.lastCheckinDate === today) {
    return { success: false, streak: data.checkinStreak || 0, newlyUnlocked: [] };
  }
  
  // 检查连续签到
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = 1;
  if (data.lastCheckinDate === yesterday) {
    newStreak = (data.checkinStreak || 0) + 1;
  }
  
  // 更新签到记录
  if (!data.checkins) {
    data.checkins = [];
  }
  data.checkins.push({
    date: today,
    timestamp: new Date().toISOString(),
  });
  data.lastCheckinDate = today;
  data.checkinStreak = newStreak;
  
  // 检查签到成就
  const achievementResult = checkAndUnlockAchievements({
    totalQuestionsCorrect: data.totalQuestionsCorrect || 0,
    streak: 0,
    totalScore: data.score,
    level: data.level,
    checkinStreak: newStreak,
  });
  
  saveUserData(data);
  
  return {
    success: true,
    streak: newStreak,
    newlyUnlocked: achievementResult.newlyUnlocked,
  };
}

// 获取签到状态
export function getCheckinStatus(): {
  todayChecked: boolean;
  streak: number;
  totalDays: number;
  lastCheckinDate: string;
} {
  const data = getUserData();
  const today = new Date().toISOString().split('T')[0];
  
  return {
    todayChecked: data.lastCheckinDate === today,
    streak: data.checkinStreak || 0,
    totalDays: data.checkins?.length || 0,
    lastCheckinDate: data.lastCheckinDate || '',
  };
}

// 更新答题统计
export function updateQuestionStats(correct: boolean, streak: number): void {
  const data = getUserData();
  if (correct) {
    data.totalQuestionsCorrect = (data.totalQuestionsCorrect || 0) + 1;
    data.maxStreak = Math.max(data.maxStreak || 0, streak);
  }
  saveUserData(data);
}

// 获取错字频率设置
export function getWrongCharFrequency(): number {
  const data = getUserData();
  return data.parentSettings?.wrongCharFrequency ?? 50;
}

// 设置错字频率
export function setWrongCharFrequency(frequency: number): void {
  const data = getUserData();
  if (!data.parentSettings) {
    data.parentSettings = defaultUserData.parentSettings;
  }
  data.parentSettings.wrongCharFrequency = frequency;
  data.parentSettings.boostWrongChars = frequency > 0;
  saveUserData(data);
}

// 获取是否启用错字提升
export function getBoostWrongChars(): boolean {
  const data = getUserData();
  return data.parentSettings?.boostWrongChars ?? true;
}

// 获取拼音写汉字难度
export function getPinyinDifficulty(): 'easy' | 'medium' | 'hard' {
  const data = getUserData();
  return data.parentSettings?.pinyinDifficulty ?? 'easy';
}

// 设置拼音写汉字难度
export function setPinyinDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
  const data = getUserData();
  if (!data.parentSettings) {
    data.parentSettings = defaultUserData.parentSettings;
  }
  data.parentSettings.pinyinDifficulty = difficulty;
  saveUserData(data);
}

// 获取是否显示提示
export function getShowHint(): boolean {
  const data = getUserData();
  return data.parentSettings?.showHint ?? true;
}

// 设置是否显示提示
export function setShowHint(show: boolean): void {
  const data = getUserData();
  if (!data.parentSettings) {
    data.parentSettings = defaultUserData.parentSettings;
  }
  data.parentSettings.showHint = show;
  saveUserData(data);
}

// 重置错字出现顺序（按错误次数排序）
export function resetCharErrorOrder(): void {
  const data = getUserData();
  data.charErrors.sort((a, b) => b.count - a.count);
  saveUserData(data);
}

export function exportData(): string {
  const data = getUserData();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    saveUserData(data);
    return true;
  } catch {
    return false;
  }
}

// 主题相关
export function getThemeId(): string {
  try {
    return localStorage.getItem(THEME_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function setThemeId(themeId: string): void {
  try {
    localStorage.setItem(THEME_KEY, themeId);
  } catch {}
}

// ============ 签到系统 ============

const SIGN_IN_KEY = 'chinese-character-signin';

// 签到奖励配置
export const SIGN_IN_REWARDS: SignInReward[] = [
  { streakDays: 3, bonusPoints: 5, label: '连续3天' },
  { streakDays: 7, bonusPoints: 15, label: '连续7天' },
  { streakDays: 14, bonusPoints: 30, label: '连续14天' },
  { streakDays: 30, bonusPoints: 100, label: '连续30天' },
];

// 基础签到积分
const BASE_SIGN_IN_POINTS = 10;

// 获取今日日期字符串 (YYYY-MM-DD)
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// 获取昨天日期字符串 (YYYY-MM-DD)
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// 默认签到数据
export const defaultSignInData: SignInData = {
  lastSignInDate: null,
  consecutiveDays: 0,
  totalDays: 0,
  records: [],
};

// 获取签到数据
export function getSignInData(): SignInData {
  try {
    const data = localStorage.getItem(SIGN_IN_KEY);
    if (data) {
      return { ...defaultSignInData, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load sign-in data:', e);
  }
  return defaultSignInData;
}

// 保存签到数据
export function saveSignInData(data: SignInData): void {
  try {
    localStorage.setItem(SIGN_IN_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save sign-in data:', e);
  }
}

// 检查今日是否已签到
export function hasSignedInToday(): boolean {
  const data = getSignInData();
  return data.lastSignInDate === getTodayString();
}

// 获取连续签到天数（考虑断签重置）
export function getConsecutiveDays(): number {
  const data = getSignInData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // 如果今天已签到，返回当前连续天数
  if (data.lastSignInDate === today) {
    return data.consecutiveDays;
  }

  // 如果昨天签到了，连续天数保持
  if (data.lastSignInDate === yesterday) {
    return data.consecutiveDays;
  }

  // 断签了，重置为0
  return 0;
}

// 计算签到奖励
export function calculateSignInReward(consecutiveDays: number): { base: number; bonus: number; total: number; nextReward: SignInReward | null } {
  let bonus = 0;
  
  // 计算适用的奖励
  for (const reward of SIGN_IN_REWARDS) {
    if (consecutiveDays >= reward.streakDays) {
      bonus = reward.bonusPoints;
    }
  }

  // 找到下一个奖励
  let nextReward: SignInReward | null = null;
  for (const reward of SIGN_IN_REWARDS) {
    if (consecutiveDays < reward.streakDays) {
      nextReward = reward;
      break;
    }
  }

  return {
    base: BASE_SIGN_IN_POINTS,
    bonus,
    total: BASE_SIGN_IN_POINTS + bonus,
    nextReward,
  };
}

// 执行签到
export function doSignIn(): { success: boolean; reward: number; consecutiveDays: number; message: string } {
  const today = getTodayString();
  const data = getSignInData();

  // 检查是否已签到
  if (data.lastSignInDate === today) {
    return {
      success: false,
      reward: 0,
      consecutiveDays: data.consecutiveDays,
      message: '今日已签到',
    };
  }

  const yesterday = getYesterdayString();
  let newConsecutiveDays: number;

  // 判断连续签到
  if (data.lastSignInDate === yesterday) {
    // 连续签到
    newConsecutiveDays = data.consecutiveDays + 1;
  } else {
    // 断签后重新开始
    newConsecutiveDays = 1;
  }

  // 计算奖励
  const rewardInfo = calculateSignInReward(newConsecutiveDays);

  // 创建签到记录
  const record: SignInRecord = {
    date: today,
    reward: rewardInfo.total,
    streakAtSign: newConsecutiveDays,
  };

  // 更新签到数据
  const newData: SignInData = {
    lastSignInDate: today,
    consecutiveDays: newConsecutiveDays,
    totalDays: data.totalDays + 1,
    records: [...data.records, record].slice(-30), // 只保留最近30天记录
  };

  saveSignInData(newData);

  // 更新用户积分
  updateScore(rewardInfo.total);

  // 生成奖励消息
  let message = `签到成功！获得 ${rewardInfo.total} 积分`;
  if (rewardInfo.bonus > 0) {
    message += `（含连续签到奖励 ${rewardInfo.bonus} 分）`;
  }

  return {
    success: true,
    reward: rewardInfo.total,
    consecutiveDays: newConsecutiveDays,
    message,
  };
}

// 获取本月签到记录
export function getMonthlySignInRecords(year: number, month: number): SignInRecord[] {
  const data = getSignInData();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  return data.records.filter(record => record.date.startsWith(monthStr));
}

// 重置签到数据
export function resetSignInData(): void {
  localStorage.removeItem(SIGN_IN_KEY);
}
