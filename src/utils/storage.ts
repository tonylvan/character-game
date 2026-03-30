import { UserData, Question, RankingEntry, CharErrorStat } from '../types';
import questions from '../data/questions';
import unitQuestions from '../data/unitVocab';
import textbookQuestions from '../data/textbook';
import grade4bQuestions from '../data/grade4b';

const STORAGE_KEY = 'chinese-character-game';
const THEME_KEY = 'chinese-character-theme';

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
  
  const all = [...questions, ...unitQuestions, ...textbookQuestions, ...grade4bQuestions, ...data.customQuestions]
  
  // 过滤掉已删除的题目和无效题目
  return all.filter(q => !deletedIds.includes(q.id) && isValidQuestion(q))
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
    saveUserData(data);
    return true;
  }
  return false;
}

// 获取已解锁成就
export function getUnlockedAchievements(): string[] {
  return getUserData().achievements;
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
