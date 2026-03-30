import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/context/GameContext.tsx';
let content = readFileSync(filePath, 'utf-8');

// 查找 getWeightForQuestion 函数定义前的注释
const lines = content.split('\n');
let insertIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function getWeightForQuestion')) {
    // 找到函数定义，在它前面插入
    insertIndex = i;
    break;
  }
}

if (insertIndex === -1) {
  console.error('❌ 未找到 getWeightForQuestion 函数');
  process.exit(1);
}

const newFunc = `// 验证题目是否有效
function isValidQuestion(question: Question): boolean {
  if (!question || !question.type) return false;
  
  // 选字填空题型特殊验证
  if (question.type === 'fill-blank') {
    // content 不能以"_____"开头（空白在最前面无法正常作答）
    if (question.content && question.content.startsWith('_____')) {
      return false;
    }
    // 必须有 options 且不为空
    if (!question.options || question.options.length === 0) {
      return false;
    }
  }
  
  return true;
}

`;

// 在函数前插入新函数
lines.splice(insertIndex, 0, newFunc);
let newContent = lines.join('\n');

// 同时修改 getWeightForQuestion 函数，在开头添加有效性检查
const oldFuncStart = `function getWeightForQuestion(question: Question): number {
  const errorRanking = getCharErrorRanking();`;

const newFuncStart = `function getWeightForQuestion(question: Question): number {
  // 先验证题目有效性
  if (!isValidQuestion(question)) {
    return 0; // 无效题目权重为 0，不会被选中
  }

  const errorRanking = getCharErrorRanking();`;

if (newContent.includes(oldFuncStart)) {
  newContent = newContent.replace(oldFuncStart, newFuncStart);
  console.log('✅ 已更新 getWeightForQuestion 函数');
} else {
  console.error('❌ 未找到 getWeightForQuestion 函数体');
  process.exit(1);
}

writeFileSync(filePath, newContent, 'utf-8');
console.log('✅ 已添加 isValidQuestion 验证函数');
