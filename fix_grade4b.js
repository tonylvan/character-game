import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/data/grade4b.ts';
let content = readFileSync(filePath, 'utf-8');

// 1. 修复类型问题：将 grade: 4 改为 grade: '4-下册'，unit: 1 改为 unit: 1 (保持数字)
content = content.replace(/grade:\s*4/g, "grade: '4-下册'");

// 2. 移除所有 content 以"_____"开头的题目
const lines = content.split('\n');
const result = [];
let skipBlock = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // 检测是否是以"_____"开头的 content
  if (line.includes("content: '_____") || line.includes('content: "_____')) {
    // 找到题目开始位置（向上查找最近的 {）
    let startIdx = result.length - 1;
    while (startIdx >= 0 && !result[startIdx].trim().startsWith('{')) {
      startIdx--;
    }
    if (startIdx >= 0) {
      // 删除这个题目块
      result.splice(startIdx);
      skipBlock = true;
      braceCount = 0;
      console.log(`移除无效题目：${line.trim()}`);
    }
  }
  
  if (skipBlock) {
    // 计算括号层级
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    if (braceCount <= 0 && line.includes('}')) {
      skipBlock = false;
      braceCount = 0;
    }
  } else {
    result.push(line);
  }
}

const newContent = result.join('\n');
writeFileSync(filePath, newContent, 'utf-8');
console.log('\n✅ grade4b.ts 已更新');
