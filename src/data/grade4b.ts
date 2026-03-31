import { Question } from '../types';

// 部编版语文四年级下册 1-8单元完整题库
const grade4b: Question[] = [
  // ==================== 第一单元 ====================
  // 易错音 - 汉字写拼音
  { id: 'g4b-u1-py-01', type: 'char-to-pinyin', content: '杂兴', answer: 'zá xìng', level: 4, grade: '4-下册', unit: 1, char: '兴' },
  { id: 'g4b-u1-py-02', type: 'char-to-pinyin', content: '一径', answer: 'yī jìng', level: 4, grade: '4-下册', unit: 1, char: '径' },
  { id: 'g4b-u1-py-03', type: 'char-to-pinyin', content: '清平乐', answer: 'qīng píng yuè', level: 4, grade: '4-下册', unit: 1, char: '乐' },
  { id: 'g4b-u1-py-04', type: 'char-to-pinyin', content: '亡赖', answer: 'wú lài', level: 4, grade: '4-下册', unit: 1, char: '亡' },
  { id: 'g4b-u1-py-05', type: 'char-to-pinyin', content: '绮丽', answer: 'qǐ lì', level: 4, grade: '4-下册', unit: 1, char: '绮' },
  { id: 'g4b-u1-py-06', type: 'char-to-pinyin', content: '鸡冠', answer: 'jī guān', level: 4, grade: '4-下册', unit: 1, char: '冠' },
  { id: 'g4b-u1-py-07', type: 'char-to-pinyin', content: '应和', answer: 'yìng hè', level: 4, grade: '4-下册', unit: 1, char: '和' },
  { id: 'g4b-u1-py-08', type: 'char-to-pinyin', content: '纤细', answer: 'xiān xì', level: 4, grade: '4-下册', unit: 1, char: '纤' },
  { id: 'g4b-u1-py-09', type: 'char-to-pinyin', content: '绿草如茵', answer: 'lǜ cǎo rú yīn', level: 4, grade: '4-下册', unit: 1, char: '茵' },
  
  // 重点字词 - 拼音写汉字
  { id: 'g4b-u1-zc-01', type: 'pinyin-to-char', content: 'xī shū', answer: '稀疏', level: 4, grade: '4-下册', unit: 1, char: '疏' },
  { id: 'g4b-u1-zc-02', type: 'pinyin-to-char', content: 'lí ba', answer: '篱笆', level: 4, grade: '4-下册', unit: 1, char: '篱' },
  { id: 'g4b-u1-zc-03', type: 'pinyin-to-char', content: 'qīng tíng', answer: '蜻蜓', level: 4, grade: '4-下册', unit: 1, char: '蜻' },
  { id: 'g4b-u1-zc-04', type: 'pinyin-to-char', content: 'jiá dié', answer: '蛱蝶', level: 4, grade: '4-下册', unit: 1, char: '蝶' },
  { id: 'g4b-u1-zc-05', type: 'pinyin-to-char', content: 'máo yán', answer: '茅檐', level: 4, grade: '4-下册', unit: 1, char: '檐' },
  { id: 'g4b-u1-zc-06', type: 'pinyin-to-char', content: 'wēng ǎo', answer: '翁媪', level: 4, grade: '4-下册', unit: 1, char: '媪' },
  { id: 'g4b-u1-zc-07', type: 'pinyin-to-char', content: 'bō lián péng', answer: '剥莲蓬', level: 4, grade: '4-下册', unit: 1, char: '剥' },
  { id: 'g4b-u1-zc-08', type: 'pinyin-to-char', content: 'zhuāng shì', answer: '装饰', level: 4, grade: '4-下册', unit: 1, char: '饰' },
  { id: 'g4b-u1-zc-09', type: 'pinyin-to-char', content: 'shuài lǐng', answer: '率领', level: 4, grade: '4-下册', unit: 1, char: '率' },
  { id: 'g4b-u1-zc-10', type: 'pinyin-to-char', content: 'mì shí', answer: '觅食', level: 4, grade: '4-下册', unit: 1, char: '觅' },
  { id: 'g4b-u1-zc-11', type: 'pinyin-to-char', content: 'sǒng lì', answer: '耸立', level: 4, grade: '4-下册', unit: 1, char: '耸' },
  { id: 'g4b-u1-zc-12', type: 'pinyin-to-char', content: 'tǎng ruò', answer: '倘若', level: 4, grade: '4-下册', unit: 1, char: '倘' },
  { id: 'g4b-u1-zc-13', type: 'pinyin-to-char', content: 'hé xié', answer: '和谐', level: 4, grade: '4-下册', unit: 1, char: '谐' },
  { id: 'g4b-u1-zc-14', type: 'pinyin-to-char', content: 'wèi jiè', answer: '慰藉', level: 4, grade: '4-下册', unit: 1, char: '藉' },
  { id: 'g4b-u1-zc-15', type: 'pinyin-to-char', content: 'bǔ luò', answer: '卜落', level: 4, grade: '4-下册', unit: 1, char: '卜' },
  { id: 'g4b-u1-zc-16', type: 'pinyin-to-char', content: 'biān fú', answer: '蝙蝠', level: 4, grade: '4-下册', unit: 1, char: '蝠' },
  { id: 'g4b-u1-zc-17', type: 'pinyin-to-char', content: 'bà qì', answer: '霸气', level: 4, grade: '4-下册', unit: 1, char: '霸' },
  { id: 'g4b-u1-zc-18', type: 'pinyin-to-char', content: 'sǎo dàng', answer: '扫荡', level: 4, grade: '4-下册', unit: 1, char: '荡' },
  { id: 'g4b-u1-zc-19', type: 'pinyin-to-char', content: 'qí huàn', answer: '奇幻', level: 4, grade: '4-下册', unit: 1, char: '幻' },
  { id: 'g4b-u1-zc-20', type: 'pinyin-to-char', content: 'cuī mián qǔ', answer: '催眠曲', level: 4, grade: '4-下册', unit: 1, char: '催' },
  
  // 古诗填空
  { id: 'g4b-u1-gs-01', type: 'fill-blank', content: '梅子黄、杏子____、麦花白、菜花稀', answer: '肥', options: ['肥', '美', '大', '甜'], level: 4, grade: '4-下册', unit: 1, char: '肥' },
  { id: 'g4b-u1-gs-02', type: 'fill-blank', content: '惟有蜻蜓_____', answer: '蛱蝶', options: ['蛱蝶', '蝴蝶', '飞舞', '起舞'], level: 4, grade: '4-下册', unit: 1, char: '蝶' },
  { id: 'g4b-u1-gs-03', type: 'fill-blank', content: '儿童急走追黄蝶，飞入菜花_____寻', answer: '无处', options: ['无处', '难觅', '不见', '哪里'], level: 4, grade: '4-下册', unit: 1, char: '处' },
  { id: 'g4b-u1-gs-04', type: 'fill-blank', content: '最喜小儿亡赖，溪头_____莲蓬', answer: '卧剥', options: ['卧剥', '坐吃', '采摘', '拿着'], level: 4, grade: '4-下册', unit: 1, char: '剥' },
  { id: 'g4b-u1-gs-05', type: 'fill-blank', content: '待到山花烂漫时，她在丛中_____', answer: '笑', options: ['笑', '开', '舞', '立'], level: 4, grade: '4-下册', unit: 1, char: '笑' },
  { id: 'g4b-u1-gs-06', type: 'fill-blank', content: '俏也不争春，只把春来_____', answer: '报', options: ['报', '迎', '盼', '等'], level: 4, grade: '4-下册', unit: 1, char: '报' },

  // ==================== 第二单元 ====================
  // 易错音
  { id: 'g4b-u2-py-01', type: 'char-to-pinyin', content: '松脂', answer: 'sōng zhī', level: 4, grade: '4-下册', unit: 2, char: '脂' },
  { id: 'g4b-u2-py-02', type: 'char-to-pinyin', content: '隐形', answer: 'yǐn xíng', level: 4, grade: '4-下册', unit: 2, char: '隐' },
  { id: 'g4b-u2-py-03', type: 'char-to-pinyin', content: '尽管', answer: 'jǐn guǎn', level: 4, grade: '4-下册', unit: 2, char: '尽' },
  { id: 'g4b-u2-py-04', type: 'char-to-pinyin', content: '树栖', answer: 'shù qī', level: 4, grade: '4-下册', unit: 2, char: '栖' },
  { id: 'g4b-u2-py-05', type: 'char-to-pinyin', content: '渗透', answer: 'shèn tòu', level: 4, grade: '4-下册', unit: 2, char: '渗' },
  { id: 'g4b-u2-py-06', type: 'char-to-pinyin', content: '后裔', answer: 'hòu yì', level: 4, grade: '4-下册', unit: 2, char: '裔' },
  { id: 'g4b-u2-py-07', type: 'char-to-pinyin', content: '乒乓球', answer: 'pīng pāng qiú', level: 4, grade: '4-下册', unit: 2, char: '乒' },
  { id: 'g4b-u2-py-08', type: 'char-to-pinyin', content: '嗡嗡', answer: 'wēng wēng', level: 4, grade: '4-下册', unit: 2, char: '嗡' },
  { id: 'g4b-u2-py-09', type: 'char-to-pinyin', content: '澎湃', answer: 'péng pài', level: 4, grade: '4-下册', unit: 2, char: '湃' },
  { id: 'g4b-u2-py-10', type: 'char-to-pinyin', content: '病症', answer: 'bìng zhèng', level: 4, grade: '4-下册', unit: 2, char: '症' },
  { id: 'g4b-u2-py-11', type: 'char-to-pinyin', content: '载重', answer: 'zài zhòng', level: 4, grade: '4-下册', unit: 2, char: '载' },
  
  // 重点字词
  { id: 'g4b-u2-zc-01', type: 'pinyin-to-char', content: 'nù hǒu', answer: '怒吼', level: 4, grade: '4-下册', unit: 2, char: '怒' },
  { id: 'g4b-u2-zc-02', type: 'pinyin-to-char', content: 'sōng zhī', answer: '松脂', level: 4, grade: '4-下册', unit: 2, char: '脂' },
  { id: 'g4b-u2-zc-03', type: 'pinyin-to-char', content: 'fú shì', answer: '拂拭', level: 4, grade: '4-下册', unit: 2, char: '拭' },
  { id: 'g4b-u2-zc-04', type: 'pinyin-to-char', content: 'shèn tòu', answer: '渗透', level: 4, grade: '4-下册', unit: 2, char: '渗' },
  { id: 'g4b-u2-zc-05', type: 'pinyin-to-char', content: 'zhēng zhá', answer: '挣扎', level: 4, grade: '4-下册', unit: 2, char: '挣' },
  { id: 'g4b-u2-zc-06', type: 'pinyin-to-char', content: 'hǔ pò', answer: '琥珀', level: 4, grade: '4-下册', unit: 2, char: '珀' },
  { id: 'g4b-u2-zc-07', type: 'pinyin-to-char', content: 'tuī cè', answer: '推测', level: 4, grade: '4-下册', unit: 2, char: '测' },
  { id: 'g4b-u2-zc-08', type: 'pinyin-to-char', content: 'bèn zhòng', answer: '笨重', level: 4, grade: '4-下册', unit: 2, char: '笨' },
  { id: 'g4b-u2-zc-09', type: 'pinyin-to-char', content: 'chí dùn', answer: '迟钝', level: 4, grade: '4-下册', unit: 2, char: '钝' },
  { id: 'g4b-u2-zc-10', type: 'pinyin-to-char', content: 'gē zi', answer: '鸽子', level: 4, grade: '4-下册', unit: 2, char: '鸽' },
  { id: 'g4b-u2-zc-11', type: 'pinyin-to-char', content: 'suì dào', answer: '隧道', level: 4, grade: '4-下册', unit: 2, char: '隧' },
  { id: 'g4b-u2-zc-12', type: 'pinyin-to-char', content: 'niǎo yì', answer: '鸟翼', level: 4, grade: '4-下册', unit: 2, char: '翼' },
  { id: 'g4b-u2-zc-13', type: 'pinyin-to-char', content: 'qián zhī', answer: '前肢', level: 4, grade: '4-下册', unit: 2, char: '肢' },
  { id: 'g4b-u2-zc-14', type: 'pinyin-to-char', content: 'yǐn xíng', answer: '隐形', level: 4, grade: '4-下册', unit: 2, char: '隐' },
  { id: 'g4b-u2-zc-15', type: 'pinyin-to-char', content: 'xì bāo', answer: '细胞', level: 4, grade: '4-下册', unit: 2, char: '胞' },
  { id: 'g4b-u2-zc-16', type: 'pinyin-to-char', content: 'yù fáng', answer: '预防', level: 4, grade: '4-下册', unit: 2, char: '预' },
  { id: 'g4b-u2-zc-17', type: 'pinyin-to-char', content: 'bìng zào', answer: '病灶', level: 4, grade: '4-下册', unit: 2, char: '灶' },
  { id: 'g4b-u2-zc-18', type: 'pinyin-to-char', content: 'jù bèi', answer: '具备', level: 4, grade: '4-下册', unit: 2, char: '具' },
  { id: 'g4b-u2-zc-19', type: 'pinyin-to-char', content: 'cái liào', answer: '材料', level: 4, grade: '4-下册', unit: 2, char: '材' },
  { id: 'g4b-u2-zc-20', type: 'pinyin-to-char', content: 'shēn kè', answer: '深刻', level: 4, grade: '4-下册', unit: 2, char: '深' },
  
  // 成语填空
  { id: 'g4b-u2-cy-01', type: 'fill-blank', content: '前_____后仰', answer: '俯', options: ['俯', '仰', '倾', '弯'], level: 4, grade: '4-下册', unit: 2, char: '俯' },
  { id: 'g4b-u2-cy-02', type: 'fill-blank', content: '五彩_____斓', answer: '斑', options: ['斑', '斑', '灿', '绚'], level: 4, grade: '4-下册', unit: 2, char: '斑' },
  { id: 'g4b-u2-cy-03', type: 'fill-blank', content: '茹_____饮血', answer: '毛', options: ['毛', '血', '肉', '食'], level: 4, grade: '4-下册', unit: 2, char: '茹' },
  { id: 'g4b-u2-cy-04', type: 'fill-blank', content: '形态各_____', answer: '异', options: ['异', '别', '样', '型'], level: 4, grade: '4-下册', unit: 2, char: '异' },
  { id: 'g4b-u2-cy-05', type: 'fill-blank', content: '毫不_____干', answer: '相', options: ['相', '有', '关', '连'], level: 4, grade: '4-下册', unit: 2, char: '相' },
  { id: 'g4b-u2-cy-06', type: 'fill-blank', content: '无能为_____', answer: '力', options: ['力', '助', '法', '办'], level: 4, grade: '4-下册', unit: 2, char: '力' },
  
  // 古诗
  { id: 'g4b-u2-gs-01', type: 'fill-blank', content: '桃花一簇开无主，可爱深红爱_____红', answer: '浅', options: ['浅', '淡', '粉', '紫'], level: 4, grade: '4-下册', unit: 2, char: '浅' },

  // ==================== 第三单元 ====================
  // 易错音
  { id: 'g4b-u3-py-01', type: 'char-to-pinyin', content: '涂抹', answer: 'tú mǒ', level: 4, grade: '4-下册', unit: 3, char: '抹' },
  { id: 'g4b-u3-py-02', type: 'char-to-pinyin', content: '绽透', answer: 'zhàn tòu', level: 4, grade: '4-下册', unit: 3, char: '绽' },
  { id: 'g4b-u3-py-03', type: 'char-to-pinyin', content: '白桦', answer: 'bái huà', level: 4, grade: '4-下册', unit: 3, char: '桦' },
  { id: 'g4b-u3-py-04', type: 'char-to-pinyin', content: '藤萝', answer: 'téng luó', level: 4, grade: '4-下册', unit: 3, char: '藤' },
  { id: 'g4b-u3-py-05', type: 'char-to-pinyin', content: '胆怯', answer: 'dǎn qiè', level: 4, grade: '4-下册', unit: 3, char: '怯' },
  { id: 'g4b-u3-py-06', type: 'char-to-pinyin', content: '曝光', answer: 'pù guāng', level: 4, grade: '4-下册', unit: 3, char: '曝' },
  { id: 'g4b-u3-py-07', type: 'char-to-pinyin', content: '徜徉', answer: 'cháng yáng', level: 4, grade: '4-下册', unit: 3, char: '徜' },
  
  // 重点字词
  { id: 'g4b-u3-zc-01', type: 'pinyin-to-char', content: 'fán xīng', answer: '繁星', level: 4, grade: '4-下册', unit: 3, char: '繁' },
  { id: 'g4b-u3-zc-02', type: 'pinyin-to-char', content: 'màn miè', answer: '漫灭', level: 4, grade: '4-下册', unit: 3, char: '漫' },
  { id: 'g4b-u3-zc-03', type: 'pinyin-to-char', content: 'téng luó', answer: '藤萝', level: 4, grade: '4-下册', unit: 3, char: '藤' },
  { id: 'g4b-u3-zc-04', type: 'pinyin-to-char', content: 'bái huà', answer: '白桦', level: 4, grade: '4-下册', unit: 3, char: '桦' },
  { id: 'g4b-u3-zc-05', type: 'pinyin-to-char', content: 'tú mǒ', answer: '涂抹', level: 4, grade: '4-下册', unit: 3, char: '涂' },
  { id: 'g4b-u3-zc-06', type: 'pinyin-to-char', content: 'xiù huā', answer: '绣花', level: 4, grade: '4-下册', unit: 3, char: '绣' },
  { id: 'g4b-u3-zc-07', type: 'pinyin-to-char', content: 'xiāo sǎ', answer: '潇洒', level: 4, grade: '4-下册', unit: 3, char: '潇' },
  { id: 'g4b-u3-zc-08', type: 'pinyin-to-char', content: 'huā suì', answer: '花穗', level: 4, grade: '4-下册', unit: 3, char: '穗' },
  { id: 'g4b-u3-zc-09', type: 'pinyin-to-char', content: 'méng lóng', answer: '朦胧', level: 4, grade: '4-下册', unit: 3, char: '朦' },
  { id: 'g4b-u3-zc-10', type: 'pinyin-to-char', content: 'máo róng róng', answer: '毛茸茸', level: 4, grade: '4-下册', unit: 3, char: '茸' },
  { id: 'g4b-u3-zc-11', type: 'pinyin-to-char', content: 'cháng yáng', answer: '徜徉', level: 4, grade: '4-下册', unit: 3, char: '徉' },
  { id: 'g4b-u3-zc-12', type: 'pinyin-to-char', content: 'nèn lǜ', answer: '嫩绿', level: 4, grade: '4-下册', unit: 3, char: '嫩' },
  
  // 成语
  { id: 'g4b-u3-cy-01', type: 'fill-blank', content: '姗姗来_____', answer: '迟', options: ['迟', '晚', '慢', '后'], level: 4, grade: '4-下册', unit: 3, char: '迟' },
  { id: 'g4b-u3-cy-02', type: 'fill-blank', content: '白雪_____皑', answer: '皑', options: ['皑', '白', '茫', '洁'], level: 4, grade: '4-下册', unit: 3, char: '皑' },
  
  // 文学常识
  { id: 'g4b-u3-wx-01', type: 'fill-blank', content: '冰心原名谢_____莹', answer: '婉', options: ['婉', '文', '雅', '淑'], level: 4, grade: '4-下册', unit: 3, char: '婉' },
  { id: 'g4b-u3-wx-02', type: 'fill-blank', content: '冰心的诗集是《繁星》和《_____》', answer: '春水', options: ['春水', '秋水', '冬雪', '夏花'], level: 4, grade: '4-下册', unit: 3, char: '春' },

  // ==================== 第四单元 ====================
  // 易错音
  { id: 'g4b-u4-py-01', type: 'char-to-pinyin', content: '磨蹭', answer: 'mó cèng', level: 4, grade: '4-下册', unit: 4, char: '蹭' },
  { id: 'g4b-u4-py-02', type: 'char-to-pinyin', content: '腔调', answer: 'qiāng diào', level: 4, grade: '4-下册', unit: 4, char: '腔' },
  { id: 'g4b-u4-py-03', type: 'char-to-pinyin', content: '疙瘩', answer: 'gē da', level: 4, grade: '4-下册', unit: 4, char: '疙' },
  { id: 'g4b-u4-py-04', type: 'char-to-pinyin', content: '屏息凝视', answer: 'bǐng xī níng shì', level: 4, grade: '4-下册', unit: 4, char: '屏' },
  { id: 'g4b-u4-py-05', type: 'char-to-pinyin', content: '窥伺', answer: 'kuī sì', level: 4, grade: '4-下册', unit: 4, char: '伺' },
  { id: 'g4b-u4-py-06', type: 'char-to-pinyin', content: '枝折花落', answer: 'zhé shé huā luò', level: 4, grade: '4-下册', unit: 4, char: '折' },
  { id: 'g4b-u4-py-07', type: 'char-to-pinyin', content: '奢侈', answer: 'shē chǐ', level: 4, grade: '4-下册', unit: 4, char: '侈' },
  { id: 'g4b-u4-py-08', type: 'char-to-pinyin', content: '供养', answer: 'gōng yǎng', level: 4, grade: '4-下册', unit: 4, char: '供' },
  
  // 重点字词
  { id: 'g4b-u4-zc-01', type: 'pinyin-to-char', content: 'yōu lǜ', answer: '忧虑', level: 4, grade: '4-下册', unit: 4, char: '虑' },
  { id: 'g4b-u4-zc-02', type: 'pinyin-to-char', content: 'tān wán', answer: '贪玩', level: 4, grade: '4-下册', unit: 4, char: '贪' },
  { id: 'g4b-u4-zc-03', type: 'pinyin-to-char', content: 'jìn zhí', answer: '尽职', level: 4, grade: '4-下册', unit: 4, char: '职' },
  { id: 'g4b-u4-zc-04', type: 'pinyin-to-char', content: 'gǎo zhǐ', answer: '稿纸', level: 4, grade: '4-下册', unit: 4, char: '稿' },
  { id: 'g4b-u4-zc-05', type: 'pinyin-to-char', content: 'jiě mèn', answer: '解闷', level: 4, grade: '4-下册', unit: 4, char: '闷' },
  { id: 'g4b-u4-zc-06', type: 'pinyin-to-char', content: 'zāo yāng', answer: '遭殃', level: 4, grade: '4-下册', unit: 4, char: '殃' },
  { id: 'g4b-u4-zc-07', type: 'pinyin-to-char', content: 'tǎo yàn', answer: '讨厌', level: 4, grade: '4-下册', unit: 4, char: '厌' },
  { id: 'g4b-u4-zc-08', type: 'pinyin-to-char', content: 'fǎn kàng', answer: '反抗', level: 4, grade: '4-下册', unit: 4, char: '抗' },
  { id: 'g4b-u4-zc-09', type: 'pinyin-to-char', content: 'zhōng hòu', answer: '忠厚', level: 4, grade: '4-下册', unit: 4, char: '忠' },
  { id: 'g4b-u4-zc-10', type: 'pinyin-to-char', content: 'jǐng jiè', answer: '警戒', level: 4, grade: '4-下册', unit: 4, char: '戒' },
  { id: 'g4b-u4-zc-11', type: 'pinyin-to-char', content: 'fū huà', answer: '孵化', level: 4, grade: '4-下册', unit: 4, char: '孵' },
  { id: 'g4b-u4-zc-12', type: 'pinyin-to-char', content: 'jué dì', answer: '掘地', level: 4, grade: '4-下册', unit: 4, char: '掘' },
  { id: 'g4b-u4-zc-13', type: 'pinyin-to-char', content: 'kuáng fèi', answer: '狂吠', level: 4, grade: '4-下册', unit: 4, char: '吠' },
  { id: 'g4b-u4-zc-14', type: 'pinyin-to-char', content: 'jīng jù', answer: '京剧', level: 4, grade: '4-下册', unit: 4, char: '剧' },
  { id: 'g4b-u4-zc-15', type: 'pinyin-to-char', content: 'pì rú', answer: '譬如', level: 4, grade: '4-下册', unit: 4, char: '譬' },
  { id: 'g4b-u4-zc-16', type: 'pinyin-to-char', content: 'shì hòu', answer: '侍候', level: 4, grade: '4-下册', unit: 4, char: '侍' },
  { id: 'g4b-u4-zc-17', type: 'pinyin-to-char', content: 'pí qi', answer: '脾气', level: 4, grade: '4-下册', unit: 4, char: '脾' },
  { id: 'g4b-u4-zc-18', type: 'pinyin-to-char', content: 'mǐn jié', answer: '敏捷', level: 4, grade: '4-下册', unit: 4, char: '敏' },
  { id: 'g4b-u4-zc-19', type: 'pinyin-to-char', content: 'gāo ào', answer: '高傲', level: 4, grade: '4-下册', unit: 4, char: '傲' },
  { id: 'g4b-u4-zc-20', type: 'pinyin-to-char', content: 'kōng kōng rú yě', answer: '空空如也', level: 4, grade: '4-下册', unit: 4, char: '空' },
  
  // 成语填空
  { id: 'g4b-u4-cy-01', type: 'fill-blank', content: '变化多_____', answer: '端', options: ['端', '样', '变', '彩'], level: 4, grade: '4-下册', unit: 4, char: '端' },
  { id: 'g4b-u4-cy-02', type: 'fill-blank', content: '如_____如诉', answer: '怨', options: ['怨', '悲', '泣', '歌'], level: 4, grade: '4-下册', unit: 4, char: '怨' },
  { id: 'g4b-u4-cy-03', type: 'fill-blank', content: '不胜其_____', answer: '烦', options: ['烦', '厌', '恼', '怒'], level: 4, grade: '4-下册', unit: 4, char: '烦' },
  { id: 'g4b-u4-cy-04', type: 'fill-blank', content: '左_____右盼', answer: '顾', options: ['顾', '看', '望', '观'], level: 4, grade: '4-下册', unit: 4, char: '顾' },
  { id: 'g4b-u4-cy-05', type: 'fill-blank', content: '一丝不_____', answer: '苟', options: ['苟', '苟', '乱', '差'], level: 4, grade: '4-下册', unit: 4, char: '苟' },
  { id: 'g4b-u4-cy-06', type: 'fill-blank', content: '屏_____凝视', answer: '息', options: ['息', '气', '神', '心'], level: 4, grade: '4-下册', unit: 4, char: '息' },
  { id: 'g4b-u4-cy-07', type: 'fill-blank', content: '局_____不安', answer: '促', options: ['促', '紧', '张', '急'], level: 4, grade: '4-下册', unit: 4, char: '促' },
  { id: 'g4b-u4-cy-08', type: 'fill-blank', content: '生气_____', answer: '勃勃', options: ['勃勃', '盎然', '十足', '旺盛'], level: 4, grade: '4-下册', unit: 4, char: '勃' },
  
  // 古诗
  { id: 'g4b-u4-gs-01', type: 'fill-blank', content: '采得百花成蜜后，为谁辛苦为谁_____', answer: '甜', options: ['甜', '忙', '劳', '香'], level: 4, grade: '4-下册', unit: 4, char: '甜' },
  
  // 文学常识
  { id: 'g4b-u4-wx-01', type: 'fill-blank', content: '《猫》的作者是老_____', answer: '舍', options: ['舍', '巴', '冰', '叶'], level: 4, grade: '4-下册', unit: 4, char: '舍' },
  { id: 'g4b-u4-wx-02', type: 'fill-blank', content: '《白鹅》的作者是丰子_____', answer: '恺', options: ['恺', '凯', '楷', '谐'], level: 4, grade: '4-下册', unit: 4, char: '恺' },

  // ==================== 第五单元 ====================
  // 易错音
  { id: 'g4b-u5-py-01', type: 'char-to-pinyin', content: '负荷', answer: 'fù hè', level: 4, grade: '4-下册', unit: 5, char: '荷' },
  { id: 'g4b-u5-py-02', type: 'char-to-pinyin', content: '刹那间', answer: 'chà nà jiān', level: 4, grade: '4-下册', unit: 5, char: '刹' },
  { id: 'g4b-u5-py-03', type: 'char-to-pinyin', content: '一簇', answer: 'yī cù', level: 4, grade: '4-下册', unit: 5, char: '簇' },
  { id: 'g4b-u5-py-04', type: 'char-to-pinyin', content: '臀部', answer: 'tún bù', level: 4, grade: '4-下册', unit: 5, char: '臀' },
  
  // 重点字词
  { id: 'g4b-u5-zc-01', type: 'pinyin-to-char', content: 'kuò dà', answer: '扩大', level: 4, grade: '4-下册', unit: 5, char: '扩' },
  { id: 'g4b-u5-zc-02', type: 'pinyin-to-char', content: 'fàn wéi', answer: '范围', level: 4, grade: '4-下册', unit: 5, char: '范' },
  { id: 'g4b-u5-zc-03', type: 'pinyin-to-char', content: 'nǔ lì', answer: '努力', level: 4, grade: '4-下册', unit: 5, char: '努' },
  { id: 'g4b-u5-zc-04', type: 'pinyin-to-char', content: 'càn làn', answer: '灿烂', level: 4, grade: '4-下册', unit: 5, char: '灿' },
  { id: 'g4b-u5-zc-05', type: 'pinyin-to-char', content: 'dài tì', answer: '代替', level: 4, grade: '4-下册', unit: 5, char: '替' },
  { id: 'g4b-u5-zc-06', type: 'pinyin-to-char', content: 'xiāng qiàn', answer: '镶嵌', level: 4, grade: '4-下册', unit: 5, char: '镶' },
  { id: 'g4b-u5-zc-07', type: 'pinyin-to-char', content: 'zǐ sè', answer: '紫色', level: 4, grade: '4-下册', unit: 5, char: '紫' },
  { id: 'g4b-u5-zc-08', type: 'pinyin-to-char', content: 'zhè jiāng', answer: '浙江', level: 4, grade: '4-下册', unit: 5, char: '浙' },
  { id: 'g4b-u5-zc-09', type: 'pinyin-to-char', content: 'dù juān', answer: '杜鹃', level: 4, grade: '4-下册', unit: 5, char: '鹃' },
  { id: 'g4b-u5-zc-10', type: 'pinyin-to-char', content: 'kuān zhǎi', answer: '宽窄', level: 4, grade: '4-下册', unit: 5, char: '窄' },
  { id: 'g4b-u5-zc-11', type: 'pinyin-to-char', content: 'tún bù', answer: '臀部', level: 4, grade: '4-下册', unit: 5, char: '臀' },
  { id: 'g4b-u5-zc-12', type: 'pinyin-to-char', content: 'é jiǎo', answer: '额角', level: 4, grade: '4-下册', unit: 5, char: '额' },
  { id: 'g4b-u5-zc-13', type: 'pinyin-to-char', content: 'dēng lù', answer: '登陆', level: 4, grade: '4-下册', unit: 5, char: '陆' },
  { id: 'g4b-u5-zc-14', type: 'pinyin-to-char', content: 'shí sǔn', answer: '石笋', level: 4, grade: '4-下册', unit: 5, char: '笋' },
  { id: 'g4b-u5-zc-15', type: 'pinyin-to-char', content: 'yuán quán', answer: '源泉', level: 4, grade: '4-下册', unit: 5, char: '源' },
  
  // 成语
  { id: 'g4b-u5-cy-01', type: 'fill-blank', content: '突兀森_____', answer: '郁', options: ['郁', '密', '深', '绿'], level: 4, grade: '4-下册', unit: 5, char: '郁' },
  { id: 'g4b-u5-cy-02', type: 'fill-blank', content: '变化多_____', answer: '端', options: ['端', '样', '彩', '形'], level: 4, grade: '4-下册', unit: 5, char: '端' },
  { id: 'g4b-u5-cy-03', type: 'fill-blank', content: '颜色各_____', answer: '异', options: ['异', '别', '样', '彩'], level: 4, grade: '4-下册', unit: 5, char: '异' },
  
  // 文学常识
  { id: 'g4b-u5-wx-01', type: 'fill-blank', content: '《海上日出》的作者是_____金', answer: '巴', options: ['巴', '老', '冰', '叶'], level: 4, grade: '4-下册', unit: 5, char: '巴' },
  { id: 'g4b-u5-wx-02', type: 'fill-blank', content: '《记金华的双龙洞》的作者是叶圣_____', answer: '陶', options: ['陶', '淘', '涛', '桃'], level: 4, grade: '4-下册', unit: 5, char: '陶' },

  // ==================== 第六单元 ====================
  // 易错音
  { id: 'g4b-u6-py-01', type: 'char-to-pinyin', content: '漩涡', answer: 'xuán wō', level: 4, grade: '4-下册', unit: 6, char: '漩' },
  { id: 'g4b-u6-py-02', type: 'char-to-pinyin', content: '倔强', answer: 'jué jiàng', level: 4, grade: '4-下册', unit: 6, char: '倔' },
  { id: 'g4b-u6-py-03', type: 'char-to-pinyin', content: '火炕', answer: 'huǒ kàng', level: 4, grade: '4-下册', unit: 6, char: '炕' },
  { id: 'g4b-u6-py-04', type: 'char-to-pinyin', content: '吃荤', answer: 'chī hūn', level: 4, grade: '4-下册', unit: 6, char: '荤' },
  { id: 'g4b-u6-py-05', type: 'char-to-pinyin', content: '攥着钱', answer: 'zuàn zhe qián', level: 4, grade: '4-下册', unit: 6, char: '攥' },
  { id: 'g4b-u6-py-06', type: 'char-to-pinyin', content: '风靡', answer: 'fēng mǐ', level: 4, grade: '4-下册', unit: 6, char: '靡' },
  { id: 'g4b-u6-py-07', type: 'char-to-pinyin', content: '蹿进', answer: 'cuān jìn', level: 4, grade: '4-下册', unit: 6, char: '蹿' },
  { id: 'g4b-u6-py-08', type: 'char-to-pinyin', content: '捋袖子', answer: 'luō xiù zi', level: 4, grade: '4-下册', unit: 6, char: '捋' },
  { id: 'g4b-u6-py-09', type: 'char-to-pinyin', content: '雪屑', answer: 'xuě xiè', level: 4, grade: '4-下册', unit: 6, char: '屑' },
  { id: 'g4b-u6-py-10', type: 'char-to-pinyin', content: '祈求', answer: 'qí qiú', level: 4, grade: '4-下册', unit: 6, char: '祈' },
  
  // 重点字词
  { id: 'g4b-u6-zc-01', type: 'pinyin-to-char', content: 'chē yǐn', answer: '车胤', level: 4, grade: '4-下册', unit: 6, char: '胤' },
  { id: 'g4b-u6-zc-02', type: 'pinyin-to-char', content: 'gōng jìng', answer: '恭敬', level: 4, grade: '4-下册', unit: 6, char: '恭' },
  { id: 'g4b-u6-zc-03', type: 'pinyin-to-char', content: 'qín fèn', answer: '勤奋', level: 4, grade: '4-下册', unit: 6, char: '奋' },
  { id: 'g4b-u6-zc-04', type: 'pinyin-to-char', content: 'pín kùn', answer: '贫困', level: 4, grade: '4-下册', unit: 6, char: '贫' },
  { id: 'g4b-u6-zc-05', type: 'pinyin-to-char', content: 'lú huā xié', answer: '芦花鞋', level: 4, grade: '4-下册', unit: 6, char: '芦' },
  { id: 'g4b-u6-zc-06', type: 'pinyin-to-char', content: 'kàng yán', answer: '炕沿', level: 4, grade: '4-下册', unit: 6, char: '炕' },
  { id: 'g4b-u6-zc-07', type: 'pinyin-to-char', content: 'qiāng shuān', answer: '枪栓', level: 4, grade: '4-下册', unit: 6, char: '栓' },
  { id: 'g4b-u6-zc-08', type: 'pinyin-to-char', content: 'jié nàn', answer: '劫难', level: 4, grade: '4-下册', unit: 6, char: '劫' },
  { id: 'g4b-u6-zc-09', type: 'pinyin-to-char', content: 'jìn cháo', answer: '晋朝', level: 4, grade: '4-下册', unit: 6, char: '晋' },
  { id: 'g4b-u6-zc-10', type: 'pinyin-to-char', content: 'dí rén', answer: '敌人', level: 4, grade: '4-下册', unit: 6, char: '敌' },
  { id: 'g4b-u6-zc-11', type: 'pinyin-to-char', content: 'shī shǒu', answer: '尸首', level: 4, grade: '4-下册', unit: 6, char: '尸' },
  { id: 'g4b-u6-zc-12', type: 'pinyin-to-char', content: 'zhǔ fù', answer: '嘱咐', level: 4, grade: '4-下册', unit: 6, char: '嘱' },
  { id: 'g4b-u6-zc-13', type: 'pinyin-to-char', content: 'jǔ sàng', answer: '沮丧', level: 4, grade: '4-下册', unit: 6, char: '沮' },
  { id: 'g4b-u6-zc-14', type: 'pinyin-to-char', content: 'liáo cǎo', answer: '潦草', level: 4, grade: '4-下册', unit: 6, char: '潦' },
  { id: 'g4b-u6-zc-15', type: 'pinyin-to-char', content: 'fáng ài', answer: '妨碍', level: 4, grade: '4-下册', unit: 6, char: '妨' },
  { id: 'g4b-u6-zc-16', type: 'pinyin-to-char', content: 'jué jiàng', answer: '倔强', level: 4, grade: '4-下册', unit: 6, char: '倔' },
  { id: 'g4b-u6-zc-17', type: 'pinyin-to-char', content: 'zhǎng jià', answer: '涨价', level: 4, grade: '4-下册', unit: 6, char: '涨' },
  { id: 'g4b-u6-zc-18', type: 'pinyin-to-char', content: 'cuō shéng', answer: '搓绳', level: 4, grade: '4-下册', unit: 6, char: '搓' },
  { id: 'g4b-u6-zc-19', type: 'pinyin-to-char', content: 'kuí huā', answer: '葵花', level: 4, grade: '4-下册', unit: 6, char: '葵' },
  { id: 'g4b-u6-zc-20', type: 'pinyin-to-char', content: 'yí hàn', answer: '遗憾', level: 4, grade: '4-下册', unit: 6, char: '憾' },
  { id: 'g4b-u6-zc-21', type: 'pinyin-to-char', content: 'qí qiú', answer: '祈求', level: 4, grade: '4-下册', unit: 6, char: '祈' },
  
  // 成语
  { id: 'g4b-u6-cy-01', type: 'fill-blank', content: '囊_____夜读', answer: '萤', options: ['萤', '灯', '烛', '光'], level: 4, grade: '4-下册', unit: 6, char: '萤' },
  { id: 'g4b-u6-cy-02', type: 'fill-blank', content: '铁_____成针', answer: '杵', options: ['杵', '棒', '棍', '杆'], level: 4, grade: '4-下册', unit: 6, char: '杵' },
  { id: 'g4b-u6-cy-03', type: 'fill-blank', content: '悬_____刺股', answer: '梁', options: ['梁', '头', '发', '绳'], level: 4, grade: '4-下册', unit: 6, char: '梁' },
  { id: 'g4b-u6-cy-04', type: 'fill-blank', content: '凿_____偷光', answer: '壁', options: ['壁', '墙', '洞', '孔'], level: 4, grade: '4-下册', unit: 6, char: '壁' },
  { id: 'g4b-u6-cy-05', type: 'fill-blank', content: '风靡全_____', answer: '国', options: ['国', '世', '地', '城'], level: 4, grade: '4-下册', unit: 6, char: '国' },
  { id: 'g4b-u6-cy-06', type: 'fill-blank', content: '一声不_____', answer: '吭', options: ['吭', '响', '言', '语'], level: 4, grade: '4-下册', unit: 6, char: '吭' },
  { id: 'g4b-u6-cy-07', type: 'fill-blank', content: '夜以_____日', answer: '继', options: ['继', '连', '接', '续'], level: 4, grade: '4-下册', unit: 6, char: '继' },
  { id: 'g4b-u6-cy-08', type: 'fill-blank', content: '不约而_____', answer: '同', options: ['同', '聚', '会', '合'], level: 4, grade: '4-下册', unit: 6, char: '同' },
  
  // 古诗
  { id: 'g4b-u6-gs-01', type: 'fill-blank', content: '相看两不厌，只有_____山', answer: '敬亭', options: ['敬亭', '黄山', '泰山', '庐山'], level: 4, grade: '4-下册', unit: 6, char: '亭' },

  // ==================== 第七单元 ====================
  // 易错音
  { id: 'g4b-u7-py-01', type: 'char-to-pinyin', content: '单于', answer: 'chán yú', level: 4, grade: '4-下册', unit: 7, char: '单' },
  { id: 'g4b-u7-py-02', type: 'char-to-pinyin', content: '剖开', answer: 'pōu kāi', level: 4, grade: '4-下册', unit: 7, char: '剖' },
  { id: 'g4b-u7-py-03', type: 'char-to-pinyin', content: '岗位', answer: 'gǎng wèi', level: 4, grade: '4-下册', unit: 7, char: '岗' },
  { id: 'g4b-u7-py-04', type: 'char-to-pinyin', content: '蓦地', answer: 'mò dì', level: 4, grade: '4-下册', unit: 7, char: '蓦' },
  { id: 'g4b-u7-py-05', type: 'char-to-pinyin', content: '混乱', answer: 'hùn luàn', level: 4, grade: '4-下册', unit: 7, char: '混' },
  { id: 'g4b-u7-py-06', type: 'char-to-pinyin', content: '湍急', answer: 'tuān jí', level: 4, grade: '4-下册', unit: 7, char: '湍' },
  { id: 'g4b-u7-py-07', type: 'char-to-pinyin', content: '晕倒', answer: 'yūn dǎo', level: 4, grade: '4-下册', unit: 7, char: '晕' },
  { id: 'g4b-u7-py-08', type: 'char-to-pinyin', content: '战役', answer: 'zhàn yì', level: 4, grade: '4-下册', unit: 7, char: '役' },
  { id: 'g4b-u7-py-09', type: 'char-to-pinyin', content: '蕴藏', answer: 'yùn cáng', level: 4, grade: '4-下册', unit: 7, char: '蕴' },
  { id: 'g4b-u7-py-10', type: 'char-to-pinyin', content: '沉甸甸', answer: 'chén diàn diàn', level: 4, grade: '4-下册', unit: 7, char: '甸' },
  
  // 重点字词
  { id: 'g4b-u7-zc-01', type: 'pinyin-to-char', content: 'fú róng', answer: '芙蓉', level: 4, grade: '4-下册', unit: 7, char: '蓉' },
  { id: 'g4b-u7-zc-02', type: 'pinyin-to-char', content: 'luò yáng', answer: '洛阳', level: 4, grade: '4-下册', unit: 7, char: '洛' },
  { id: 'g4b-u7-zc-03', type: 'pinyin-to-char', content: 'yàn tái', answer: '砚台', level: 4, grade: '4-下册', unit: 7, char: '砚' },
  { id: 'g4b-u7-zc-04', type: 'pinyin-to-char', content: 'qián kūn', answer: '乾坤', level: 4, grade: '4-下册', unit: 7, char: '坤' },
  { id: 'g4b-u7-zc-05', type: 'pinyin-to-char', content: 'pōu kāi', answer: '剖开', level: 4, grade: '4-下册', unit: 7, char: '剖' },
  { id: 'g4b-u7-zc-06', type: 'pinyin-to-char', content: 'kū long', answer: '窟窿', level: 4, grade: '4-下册', unit: 7, char: '窟' },
  { id: 'g4b-u7-zc-07', type: 'pinyin-to-char', content: 'wéi chí', answer: '维持', level: 4, grade: '4-下册', unit: 7, char: '维' },
  { id: 'g4b-u7-zc-08', type: 'pinyin-to-char', content: 'zhì xù', answer: '秩序', level: 4, grade: '4-下册', unit: 7, char: '序' },
  { id: 'g4b-u7-zc-09', type: 'pinyin-to-char', content: 'sī hǒu', answer: '嘶吼', level: 4, grade: '4-下册', unit: 7, char: '嘶' },
  { id: 'g4b-u7-zc-10', type: 'pinyin-to-char', content: 'bēi wēi', answer: '卑微', level: 4, grade: '4-下册', unit: 7, char: '卑' },
  { id: 'g4b-u7-zc-11', type: 'pinyin-to-char', content: 'gǎng wèi', answer: '岗位', level: 4, grade: '4-下册', unit: 7, char: '岗' },
  { id: 'g4b-u7-zc-12', type: 'pinyin-to-char', content: 'zhǔ zǎi', answer: '主宰', level: 4, grade: '4-下册', unit: 7, char: '宰' },
  { id: 'g4b-u7-zc-13', type: 'pinyin-to-char', content: 'diào qiǎn', answer: '调遣', level: 4, grade: '4-下册', unit: 7, char: '遣' },
  { id: 'g4b-u7-zc-14', type: 'pinyin-to-char', content: 'jiàn xíng', answer: '践行', level: 4, grade: '4-下册', unit: 7, char: '践' },
  { id: 'g4b-u7-zc-15', type: 'pinyin-to-char', content: 'zhàn yì', answer: '战役', level: 4, grade: '4-下册', unit: 7, char: '役' },
  { id: 'g4b-u7-zc-16', type: 'pinyin-to-char', content: 'lǚ cì', answer: '屡次', level: 4, grade: '4-下册', unit: 7, char: '屡' },
  { id: 'g4b-u7-zc-17', type: 'pinyin-to-char', content: 'cuī huǐ', answer: '摧毁', level: 4, grade: '4-下册', unit: 7, char: '摧' },
  { id: 'g4b-u7-zc-18', type: 'pinyin-to-char', content: 'dān wù', answer: '耽误', level: 4, grade: '4-下册', unit: 7, char: '耽' },
  { id: 'g4b-u7-zc-19', type: 'pinyin-to-char', content: 'wán qiáng', answer: '顽强', level: 4, grade: '4-下册', unit: 7, char: '顽' },
  { id: 'g4b-u7-zc-20', type: 'pinyin-to-char', content: 'zhōng yú zhí shǒu', answer: '忠于职守', level: 4, grade: '4-下册', unit: 7, char: '忠' },
  
  // 成语
  { id: 'g4b-u7-cy-01', type: 'fill-blank', content: '井然有_____', answer: '序', options: ['序', '条', '秩', '理'], level: 4, grade: '4-下册', unit: 7, char: '序' },
  { id: 'g4b-u7-cy-02', type: 'fill-blank', content: '惊恐万_____', answer: '状', options: ['状', '分', '般', '态'], level: 4, grade: '4-下册', unit: 7, char: '状' },
  { id: 'g4b-u7-cy-03', type: 'fill-blank', content: '惊慌失_____', answer: '措', options: ['措', '手', '主', '乱'], level: 4, grade: '4-下册', unit: 7, char: '措' },
  { id: 'g4b-u7-cy-04', type: 'fill-blank', content: '小心翼翼', answer: '翼翼', options: ['翼翼', '心心', '慎慎', '翼翼'], level: 4, grade: '4-下册', unit: 7, char: '翼' },
  { id: 'g4b-u7-cy-05', type: 'fill-blank', content: '临危不_____', answer: '惧', options: ['惧', '怕', '恐', '慌'], level: 4, grade: '4-下册', unit: 7, char: '惧' },
  { id: 'g4b-u7-cy-06', type: 'fill-blank', content: '彬彬有_____', answer: '礼', options: ['礼', '文', '雅', '节'], level: 4, grade: '4-下册', unit: 7, char: '礼' },
  { id: 'g4b-u7-cy-07', type: 'fill-blank', content: '焦躁不_____', answer: '安', options: ['安', '宁', '静', '定'], level: 4, grade: '4-下册', unit: 7, char: '安' },
  { id: 'g4b-u7-cy-08', type: 'fill-blank', content: '心急如_____', answer: '焚', options: ['焚', '火', '焚', '烧'], level: 4, grade: '4-下册', unit: 7, char: '焚' },
  
  // 古诗
  { id: 'g4b-u7-gs-01', type: 'fill-blank', content: '一片_____心在玉壶', answer: '冰', options: ['冰', '雪', '清', '洁'], level: 4, grade: '4-下册', unit: 7, char: '冰' },
  { id: 'g4b-u7-gs-02', type: 'fill-blank', content: '欲将轻骑逐，大雪满_____刀', answer: '弓', options: ['弓', '战', '宝', '马'], level: 4, grade: '4-下册', unit: 7, char: '弓' },
  { id: 'g4b-u7-gs-03', type: 'fill-blank', content: '不要人夸好颜色，只留清气满_____', answer: '乾坤', options: ['乾坤', '天地', '人间', '世界'], level: 4, grade: '4-下册', unit: 7, char: '乾' },

  // ==================== 第八单元 ====================
  // 易错音
  { id: 'g4b-u8-py-01', type: 'char-to-pinyin', content: '撵人', answer: 'niǎn rén', level: 4, grade: '4-下册', unit: 8, char: '撵' },
  { id: 'g4b-u8-py-02', type: 'char-to-pinyin', content: '拽住', answer: 'zhuài zhù', level: 4, grade: '4-下册', unit: 8, char: '拽' },
  { id: 'g4b-u8-py-03', type: 'char-to-pinyin', content: '砌墙', answer: 'qì qiáng', level: 4, grade: '4-下册', unit: 8, char: '砌' },
  { id: 'g4b-u8-py-04', type: 'char-to-pinyin', content: '脸颊', answer: 'liǎn jiá', level: 4, grade: '4-下册', unit: 8, char: '颊' },
  { id: 'g4b-u8-py-05', type: 'char-to-pinyin', content: '亲昵', answer: 'qīn nì', level: 4, grade: '4-下册', unit: 8, char: '昵' },
  { id: 'g4b-u8-py-06', type: 'char-to-pinyin', content: '惩罚', answer: 'chéng fá', level: 4, grade: '4-下册', unit: 8, char: '惩' },
  { id: 'g4b-u8-py-07', type: 'char-to-pinyin', content: '矢车菊', answer: 'shǐ chē jú', level: 4, grade: '4-下册', unit: 8, char: '矢' },
  { id: 'g4b-u8-py-08', type: 'char-to-pinyin', content: '一缕', answer: 'yī lǚ', level: 4, grade: '4-下册', unit: 8, char: '缕' },
  { id: 'g4b-u8-py-09', type: 'char-to-pinyin', content: '瞥见', answer: 'piē jiàn', level: 4, grade: '4-下册', unit: 8, char: '瞥' },
  { id: 'g4b-u8-py-10', type: 'char-to-pinyin', content: '禁止', answer: 'jìn zhǐ', level: 4, grade: '4-下册', unit: 8, char: '禁' },
  { id: 'g4b-u8-py-11', type: 'char-to-pinyin', content: '允许', answer: 'yǔn xǔ', level: 4, grade: '4-下册', unit: 8, char: '允' },
  
  // 重点字词
  { id: 'g4b-u8-zc-01', type: 'pinyin-to-char', content: 'jiè shào', answer: '介绍', level: 4, grade: '4-下册', unit: 8, char: '绍' },
  { id: 'g4b-u8-zc-02', type: 'pinyin-to-char', content: 'yāo guài', answer: '妖怪', level: 4, grade: '4-下册', unit: 8, char: '妖' },
  { id: 'g4b-u8-zc-03', type: 'pinyin-to-char', content: 'guī ju', answer: '规矩', level: 4, grade: '4-下册', unit: 8, char: '矩' },
  { id: 'g4b-u8-zc-04', type: 'pinyin-to-char', content: 'guāi qiǎo', answer: '乖巧', level: 4, grade: '4-下册', unit: 8, char: '乖' },
  { id: 'g4b-u8-zc-05', type: 'pinyin-to-char', content: 'niǎn zǒu', answer: '撵走', level: 4, grade: '4-下册', unit: 8, char: '撵' },
  { id: 'g4b-u8-zc-06', type: 'pinyin-to-char', content: 'gǔn tàng', answer: '滚烫', level: 4, grade: '4-下册', unit: 8, char: '烫' },
  { id: 'g4b-u8-zc-07', type: 'pinyin-to-char', content: 'zhuài zhù', answer: '拽住', level: 4, grade: '4-下册', unit: 8, char: '拽' },
  { id: 'g4b-u8-zc-08', type: 'pinyin-to-char', content: 'xìng fú', answer: '幸福', level: 4, grade: '4-下册', unit: 8, char: '幸' },
  { id: 'g4b-u8-zc-09', type: 'pinyin-to-char', content: 'shòu cháng', answer: '瘦长', level: 4, grade: '4-下册', unit: 8, char: '瘦' },
  { id: 'g4b-u8-zc-10', type: 'pinyin-to-char', content: 'bà gōng', answer: '罢工', level: 4, grade: '4-下册', unit: 8, char: '罢' },
  { id: 'g4b-u8-zc-11', type: 'pinyin-to-char', content: 'tiǎn shí', answer: '舔食', level: 4, grade: '4-下册', unit: 8, char: '舔' },
  { id: 'g4b-u8-zc-12', type: 'pinyin-to-char', content: 'xiàng rì kuí', answer: '向日葵', level: 4, grade: '4-下册', unit: 8, char: '葵' },
  { id: 'g4b-u8-zc-13', type: 'pinyin-to-char', content: 'tiě bàng', answer: '铁棒', level: 4, grade: '4-下册', unit: 8, char: '棒' },
  { id: 'g4b-u8-zc-14', type: 'pinyin-to-char', content: 'fēng shuò', answer: '丰硕', level: 4, grade: '4-下册', unit: 8, char: '硕' },
  { id: 'g4b-u8-zc-15', type: 'pinyin-to-char', content: 'qì qiáng', answer: '砌墙', level: 4, grade: '4-下册', unit: 8, char: '砌' },
  { id: 'g4b-u8-zc-16', type: 'pinyin-to-char', content: 'chéng fá', answer: '惩罚', level: 4, grade: '4-下册', unit: 8, char: '惩' },
  { id: 'g4b-u8-zc-17', type: 'pinyin-to-char', content: 'zōng jì', answer: '踪迹', level: 4, grade: '4-下册', unit: 8, char: '踪' },
  { id: 'g4b-u8-zc-18', type: 'pinyin-to-char', content: 'jìn zhǐ', answer: '禁止', level: 4, grade: '4-下册', unit: 8, char: '禁' },
  { id: 'g4b-u8-zc-19', type: 'pinyin-to-char', content: 'hū xiào', answer: '呼啸', level: 4, grade: '4-下册', unit: 8, char: '啸' },
  { id: 'g4b-u8-zc-20', type: 'pinyin-to-char', content: 'zì sī', answer: '自私', level: 4, grade: '4-下册', unit: 8, char: '私' },
  { id: 'g4b-u8-zc-21', type: 'pinyin-to-char', content: 'chāi chú', answer: '拆除', level: 4, grade: '4-下册', unit: 8, char: '拆' },
  { id: 'g4b-u8-zc-22', type: 'pinyin-to-char', content: 'xiōng hěn', answer: '凶狠', level: 4, grade: '4-下册', unit: 8, char: '狠' },
  { id: 'g4b-u8-zc-23', type: 'pinyin-to-char', content: 'fǔ mō', answer: '抚摸', level: 4, grade: '4-下册', unit: 8, char: '抚' },
  { id: 'g4b-u8-zc-24', type: 'pinyin-to-char', content: 'wèi lán', answer: '蔚蓝', level: 4, grade: '4-下册', unit: 8, char: '蔚' },
  
  // 成语/短语
  { id: 'g4b-u8-cy-01', type: 'fill-blank', content: '不可一_____', answer: '世', options: ['世', '时', '日', '生'], level: 4, grade: '4-下册', unit: 8, char: '世' },
  { id: 'g4b-u8-cy-02', type: 'fill-blank', content: '自言自_____', answer: '语', options: ['语', '说', '道', '讲'], level: 4, grade: '4-下册', unit: 8, char: '语' },
  { id: 'g4b-u8-cy-03', type: 'fill-blank', content: '可怜_____', answer: '巴巴', options: ['巴巴', '兮兮', '得很', '极了'], level: 4, grade: '4-下册', unit: 8, char: '巴' },
  
  // 文学常识
  { id: 'g4b-u8-wx-01', type: 'fill-blank', content: '《宝葫芦的秘密》作者是张_____翼', answer: '天', options: ['天', '文', '大', '永'], level: 4, grade: '4-下册', unit: 8, char: '天' },
  { id: 'g4b-u8-wx-02', type: 'fill-blank', content: '《巨人的花园》作者是王_____德', answer: '尔', options: ['尔', '而', '耳', '儿'], level: 4, grade: '4-下册', unit: 8, char: '尔' },
  { id: 'g4b-u8-wx-03', type: 'fill-blank', content: '《海的女儿》作者是_____作家安徒生', answer: '丹麦', options: ['丹麦', '挪威', '瑞典', '英国'], level: 4, grade: '4-下册', unit: 8, char: '丹' },
];

export default grade4b;