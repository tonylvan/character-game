// 清理 localStorage 中有问题的自定义题目
// 问题：content 以"_____"开头的选字填空题

const STORAGE_KEY = 'chinese-character-game';

function fixInvalidCustomQuestions() {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) {
      console.log('✅ 没有用户数据，无需清理');
      return;
    }
    
    const data = JSON.parse(dataStr);
    const customQuestions = data.customQuestions || [];
    
    if (customQuestions.length === 0) {
      console.log('✅ 没有自定义题目，无需清理');
      return;
    }
    
    console.log(`找到 ${customQuestions.length} 道自定义题目`);
    
    const validQuestions = [];
    const removedQuestions = [];
    
    for (const q of customQuestions) {
      // 检查选字填空题型
      if (q.type === 'fill-blank') {
        // 问题 1: content 以"_____"开头
        if (q.content && q.content.startsWith('_____')) {
          removedQuestions.push({ id: q.id, reason: 'content 以_____开头', content: q.content });
          continue;
        }
        
        // 问题 2: 没有 options 或 options 为空
        if (!q.options || q.options.length === 0) {
          removedQuestions.push({ id: q.id, reason: '缺少 options', content: q.content });
          continue;
        }
      }
      
      validQuestions.push(q);
    }
    
    console.log(`\n清理结果:`);
    console.log(`  保留：${validQuestions.length} 道`);
    console.log(`  移除：${removedQuestions.length} 道`);
    
    if (removedQuestions.length > 0) {
      console.log(`\n移除的题目:`);
      removedQuestions.forEach(q => {
        console.log(`  - ${q.id}: ${q.reason} (content: "${q.content}")`);
      });
      
      // 更新数据
      data.customQuestions = validQuestions;
      
      // 记录已删除的题目 ID（防止再次出现）
      if (!data.deletedQuestionIds) {
        data.deletedQuestionIds = [];
      }
      removedQuestions.forEach(q => {
        if (!data.deletedQuestionIds.includes(q.id)) {
          data.deletedQuestionIds.push(q.id);
        }
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log(`\n✅ 已更新 localStorage`);
    } else {
      console.log(`\n✅ 所有自定义题目都有效`);
    }
    
  } catch (e) {
    console.error('❌ 清理失败:', e);
  }
}

// 在浏览器控制台执行
fixInvalidCustomQuestions();
