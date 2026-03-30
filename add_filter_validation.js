import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/context/GameContext.tsx';
let content = readFileSync(filePath, 'utf-8');

// 1. 在 getQuestionsByCategory 函数末尾添加无效题目过滤
// 找到 category === 'all' 的判断处
const allCaseOld = `if (category === 'all') {
    return questions;
  }`;

const allCaseNew = `if (category === 'all') {
    // 过滤掉无效题目
    return questions.filter(q => isValidQuestion(q));
  }`;

if (content.includes(allCaseOld)) {
  content = content.replace(allCaseOld, allCaseNew);
  console.log('✅ 已更新 category === all 分支');
} else {
  console.error('⚠️ 未找到 category === all 分支');
}

// 2. 在 switch 返回前也添加过滤
const switchReturnOld = `return questions.filter((q) => {
    switch (category) {`;

const switchReturnNew = `// 先按分类过滤，再过滤掉无效题目
return questions.filter((q) => {
    switch (category) {`;

if (content.includes(switchReturnOld)) {
  content = content.replace(switchReturnOld, switchReturnNew);
  console.log('✅ 已添加注释');
}

// 在 switch 语句结束后添加 isValidQuestion 过滤
const switchEndOld = `      default:
        return true;
    }
  });
}`;

const switchEndNew = `      default:
        return true;
    }
  }).filter(q => isValidQuestion(q)); // 额外过滤无效题目
}`;

if (content.includes(switchEndOld)) {
  content = content.replace(switchEndOld, switchEndNew);
  console.log('✅ 已添加 isValidQuestion 过滤');
} else {
  console.error('⚠️ 未找到 switch 结束位置');
}

// 3. 在 weightedRandomSelect 中过滤掉权重为 0 的题目
const weightedOld = `function weightedRandomSelect(questions: Question[]): Question {
  if (questions.length === 0) {`;

const weightedNew = `function weightedRandomSelect(questions: Question[]): Question {
  // 过滤掉无效题目（权重为 0）
  const validQuestions = questions.filter(q => isValidQuestion(q));
  
  if (validQuestions.length === 0) {`;

if (content.includes(weightedOld)) {
  content = content.replace(weightedOld, weightedNew);
  console.log('✅ 已更新 weightedRandomSelect 函数');
  
  // 还需要替换函数体内对 questions 的引用为 validQuestions
  const totalWeightOld = 'const totalWeight = questions.reduce((sum, q) => sum + getWeightForQuestion(q), 0);';
  const totalWeightNew = 'const totalWeight = validQuestions.reduce((sum, q) => sum + getWeightForQuestion(q), 0);';
  
  if (content.includes(totalWeightOld)) {
    content = content.replace(totalWeightOld, totalWeightNew);
    console.log('✅ 已更新 totalWeight 计算');
  }
  
  const lastReturnOld = 'return questions[questions.length - 1];';
  const lastReturnNew = 'return validQuestions[validQuestions.length - 1];';
  
  if (content.includes(lastReturnOld)) {
    content = content.replace(lastReturnOld, lastReturnNew);
    console.log('✅ 已更新默认返回');
  }
  
  const loopOld = 'for (const question of questions) {';
  const loopNew = 'for (const question of validQuestions) {';
  
  if (content.includes(loopOld)) {
    content = content.replace(loopOld, loopNew);
    console.log('✅ 已更新循环');
  }
} else {
  console.error('⚠️ 未找到 weightedRandomSelect 函数');
}

writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ 所有更新完成！');
