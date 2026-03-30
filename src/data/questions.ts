import { Question } from '../types';

// 常用错字/成语题库 - 已清理无效题目
const questions: Question[] = [
  // 选字填空 - 成语（正确格式：题目在前，空白在后）
  { id: 'q1', type: 'fill-blank', content: '画蛇_____', answer: '添足', options: ['添足', '填足', '加足', '多足'], level: 1, char: '添' },
  { id: 'q2', type: 'fill-blank', content: '守株待_____', answer: '兔', options: ['兔', '猪', '鹿', '马'], level: 1, char: '兔' },
  { id: 'q3', type: 'fill-blank', content: '亡羊补_____', answer: '牢', options: ['牢', '圈', '门', '栅'], level: 1, char: '牢' },
  { id: 'q4', type: 'fill-blank', content: '掩耳盗_____', answer: '铃', options: ['铃', '钟', '鼓', '声'], level: 1, char: '铃' },
  { id: 'q5', type: 'fill-blank', content: '刻舟求_____', answer: '剑', options: ['剑', '刀', '舟', '水'], level: 1, char: '剑' },
  { id: 'q6', type: 'fill-blank', content: '滥竽充_____', answer: '数', options: ['数', '乐', '人', '曲'], level: 2, char: '数' },
  { id: 'q7', type: 'fill-blank', content: '买椟还_____', answer: '珠', options: ['珠', '玉', '宝', '钱'], level: 2, char: '珠' },
  { id: 'q8', type: 'fill-blank', content: '胸有成_____', answer: '胸有成竹', options: ['胸有成竹', '胸有成树', '胸有成木', '胸有成材'], level: 2, char: '竹' },
  { id: 'q9', type: 'fill-blank', content: '画龙点_____', answer: '睛', options: ['睛', '眼', '目', '珠'], level: 2, char: '睛' },
  { id: 'q10', type: 'fill-blank', content: '对牛弹_____', answer: '琴', options: ['琴', '曲', '乐', '歌'], level: 2, char: '琴' },
  // 选字填空 - 常见错别字
  { id: 'q11', type: 'fill-blank', content: '再接再_____', answer: '厉', options: ['厉', '励', '利', '力'], level: 3, char: '厉' },
  { id: 'q12', type: 'fill-blank', content: '川_____不息', answer: '流', options: ['流', '留', '游', '走'], level: 3, char: '流' },
  // 看拼音写汉字
  { id: 'q26', type: 'pinyin-to-char', content: 'míng tiān', answer: '明天', level: 1, char: '明' },
  { id: 'q27', type: 'pinyin-to-char', content: 'xué xí', answer: '学习', level: 1, char: '学' },
  { id: 'q28', type: 'pinyin-to-char', content: 'zhōng guó', answer: '中国', level: 1, char: '中' },
  { id: 'q29', type: 'pinyin-to-char', content: 'shuǐ guǒ', answer: '水果', level: 1, char: '水' },
  { id: 'q30', type: 'pinyin-to-char', content: 'cháng jiāng', answer: '长江', level: 2, char: '长' },
  // 看汉字写拼音
  { id: 'q36', type: 'char-to-pinyin', content: '中国', answer: 'zhōng guó', level: 1, char: '中' },
  { id: 'q37', type: 'char-to-pinyin', content: '学习', answer: 'xué xí', level: 1, char: '学' },
  { id: 'q38', type: 'char-to-pinyin', content: '朋友', answer: 'péng you', level: 1, char: '朋' },
  { id: 'q39', type: 'char-to-pinyin', content: '时间', answer: 'shí jiān', level: 2, char: '时' },
  { id: 'q40', type: 'char-to-pinyin', content: '学校', answer: 'xué xiào', level: 2, char: '校' },
];

export default questions;
