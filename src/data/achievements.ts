import { Achievement } from '../types';

// 成就定义
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_correct',
    name: '首战告捷',
    desc: '完成第一道题',
    icon: '🎯',
    category: 'game',
    condition: { type: 'questions_correct', value: 1 },
  },
  {
    id: 'streak_5',
    name: '五连击',
    desc: '连续答对5题',
    icon: '🔥',
    category: 'game',
    condition: { type: 'streak', value: 5 },
  },
  {
    id: 'streak_10',
    name: '十连胜',
    desc: '连续答对10题',
    icon: '⚡',
    category: 'game',
    condition: { type: 'streak', value: 10 },
  },
  {
    id: 'score_100',
    name: '百分达人',
    desc: '累计获得100分',
    icon: '💯',
    category: 'score',
    condition: { type: 'total_score', value: 100 },
  },
  {
    id: 'score_500',
    name: '知识渊博',
    desc: '累计获得500分',
    icon: '📚',
    category: 'score',
    condition: { type: 'total_score', value: 500 },
  },
  {
    id: 'checkin_3',
    name: '坚持学习',
    desc: '连续签到3天',
    icon: '🌱',
    category: 'checkin',
    condition: { type: 'checkin_streak', value: 3 },
  },
  {
    id: 'checkin_7',
    name: '签到达人',
    desc: '连续签到7天',
    icon: '🏆',
    category: 'checkin',
    condition: { type: 'checkin_streak', value: 7 },
  },
  {
    id: 'level_5',
    name: '初露锋芒',
    desc: '通过第5关',
    icon: '⭐',
    category: 'level',
    condition: { type: 'level', value: 5 },
  },
];

// 成就分类
export const ACHIEVEMENT_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏅' },
  { id: 'game', name: '闯关', icon: '🎮' },
  { id: 'score', name: '积分', icon: '💯' },
  { id: 'checkin', name: '签到', icon: '📅' },
  { id: 'level', name: '关卡', icon: '🎯' },
];

export default ACHIEVEMENTS;