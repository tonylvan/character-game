import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, saveUserData, resetUserData, getCharErrorRanking, setWrongCharFrequency, setPinyinDifficulty, setShowHint as saveShowHintSetting, getAllQuestions } from '../utils/storage'
import { Question } from '../types'

export default function ParentalControl() {
  const navigate = useNavigate()
  const userData = getUserData()
  const errorRanking = getCharErrorRanking()
  const allQuestions = getAllQuestions()
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [parentPassword, setParentPassword] = useState('')
  const [hasCustomPassword, setHasCustomPassword] = useState(false)
  
  const [dailyLimit, setDailyLimit] = useState(userData.parentSettings?.dailyLimit || 30)
  const [gameTime, setGameTime] = useState(userData.parentSettings?.gameTime || 15)
  const [wrongCharFreq, setWrongCharFreq] = useState(userData.parentSettings?.wrongCharFrequency || 50)
  const [pinyinDiff, setPinyinDiff] = useState<'easy' | 'medium' | 'hard'>(userData.parentSettings?.pinyinDifficulty || 'easy')
  const [showHint, setShowHintState] = useState(userData.parentSettings?.showHint ?? true)
  const [countdownEnabled, setCountdownEnabled] = useState(userData.parentSettings?.countdownEnabled ?? false)
  const [countdownMinutes, setCountdownMinutes] = useState(userData.parentSettings?.countdownMinutes || 10)
  
  const [newPassword, setNewPassword] = useState('')
  const [wrongChar, setWrongChar] = useState({ char: '', pinyin: '', reason: '' })
  
  // 题库管理状态
  const [showVocabManager, setShowVocabManager] = useState(false)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [filterUnit, setFilterUnit] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  
  // 新增题目状态
  const [newVocab, setNewVocab] = useState<{ content: string; answer: string; char: string; type: 'pinyin-to-char' | 'char-to-pinyin' | 'fill-blank'; options: string }>({ content: '', answer: '', char: '', type: 'pinyin-to-char', options: '' })
  const [selectedGradeSem, setSelectedGradeSem] = useState('4-下册')
  const [selectedUnit, setSelectedUnit] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem('parent_password')
    setHasCustomPassword(!!saved)
    if (!saved) {
      setShowPassword(true)
    }
  }, [])
  
  // 初始化题目列表
  useEffect(() => {
    if (showVocabManager) {
      filterQuestions()
    }
  }, [showVocabManager, filterGrade, filterUnit, filterType, searchText])

  const handleLogin = () => {
    const saved = localStorage.getItem('parent_password')
    const defaultPwd = '123456'
    const pwdToCheck = saved || defaultPwd
    
    if (parentPassword === pwdToCheck) {
      setIsLoggedIn(true)
      setShowPassword(false)
    } else {
      alert('密码错误，请重试')
      setParentPassword('')
    }
  }

  const resetPassword = () => {
    localStorage.removeItem('parent_password')
    setHasCustomPassword(false)
    alert('密码已重置为初始密码：123456')
    setIsLoggedIn(false)
    setShowPassword(true)
    setParentPassword('')
  }

  const changePassword = () => {
    if (!newPassword) {
      alert('请输入新密码')
      return
    }
    if (newPassword.length < 4) {
      alert('新密码至少需要 4 位字符')
      return
    }
    if (newPassword.length > 20) {
      alert('新密码不能超过 20 位字符')
      return
    }
    
    localStorage.setItem('parent_password', newPassword)
    setHasCustomPassword(true)
    alert('密码修改成功！请使用新密码重新登录')
    
    // 强制重新登录验证
    setIsLoggedIn(false)
    setShowPassword(true)
    setParentPassword('')
    setNewPassword('')
  }

  const saveSettings = () => {
    const updated = { ...userData, parentSettings: { ...userData.parentSettings, dailyLimit: Number(dailyLimit), gameTime: Number(gameTime), wrongCharFrequency: Number(wrongCharFreq), pinyinDifficulty: pinyinDiff, showHint, countdownEnabled, countdownMinutes: Number(countdownMinutes) } }
    saveUserData(updated)
    alert('设置已保存')
  }

  const saveWrongCharFreq = () => {
    setWrongCharFrequency(Number(wrongCharFreq))
    alert('错字频率已保存')
  }

  const savePinyinDiff = () => {
    setPinyinDifficulty(pinyinDiff)
    alert('拼音难度已保存')
  }

  const saveShowHint = () => {
    saveShowHintSetting(showHint)
    alert('提示设置已保存')
  }

  const resetWrongChars = () => {
    if (confirm('确定清空错字记录吗？')) {
      const updated = { ...userData, charErrors: [] }
      saveUserData(updated)
      alert('错字记录已清空')
      window.location.reload()
    }
  }

  const resetGameData = () => {
    if (confirm('确定重置所有游戏数据吗？（包括分数、错题本等）')) {
      resetUserData()
      alert('游戏数据已重置')
      window.location.reload()
    }
  }

  const addVocab = () => {
    if (!newVocab.content || !newVocab.answer) {
      alert('请填写完整')
      return
    }
    
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      type: newVocab.type,
      content: newVocab.content,
      answer: newVocab.answer,
      char: newVocab.char || newVocab.answer.charAt(0),
      level: parseInt(selectedGradeSem) || 1,
      grade: selectedGradeSem,
      unit: selectedUnit as any,
      options: newVocab.type === 'fill-blank' && newVocab.options ? newVocab.options.split(',').map(o => o.trim()) : undefined,
    }
    
    const updated = { ...userData, customQuestions: [...(userData.customQuestions || []), newQuestion] }
    saveUserData(updated)
    setNewVocab({ content: '', answer: '', char: '', type: 'pinyin-to-char', options: '' })
    alert('添加成功！共 ' + (updated.customQuestions?.length || 0) + ' 道自定义题目')
  }
  
  // 筛选题目
  const filterQuestions = () => {
    let result = [...allQuestions]
    
    // 按年级筛选
    if (filterGrade !== 'all') {
      const gradeNum = parseInt(filterGrade)
      result = result.filter(q => {
        const qGrade = typeof q.grade === 'string' ? parseInt(q.grade.split('-')[0]) : q.grade
        return qGrade === gradeNum
      })
    }
    
    // 按单元筛选
    if (filterUnit !== 'all') {
      const unitNum = parseInt(filterUnit) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
      result = result.filter(q => q.unit === unitNum)
    }
    
    // 按类型筛选
    if (filterType !== 'all') {
      result = result.filter(q => q.type === filterType)
    }
    
    // 搜索
    if (searchText) {
      const search = searchText.toLowerCase()
      result = result.filter(q => 
        q.content?.toLowerCase().includes(search) ||
        q.answer?.toLowerCase().includes(search) ||
        q.char?.includes(searchText)
      )
    }
    
    setFilteredQuestions(result)
  }
  
  // 选择/取消选择题目
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedQuestions(newSelected)
  }
  
  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set())
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)))
    }
  }
  
  // 删除选中的题目
  const deleteSelected = () => {
    if (selectedQuestions.size === 0) {
      alert('请先选择要删除的题目')
      return
    }
    if (!confirm(`确定删除选中的 ${selectedQuestions.size} 道题目吗？`)) return
    
    const data = getUserData()
    const newDeletedIds = [...(data.deletedQuestionIds || []), ...selectedQuestions]
    const updated = { ...data, deletedQuestionIds: newDeletedIds }
    saveUserData(updated)
    setSelectedQuestions(new Set())
    filterQuestions()
    alert('已删除 ' + selectedQuestions.size + ' 道题目')
  }
  
  // 恢复已删除的题目
  const restoreDeleted = () => {
    const data = getUserData()
    if (!data.deletedQuestionIds || data.deletedQuestionIds.length === 0) {
      alert('没有已删除的题目')
      return
    }
    if (!confirm(`确定恢复 ${data.deletedQuestionIds.length} 道已删除的题目吗？`)) return
    
    const updated = { ...data, deletedQuestionIds: [] }
    saveUserData(updated)
    filterQuestions()
    alert('已恢复所有删除的题目')
  }
  
  // 编辑题目
  const updateQuestion = (question: Question) => {
    const data = getUserData()
    
    // 检查是否是自定义题目
    const isCustom = question.id.startsWith('custom-')
    
    if (isCustom) {
      // 更新自定义题目
      const updated = {
        ...data,
        customQuestions: data.customQuestions?.map(q => q.id === question.id ? question : q) || []
      }
      saveUserData(updated)
    } else {
      // 系统题目：创建一个覆盖版本
      const existingOverrides = data.questionOverrides || {}
      const updated = {
        ...data,
        questionOverrides: { ...existingOverrides, [question.id]: question }
      }
      saveUserData(updated)
    }
    
    setEditingQuestion(null)
    filterQuestions()
    alert('题目已更新')
  }
  
  // 获取题目类型名称
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fill-blank': return '选字填空'
      case 'pinyin-to-char': return '拼音写汉字'
      case 'char-to-pinyin': return '汉字写拼音'
      default: return type
    }
  }

  const addWrongChar = () => {
    if (!wrongChar.char) {
      alert('请输入错字')
      return
    }
    const updated = { ...userData, charErrors: [...(userData.charErrors || []), { char: wrongChar.char, count: 1, lastWrong: new Date().toISOString(), sources: ['manual'] }] }
    saveUserData(updated)
    setWrongChar({ char: '', pinyin: '', reason: '' })
    alert('错字已添加')
  }

  const exportData = () => {
    const dataStr = JSON.stringify(userData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `game-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        saveUserData(data)
        alert('导入成功')
        window.location.reload()
      } catch {
        alert('导入失败，文件格式错误')
      }
    }
    reader.readAsText(file)
  }

  if (showPassword) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>家长管控</h1>
          <p style={styles.desc}>请输入家长密码</p>
          <input type="password" style={styles.input} value={parentPassword} onChange={(e) => setParentPassword(e.target.value)} placeholder="默认密码：123456" />
          <button style={styles.btn} onClick={handleLogin}>登录</button>
          <button style={styles.btnSecondary} onClick={() => navigate('/')}>返回</button>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>家长管控</h1>
          <button style={styles.btn} onClick={() => setShowPassword(true)}>输入密码</button>
          <button style={styles.btnSecondary} onClick={() => navigate('/')}>返回</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← 返回</button>
        <h1 style={styles.headerTitle}>家长管控设置</h1>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>安全设置</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>修改家长密码</label>
            <p style={styles.hint}>当前密码状态：{hasCustomPassword ? '已设置自定义密码' : '默认密码 (123456)'}</p>
            <input 
              type="password" 
              style={styles.input} 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="输入新密码（4-20位）" 
            />
            <p style={styles.hint}>密码长度：{newPassword.length} 位（需要 4-20 位）</p>
            <button style={styles.btn} onClick={changePassword} disabled={!newPassword || newPassword.length < 4}>
              确认修改密码
            </button>
            <button style={styles.btnDanger} onClick={resetPassword}>重置为默认密码</button>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>时间管理</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>每日游戏时长（分钟）</label>
            <input type="number" style={styles.input} value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>单次游戏时间（分钟）</label>
            <input type="number" style={styles.input} value={gameTime} onChange={(e) => setGameTime(Number(e.target.value))} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input type="checkbox" checked={countdownEnabled} onChange={(e) => setCountdownEnabled(e.target.checked)} />
              启用闯关倒计时
            </label>
          </div>
          {countdownEnabled && (
            <div style={styles.formGroup}>
              <label style={styles.label}>倒计时时长（分钟）</label>
              <input type="number" style={styles.input} value={countdownMinutes} onChange={(e) => setCountdownMinutes(Number(e.target.value))} />
            </div>
          )}
          <button style={styles.btn} onClick={saveSettings}>保存时间设置</button>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>学习设置</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>错字出现频率（0-100%）</label>
            <input type="number" style={styles.input} value={wrongCharFreq} onChange={(e) => setWrongCharFreq(Number(e.target.value))} min="0" max="100" />
            <button style={styles.btn} onClick={saveWrongCharFreq}>保存</button>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>拼音写汉字难度</label>
            <select style={styles.input} value={pinyinDiff} onChange={(e) => setPinyinDiff(e.target.value as any)}>
              <option value="easy">简单（完整拼音）</option>
              <option value="medium">中等（首字母）</option>
              <option value="hard">困难（纯声调）</option>
            </select>
            <button style={styles.btn} onClick={savePinyinDiff}>保存</button>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input type="checkbox" checked={showHint} onChange={(e) => setShowHintState(e.target.checked)} />
              显示提示
            </label>
            <button style={styles.btn} onClick={saveShowHint}>保存</button>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>错字管理</h2>
          <p style={styles.desc}>当前错字数量：{errorRanking.length}</p>
          <button style={styles.btnDanger} onClick={resetWrongChars}>清空错字记录</button>
          
          <div style={styles.formGroup}>
            <h3 style={styles.subTitle}>手动添加错字</h3>
            <input type="text" style={styles.input} value={wrongChar.char} onChange={(e) => setWrongChar({ ...wrongChar, char: e.target.value })} placeholder="错字" />
            <input type="text" style={styles.input} value={wrongChar.pinyin} onChange={(e) => setWrongChar({ ...wrongChar, pinyin: e.target.value })} placeholder="拼音（可选）" />
            <button style={styles.btn} onClick={addWrongChar}>添加</button>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>题库管理</h2>
          <p style={styles.desc}>当前题库共 {allQuestions.length} 道题目（自定义题目：{userData.customQuestions?.length || 0} 道）</p>
          
          <div style={styles.btnRow}>
            <button style={styles.btn} onClick={() => setShowVocabManager(!showVocabManager)}>
              {showVocabManager ? '收起题库' : '管理题目'}
            </button>
          </div>
          
          {!showVocabManager && (
            <>
              <h3 style={styles.subTitle}>添加新题目</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>题目类型</label>
                <select style={styles.input} value={newVocab.type} onChange={(e) => setNewVocab({ ...newVocab, type: e.target.value as any })}>
                  <option value="pinyin-to-char">拼音写汉字</option>
                  <option value="char-to-pinyin">汉字写拼音</option>
                  <option value="fill-blank">选字填空</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>年级</label>
                <select style={styles.input} value={selectedGradeSem} onChange={(e) => setSelectedGradeSem(e.target.value)}>
                  <option value="1-上册">一年级上册</option>
                  <option value="1-下册">一年级下册</option>
                  <option value="2-上册">二年级上册</option>
                  <option value="2-下册">二年级下册</option>
                  <option value="3-上册">三年级上册</option>
                  <option value="3-下册">三年级下册</option>
                  <option value="4-上册">四年级上册</option>
                  <option value="4-下册">四年级下册</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>单元</label>
                <select style={styles.input} value={selectedUnit} onChange={(e) => setSelectedUnit(parseInt(e.target.value))}>
                  {[1,2,3,4,5,6,7,8].map(u => <option key={u} value={u}>第{u}单元</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>题目内容 {newVocab.type === 'pinyin-to-char' ? '(拼音)' : newVocab.type === 'char-to-pinyin' ? '(汉字/词语)' : '(如：_____天)'}</label>
                <input type="text" style={styles.input} value={newVocab.content} onChange={(e) => setNewVocab({ ...newVocab, content: e.target.value })} placeholder={newVocab.type === 'pinyin-to-char' ? '如：míng tiān' : newVocab.type === 'char-to-pinyin' ? '如：明天' : '如：_____天'} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>答案</label>
                <input type="text" style={styles.input} value={newVocab.answer} onChange={(e) => setNewVocab({ ...newVocab, answer: e.target.value })} placeholder={newVocab.type === 'char-to-pinyin' ? '如：míng tiān' : '如：明天'} />
              </div>
              {newVocab.type === 'fill-blank' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>选项（用逗号分隔，正确答案放在第一位）</label>
                  <input type="text" style={styles.input} value={newVocab.options} onChange={(e) => setNewVocab({ ...newVocab, options: e.target.value })} placeholder="如：明,名,鸣,铭" />
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>重点汉字（可选）</label>
                <input type="text" style={styles.input} value={newVocab.char} onChange={(e) => setNewVocab({ ...newVocab, char: e.target.value })} placeholder="如：明" />
              </div>
              <button style={styles.btn} onClick={addVocab}>添加题目</button>
            </>
          )}
          
          {showVocabManager && (
            <>
              {/* 筛选区域 */}
              <div style={styles.filterRow}>
                <select style={styles.filterSelect} value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
                  <option value="all">全部年级</option>
                  <option value="1">一年级</option>
                  <option value="2">二年级</option>
                  <option value="3">三年级</option>
                  <option value="4">四年级</option>
                </select>
                <select style={styles.filterSelect} value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
                  <option value="all">全部单元</option>
                  {[1,2,3,4,5,6,7,8].map(u => <option key={u} value={u.toString()}>第{u}单元</option>)}
                </select>
                <select style={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">全部类型</option>
                  <option value="pinyin-to-char">拼音写汉字</option>
                  <option value="char-to-pinyin">汉字写拼音</option>
                  <option value="fill-blank">选字填空</option>
                </select>
                <input 
                  style={styles.filterInput} 
                  type="text" 
                  placeholder="搜索..." 
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)} 
                />
              </div>
              
              <p style={styles.hint}>筛选结果：{filteredQuestions.length} 道题目，已选中 {selectedQuestions.size} 道</p>
              
              {/* 操作按钮 */}
              <div style={styles.btnRow}>
                <button style={styles.btnSmall} onClick={toggleSelectAll}>
                  {selectedQuestions.size === filteredQuestions.length ? '取消全选' : '全选'}
                </button>
                <button style={styles.btnDangerSmall} onClick={deleteSelected} disabled={selectedQuestions.size === 0}>
                  删除选中 ({selectedQuestions.size})
                </button>
                <button style={styles.btnSmall} onClick={restoreDeleted}>
                  恢复已删除
                </button>
              </div>
              
              {/* 题目列表 */}
              <div style={styles.questionList}>
                {filteredQuestions.slice(0, 50).map(q => (
                  <div key={q.id} style={{
                    ...styles.questionItem,
                    ...(selectedQuestions.has(q.id) ? styles.questionItemSelected : {})
                  }}>
                    <input 
                      type="checkbox" 
                      checked={selectedQuestions.has(q.id)} 
                      onChange={() => toggleSelect(q.id)}
                      style={styles.checkbox}
                    />
                    <div style={styles.questionInfo}>
                      <span style={styles.questionType}>{getTypeLabel(q.type)}</span>
                      <span style={styles.questionContent}>{q.content}</span>
                      <span style={styles.questionAnswer}>答案：{q.answer}</span>
                      {q.grade && <span style={styles.questionMeta}>{q.grade}年级</span>}
                    </div>
                    <button 
                      style={styles.btnEdit} 
                      onClick={() => setEditingQuestion(q)}
                    >
                      编辑
                    </button>
                  </div>
                ))}
                {filteredQuestions.length > 50 && (
                  <p style={styles.hint}>仅显示前 50 条，共 {filteredQuestions.length} 条</p>
                )}
              </div>
            </>
          )}
        </section>
        
        {/* 编辑题目弹窗 */}
        {editingQuestion && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>编辑题目</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>题目内容</label>
                <input 
                  style={styles.input} 
                  value={editingQuestion.content} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, content: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>答案</label>
                <input 
                  style={styles.input} 
                  value={editingQuestion.answer} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                />
              </div>
              {editingQuestion.type === 'fill-blank' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>选项（用逗号分隔）</label>
                  <input 
                    style={styles.input} 
                    value={editingQuestion.options?.join(',') || ''} 
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, options: e.target.value.split(',').map(o => o.trim()) })}
                  />
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>重点汉字</label>
                <input 
                  style={styles.input} 
                  value={editingQuestion.char || ''} 
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, char: e.target.value })}
                />
              </div>
              <div style={styles.btnRow}>
                <button style={styles.btn} onClick={() => updateQuestion(editingQuestion)}>保存</button>
                <button style={styles.btnSecondary} onClick={() => setEditingQuestion(null)}>取消</button>
              </div>
            </div>
          </div>
        )}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>数据管理</h2>
          <button style={styles.btn} onClick={exportData}>导出数据</button>
          <label style={styles.btn}>
            导入数据
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </label>
          <button style={styles.btnDanger} onClick={resetGameData}>重置所有数据</button>
        </section>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)', padding: '20px' },
  card: { maxWidth: '400px', margin: '100px auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' },
  title: { color: '#C83C23', marginBottom: '20px' },
  desc: { color: '#666', marginBottom: '20px' },
  hint: { color: '#888', fontSize: '14px', marginBottom: '10px' },
  header: { display: 'flex', alignItems: 'center', padding: '15px', background: '#C83C23', color: 'white', borderRadius: '10px', marginBottom: '20px' },
  backBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', marginRight: '15px' },
  headerTitle: { margin: 0, fontSize: '20px' },
  content: { maxWidth: '900px', margin: '0 auto' },
  section: { background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  sectionTitle: { color: '#C83C23', borderBottom: '2px solid #C83C23', paddingBottom: '10px', marginBottom: '20px' },
  subTitle: { color: '#666', marginBottom: '15px', marginTop: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '16px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { padding: '12px 25px', background: '#C83C23', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' },
  btnSecondary: { padding: '12px 25px', background: '#f5f5f5', color: '#333', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' },
  btnDanger: { padding: '12px 25px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' },
  btnRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' },
  btnSmall: { padding: '8px 16px', background: '#C83C23', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  btnDangerSmall: { padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  btnEdit: { padding: '6px 12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' },
  filterSelect: { padding: '8px 12px', border: '2px solid #E8D5C4', borderRadius: '6px', fontSize: '14px', minWidth: '100px' },
  filterInput: { padding: '8px 12px', border: '2px solid #E8D5C4', borderRadius: '6px', fontSize: '14px', flex: 1, minWidth: '150px' },
  questionList: { maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' },
  questionItem: { display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee', gap: '10px' },
  questionItemSelected: { background: '#FFF5F3' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  questionInfo: { flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
  questionType: { padding: '2px 8px', background: '#E8D5C4', borderRadius: '4px', fontSize: '12px', color: '#666' },
  questionContent: { fontWeight: 'bold', color: '#333' },
  questionAnswer: { color: '#4CAF50', fontSize: '14px' },
  questionMeta: { color: '#888', fontSize: '12px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' },
  modalTitle: { color: '#C83C23', marginBottom: '20px' },
}
