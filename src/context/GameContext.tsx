import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { GameState, GameAction, Question, CharStory, QuestionCategory, GradeLevel, UnitNumber, Achievement } from '../types';
import {
  getUserData,
  saveUserData,
  addWrongQuestion,
  addRanking,
  getAllQuestions,
  addCharError,
  getCharErrorRanking,
  getWrongCharFrequency,
  getPinyinDifficulty,
  checkAndUnlockAchievements,
  updateQuestionStats,
  getCheckinStatus,
} from '../utils/storage';
import charStories from '../data/charStories';
import achievementsData from '../data/achievements';

// 导出成就数据供其他组件使用
export { achievementsData as ACHIEVEMENTS_DATA };

export const QUESTION_CATEGORIES: { value: QuestionCategory; label: string; desc: string }[] = [
  { value: 'all', label: '混合闯关', desc: '所有类型随机出现' },
  { value: 'idiom', label: '成语填空', desc: '填写成语中的汉字' },
  { value: 'poetry', label: '古诗名句', desc: '填写古诗句中的字' },
  { value: 'common-mistake', label: '常见错别字', desc: '辨析易错汉字' },
  { value: 'pinyin-to-char', label: '拼音写汉字', desc: '看拼音写汉字' },
  { value: 'char-to-pinyin', label: '汉字写拼音', desc: '看汉字写拼音' },
];

export const GRADE_LEVELS: { value: GradeLevel; label: string; desc: string }[] = [
  { value: '1-上册', label: '一年级上册', desc: '简单常用字词' },
  { value: '1-下册', label: '一年级下册', desc: '简单常用字词' },
  { value: '2-上册', label: '二年级上册', desc: '基础词汇' },
  { value: '2-下册', label: '二年级下册', desc: '基础词汇' },
  { value: '3-上册', label: '三年级上册', desc: '常用词汇' },
  { value: '3-下册', label: '三年级下册', desc: '常用词汇' },
  { value: '4-上册', label: '四年级上册', desc: '进阶词汇' },
  { value: '4-下册', label: '四年级下册', desc: '进阶词汇' },
  { value: '5-上册', label: '五年级上册', desc: '高级词汇' },
  { value: '5-下册', label: '五年级下册', desc: '高级词汇' },
  { value: '6-上册', label: '六年级上册', desc: '复杂词汇' },
  { value: '6-下册', label: '六年级下册', desc: '复杂词汇' },
];

export const UNIT_NUMBERS: { value: UnitNumber; label: string }[] = [
  { value: 1, label: '第一单元' },
  { value: 2, label: '第二单元' },
  { value: 3, label: '第三单元' },
  { value: 4, label: '第四单元' },
  { value: 5, label: '第五单元' },
  { value: 6, label: '第六单元' },
  { value: 7, label: '第七单元' },
  { value: 8, label: '第八单元' },
];

const initialState: GameState = {
  score: 0,
  level: 1,
  lives: 3,
  streak: 0,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 10,
  isPlaying: false,
  isGameOver: false,
  isLevelComplete: false,
  selectedCategory: 'all',
  selectedGrade: 'all',
  selectedUnit: 'all',
  usedQuestionIds: [],
  totalQuestionsCorrect: 0,
  maxStreak: 0,
};

function parseGrade(gradeStr: string): { grade: number; semester: string } {
  if (gradeStr === 'all') return { grade: 0, semester: '' };
  const parts = gradeStr.split('-');
  return { grade: parseInt(parts[0]) || 0, semester: parts[1] || '' };
}

