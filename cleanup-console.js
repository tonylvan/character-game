// 🧹 清理汉字闯关游戏中的无效题目
// 使用方法：在浏览器控制台 (F12) 中粘贴此脚本并回车执行

(function fixInvalidQuestions() {
  const STORAGE_KEY = 'chinese-character-game';
  
  console.log('🔍 开始检查题目数据...\n');
  
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) {
      console.log('✅ 没有用户数据，无需清理');
      return;
    }
    
    const data = JSON.parse(dataStr);
    
    // 清理自定义题目
    const customQuestions = data.customQuestions || [];
    if (customQuestions.length > 0) {
      console.log(`📝 找到 ${customQuestions.length} 道自定义题目`);
      
      const validCustom = [];
      const removedCustom = [];
      
      for (const q of customQuestions) {
        if (q.type === 'fill-blank') {
          if (q.content && q.content.startsWith('_____')) {
            removedCustom.push({ id: q.id, reason: 'content 以_____开头', content: q.content });
            continue;
          }
          if (!q.options || q.options.length === 0) {
            removedCustom.push({ id: q.id, reason: '缺少 options', content: q.content });
            continue;
          }
        }
        validCustom.push(q);
      }
      
      if (removedCustom.length > 0) {
        console.log(`  ❌ 移除 ${removedCustom.length} 道无效题目:`);
        removedCustom.forEach(q => console.log(`     - ${q.id}: ${q.reason}`));
        data.customQuestions = validCustom;
      } else {
        console.log(`  ✅ 所有自定义题目都有效`);
      }
    }
    
    // 记录已删除的题目 ID（防止再次出现）
    if (!data.deletedQuestionIds) {
      data.deletedQuestionIds = [];
    }
    
    // 清理错题本中的无效题目
    const wrongQuestions = data.wrongQuestions || [];
    if (wrongQuestions.length > 0) {
      console.log(`\n📚 找到 ${wrongQuestions.length} 道错题`);
      
      const validWrong = [];
      const removedWrong = [];
      
      for (const q of wrongQuestions) {
        if (q.type === 'fill-blank') {
          if (q.content && q.content.startsWith('_____')) {
            removedWrong.push({ id: q.id, reason: 'content 以_____开头' });
            if (!data.deletedQuestionIds.includes(q.id)) {
              data.deletedQuestionIds.push(q.id);
            }
            continue;
          }
          if (!q.options || q.options.length === 0) {
            removedWrong.push({ id: q.id, reason: '缺少 options' });
            if (!data.deletedQuestionIds.includes(q.id)) {
              data.deletedQuestionIds.push(q.id);
            }
            continue;
          }
        }
        validWrong.push(q);
      }
      
      if (removedWrong.length > 0) {
        console.log(`  ❌ 移除 ${removedWrong.length} 道无效错题`);
        data.wrongQuestions = validWrong;
      } else {
        console.log(`  ✅ 所有错题都有效`);
      }
    }
    
    // 保存更新后的数据
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    console.log('\n✅ 清理完成！请刷新页面生效。\n');
    
  } catch (e) {
    console.error('❌ 清理失败:', e);
  }
})();
