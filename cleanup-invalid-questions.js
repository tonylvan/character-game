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
    let hasChanges = false;
    
    // 清理自定义题目
    const customQuestions = data.customQuestions || [];
    if (customQuestions.length > 0) {
      console.log(`📝 检查 ${customQuestions.length} 道自定义题目`);
      
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
        hasChanges = true;
      } else {
        console.log(`  ✅ 所有自定义题目都有效`);
      }
    }
    
    // 清理错题本中的无效题目
    const wrongQuestions = data.wrongQuestions || [];
    if (wrongQuestions.length > 0) {
      console.log(`\n📚 检查 ${wrongQuestions.length} 道错题`);
      
      const validWrong = [];
      const removedWrong = [];
      
      for (const q of wrongQuestions) {
        if (q.type === 'fill-blank') {
          if (q.content && q.content.startsWith('_____')) {
            removedWrong.push({ id: q.id, reason: 'content 以_____开头' });
            continue;
          }
          if (!q.options || q.options.length === 0) {
            removedWrong.push({ id: q.id, reason: '缺少 options' });
            continue;
          }
        }
        validWrong.push(q);
      }
      
      if (removedWrong.length > 0) {
        console.log(`  ❌ 移除 ${removedWrong.length} 道无效错题`);
        data.wrongQuestions = validWrong;
        hasChanges = true;
      } else {
        console.log(`  ✅ 所有错题都有效`);
      }
    }
    
    // 保存更新后的数据
    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('\n✅ 清理完成！请刷新页面生效。\n');
    } else {
      console.log('\n✅ 所有数据都有效，无需清理。\n');
    }
    
  } catch (e) {
    console.error('❌ 清理失败:', e);
  }
})();