function getQuestionsByCategory(category: QuestionCategory, level: number, grade: GradeLevel = 'all', unit: UnitNumber = 'all', usedIds: string[] = []): Question[] {
  const allQuestions = getAllQuestions();
  const difficulty = getPinyinDifficulty();
  const { grade: gradeNum } = parseGrade(grade);
  
  let questions: Question[];
  if (grade === 'all' || gradeNum === 0) {
    questions = allQuestions.filter((q) => q.level <= level);
  } else {
    questions = [...allQuestions];
  }
  
  if (usedIds.length > 0) {
    questions = questions.filter((q) => !usedIds.includes(q.id));
  }
  
  if (grade !== 'all' && gradeNum > 0) {
    questions = questions.filter((q) => {
      if (!q.grade) return true;
      const qGrade = typeof q.grade === 'string' ? parseGrade(q.grade).grade : q.grade;
      return qGrade === gradeNum;
    });
  }
  
  if (unit !== 'all') {
    questions = questions.filter((q) => q.unit === unit || !q.unit);
  }
  
  if (difficulty === 'medium' && grade !== 'all' && usedIds.length > 0) {
    const nextGradeQuestions = allQuestions.filter(q => {
      if (usedIds.includes(q.id)) return false;
      const qGrade = typeof q.grade === 'string' ? parseGrade(q.grade).grade : (q.grade || 0);
      return (qGrade === (gradeNum + 1)) || (qGrade === gradeNum && q.unit === (unit as number) + 1);
    });
    const sampleSize = Math.ceil(nextGradeQuestions.length / 4);
    const shuffled = nextGradeQuestions.sort(() => 0.5 - Math.random());
    questions = [...questions, ...shuffled.slice(0, sampleSize)];
  }
  
  if (category === 'all') {
    return questions;
  }
  
  return questions.filter((q) => {
    switch (category) {
      case 'idiom': return q.type === 'fill-blank' && q.content.includes('_____') && !q.content.includes('诗');
      case 'poetry': return q.type === 'fill-blank' && (q.content.includes('诗') || q.content.includes('白日') || q.content.includes('举头'));
      case 'common-mistake': return q.type === 'fill-blank' && (q.content.includes('再接') || q.content.includes('川流') || q.content.includes('焕然'));
      case 'pinyin-to-char': return q.type === 'pinyin-to-char';
      case 'char-to-pinyin': return q.type === 'char-to-pinyin';
      default: return true;
    }
  });
}

function isCommonMistakeQuestion(question: Question): boolean {
  const wrongChars = ['再接', '川流', '焕然', '哭笑', '有成', '屈指', '贻笑', '走马', '班门', '画蛇'];
  const wrongPinyin = question.type === 'char-to-pinyin';
  const isIdiom = question.type === 'fill-blank' && question.content.includes('_____') && !question.content.includes('诗');
  const isPoetry = question.type === 'fill-blank' && (question.content.includes('诗') || question.content.includes('白日') || question.content.includes('举头'));
  return wrongChars.some(c => question.content?.includes(c)) || wrongPinyin || isIdiom || isPoetry;
}

function isValidQuestion(question: Question): boolean {
  if (!question || !question.type) return false;
  if (question.type === 'fill-blank') {
    if (question.content && question.content.startsWith('_____')) return false;
    if (!question.options || question.options.length === 0) return false;
  }
  return true;
}

function getWeightForQuestion(question: Question): number {
  if (!isValidQuestion(question)) return 0;
  const errorRanking = getCharErrorRanking();
  const errorChar = errorRanking.find(e => e.char === question.char);
  const frequency = getWrongCharFrequency();
  const boostEnabled = frequency > 0;
  let weight = 1;
  if (isCommonMistakeQuestion(question)) weight += 1.5;
  if (errorChar && boostEnabled) {
    weight += (frequency / 50) * errorChar.count * 0.5;
  }
  return weight;
}

function weightedRandomSelect(questions: Question[]): Question {
  const validQuestions = questions.filter(q => isValidQuestion(q));
  if (validQuestions.length === 0) {
    const allQuestions = getAllQuestions().filter(q => isValidQuestion(q));
    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
  }
  const totalWeight = validQuestions.reduce((sum, q) => sum + getWeightForQuestion(q), 0);
  let random = Math.random() * totalWeight;
  for (const question of validQuestions) {
    random -= getWeightForQuestion(question);
    if (random <= 0) return question;
  }
  return validQuestions[validQuestions.length - 1];
}

