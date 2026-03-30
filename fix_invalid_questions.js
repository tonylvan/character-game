// 清理选字填空题型中的无效数据
// 问题：content 以"_____"开头的题目（空白在最前面，无法正常作答）

import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/data/questions.ts';
let content = readFileSync(filePath, 'utf-8');

// 解析题库数据（提取 questions 数组）
const questionsMatch = content.match(/const questions: Question\[\] = \[([\s\S]*?)\];\n\nexport default questions/);
if (!questionsMatch) {
  console.error('无法解析 questions 数组');
  process.exit(1);
}

const questionsText = questionsMatch[1];

// 提取所有题目对象
const questionBlocks = [];
let depth = 0;
let start = -1;

for (let i = 0; i < questionsText.length; i++) {
  if (questionsText[i] === '{') {
    if (depth === 0) start = i;
    depth++;
  } else if (questionsText[i] === '}') {
    depth--;
    if (depth === 0 && start !== -1) {
      questionBlocks.push(questionsText.slice(start, i + 1));
      start = -1;
    }
  }
}

console.log(`找到 ${questionBlocks.length} 道题目`);

// 检查并清理有问题的题目
const validQuestions = [];
const removedQuestions = [];

for (const block of questionBlocks) {
  const typeMatch = block.match(/type:\s*'([^']+)'/);
  const contentMatch = block.match(/content:\s*'([^']+)'/);
  const optionsMatch = block.match(/options:\s*\[([^\]]*)\]/);
  const idMatch = block.match(/id:\s*'([^']+)'/);
  
  const type = typeMatch ? typeMatch[1] : null;
  const qContent = contentMatch ? contentMatch[1] : null;
  const id = idMatch ? idMatch[1] : 'unknown';
  
  // 检查选字填空题型
  if (type === 'fill-blank') {
    // 问题 1: content 以"_____"开头（空白在最前面，无法作答）
    if (qContent && qContent.startsWith('_____')) {
      removedQuestions.push({ id, reason: 'content 以_____开头', content: qContent });
      continue;
    }
    
    // 问题 2: 没有 options 或 options 为空
    if (!optionsMatch || (optionsMatch[1] && optionsMatch[1].trim() === '')) {
      removedQuestions.push({ id, reason: '缺少 options', content: qContent });
      continue;
    }
  }
  
  validQuestions.push(block);
}

console.log(`\n清理结果:`);
console.log(`  保留：${validQuestions.length} 道`);
console.log(`  移除：${removedQuestions.length} 道`);

if (removedQuestions.length > 0) {
  console.log(`\n移除的题目:`);
  removedQuestions.forEach(q => {
    console.log(`  - ${q.id}: ${q.reason} (content: "${q.content}")`);
  });
}

// 重建文件
const newQuestionsText = validQuestions.join(',\n');
const newContent = content.replace(
  /const questions: Question\[\] = \[[\s\S]*?\];\n\nexport default questions/,
  `const questions: Question[] = [\n${newQuestionsText}\n];\n\nexport default questions`
);

writeFileSync(filePath, newContent, 'utf-8');
console.log(`\n✅ 已更新 questions.ts 文件`);
