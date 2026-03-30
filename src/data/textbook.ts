import { Question } from '../types';

// 教材词汇 - 简化版
const textbookQuestions: Question[] = [
  // 简单题目
  { id: 'tb-01', type: 'pinyin-to-char', content: 'lǎo shī', answer: '老师', level: 1, grade: '1-上册', unit: 1, char: '老' },
  { id: 'tb-02', type: 'pinyin-to-char', content: 'xué shēng', answer: '学生', level: 1, grade: '1-上册', unit: 1, char: '学' },
  { id: 'tb-03', type: 'char-to-pinyin', content: '老师', answer: 'lǎo shī', level: 1, grade: '1-上册', unit: 1, char: '老' },
];

export default textbookQuestions;