function getQuestionByLevel(level: number, category: QuestionCategory = 'all', grade: GradeLevel = 'all', unit: UnitNumber = 'all', usedIds: string[] = []): Question | null {
  const questions = getQuestionsByCategory(category, level, grade, unit, usedIds);
  if (questions.length === 0) {
    let allQuestions = getAllQuestions().filter(q => !usedIds.includes(q.id) && isValidQuestion(q));
    if (allQuestions.length === 0) allQuestions = getAllQuestions().filter(q => isValidQuestion(q));
    if (allQuestions.length === 0) return null; // 防止返回undefined
    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
  }
  return weightedRandomSelect(questions);
}

export function getCharStory(char: string): CharStory | undefined {
  return charStories.find((story) => story.char === char);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload.category };
    case 'SET_GRADE': return { ...state, selectedGrade: action.payload.grade };
    case 'SET_UNIT': return { ...state, selectedUnit: action.payload.unit };
    case 'START_GAME': {
      const question = getQuestionByLevel(state.level, state.selectedCategory, state.selectedGrade, state.selectedUnit, []);
      if (!question) {
        // 如果没有可用题目，返回初始状态
        return { ...initialState, isPlaying: true, currentQuestion: null, level: state.level, selectedCategory: state.selectedCategory, selectedGrade: state.selectedGrade, selectedUnit: state.selectedUnit, usedQuestionIds: [] };
      }
      return { ...initialState, isPlaying: true, currentQuestion: question, level: state.level, selectedCategory: state.selectedCategory, selectedGrade: state.selectedGrade, selectedUnit: state.selectedUnit, usedQuestionIds: [question.id] };
    }
    case 'ANSWER_CORRECT': {
      const newScore = state.score + 10 + (state.streak >= 2 ? 5 : 0);
      const newStreak = state.streak + 1;
      const newTotalCorrect = state.totalQuestionsCorrect + 1;
      return { ...state, score: newScore, streak: newStreak, questionIndex: state.questionIndex + 1, totalQuestionsCorrect: newTotalCorrect, maxStreak: Math.max(state.maxStreak, newStreak) };
    }
    case 'ANSWER_WRONG': {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        if (state.currentQuestion) { addWrongQuestion(state.currentQuestion); addCharError(state.currentQuestion.char, 'game'); }
        return { ...state, lives: 0, isGameOver: true, isPlaying: false };
      }
      if (state.currentQuestion) { addWrongQuestion(state.currentQuestion); addCharError(state.currentQuestion.char, 'game'); }
      return { ...state, lives: newLives, streak: 0, questionIndex: state.questionIndex + 1 };
    }
    case 'NEXT_QUESTION': {
      if (state.questionIndex >= state.totalQuestions) return { ...state, isLevelComplete: true, isPlaying: false };
      const newUsedIds = action.payload.question ? [...state.usedQuestionIds, action.payload.question.id] : state.usedQuestionIds;
      return { ...state, currentQuestion: action.payload.question, usedQuestionIds: newUsedIds };
    }
    case 'USE_LIFE': {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        if (state.currentQuestion) { addWrongQuestion(state.currentQuestion); addCharError(state.currentQuestion.char, 'game'); }
        return { ...state, lives: 0, isGameOver: true, isPlaying: false };
      }
      if (state.currentQuestion) { addWrongQuestion(state.currentQuestion); addCharError(state.currentQuestion.char, 'game'); }
      return { ...state, lives: newLives, streak: 0 };
    }
    case 'LEVEL_UP': {
      const newLevel = state.level + 1;
      const userData = getUserData();
      userData.level = newLevel;
      userData.score = state.score;
      saveUserData(userData);
      const question = getQuestionByLevel(newLevel, state.selectedCategory, state.selectedGrade, state.selectedUnit);
      if (!question) {
        return { ...initialState, level: newLevel, score: state.score, currentQuestion: null, isPlaying: true, selectedCategory: state.selectedCategory, selectedGrade: state.selectedGrade, selectedUnit: state.selectedUnit };
      }
      return { ...initialState, level: newLevel, score: state.score, currentQuestion: question, isPlaying: true, selectedCategory: state.selectedCategory, selectedGrade: state.selectedGrade, selectedUnit: state.selectedUnit, usedQuestionIds: [question.id] };
    }
    case 'GAME_OVER': {
      const userData = getUserData();
      if (state.score > 0) addRanking(userData.userName, state.score);
      return { ...state, isGameOver: true, isPlaying: false };
    }
    case 'RESET_GAME': {
      const userData = getUserData();
      return { ...initialState, level: userData.level };
    }
    default: return state;
  }
}

interface GameContextType {
  state: GameState;
  setCategory: (category: QuestionCategory) => void;
  setGrade: (grade: GradeLevel) => void;
  setUnit: (unit: UnitNumber) => void;
  startGame: () => void;
  answerCorrect: () => Achievement[]; // 返回新解锁的成就
  answerWrong: () => void;
  nextQuestion: () => void;
  levelUp: () => Achievement[]; // 返回新解锁的成就
  gameOver: () => void;
  resetGame: () => void;
  getStory: (char: string) => CharStory | undefined;
  newlyUnlockedAchievements: Achievement[]; // 新解锁的成就列表
  clearNewlyUnlocked: () => void; // 清除新解锁提示
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const userData = getUserData();
    if (userData.level > 1) dispatch({ type: 'RESET_GAME' });
  }, []);

  const setCategory = (category: QuestionCategory) => dispatch({ type: 'SET_CATEGORY', payload: { category } });
  const setGrade = (grade: GradeLevel) => dispatch({ type: 'SET_GRADE', payload: { grade } });
  const setUnit = (unit: UnitNumber) => dispatch({ type: 'SET_UNIT', payload: { unit } });
  const startGame = () => dispatch({ type: 'START_GAME', payload: { question: getQuestionByLevel(state.level, state.selectedCategory, state.selectedGrade, state.selectedUnit) } });
  
  const answerCorrect = (): Achievement[] => {
    dispatch({ type: 'ANSWER_CORRECT' });
    // 更新答题统计
    const userData = getUserData();
    const newTotalCorrect = (userData.totalQuestionsCorrect || 0) + 1;
    const newStreak = state.streak + 1;
    updateQuestionStats(true, newStreak);
    
    // 检查成就解锁
    const checkinStatus = getCheckinStatus();
    const result = checkAndUnlockAchievements({
      totalQuestionsCorrect: newTotalCorrect,
      streak: newStreak,
      totalScore: state.score + 10 + (state.streak >= 2 ? 5 : 0),
      level: state.level,
      checkinStreak: checkinStatus.streak,
    });
    
    if (result.newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievements(result.newlyUnlocked);
    }
    
    return result.newlyUnlocked;
  };
  
  const answerWrong = () => {
    dispatch({ type: 'ANSWER_WRONG' });
    updateQuestionStats(false, 0);
  };
  
  const nextQuestion = () => {
    if (state.questionIndex >= state.totalQuestions) {
      dispatch({ type: 'LEVEL_UP' });
    } else {
      const question = getQuestionByLevel(state.level, state.selectedCategory, state.selectedGrade, state.selectedUnit, state.usedQuestionIds);
      dispatch({ type: 'NEXT_QUESTION', payload: { question } });
    }
  };
  
  const levelUp = (): Achievement[] => {
    dispatch({ type: 'LEVEL_UP' });
    const newLevel = state.level + 1;
    
    // 检查关卡成就解锁
    const userData = getUserData();
    const checkinStatus = getCheckinStatus();
    const result = checkAndUnlockAchievements({
      totalQuestionsCorrect: userData.totalQuestionsCorrect || 0,
      streak: 0,
      totalScore: userData.score,
      level: newLevel,
      checkinStreak: checkinStatus.streak,
    });
    
    if (result.newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievements(result.newlyUnlocked);
    }
    
    return result.newlyUnlocked;
  };
  
  const gameOver = () => dispatch({ type: 'GAME_OVER' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const getStory = (char: string) => getCharStory(char);
  const clearNewlyUnlocked = () => setNewlyUnlockedAchievements([]);

  return (
    <GameContext.Provider value={{ 
      state, 
      setCategory, 
      setGrade, 
      setUnit, 
      startGame, 
      answerCorrect, 
      answerWrong, 
      nextQuestion, 
      levelUp, 
      gameOver, 
      resetGame, 
      getStory,
      newlyUnlockedAchievements,
      clearNewlyUnlocked,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGame must be used within a GameProvider');
  return context;
}
