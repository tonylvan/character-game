import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, saveUserData, resetUserData, getCharErrorRanking, setWrongCharFrequency, resetCharErrorOrder, getAllQuestions, setPinyinDifficulty, setShowHint } from '../utils/storage'
import { Question } from '../types'

export default function ParentalControl() {
  const navigate = useNavigate()
  const userData = getUserData()
  const errorRanking = getCharErrorRanking()
  const allQuestions = getAllQuestions()
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [parentPassword, setParentPassword] = useState('')
  
  const [dailyLimit, setDailyLimit] = useState(userData.parentSettings?.dailyLimit || 30)
  const [gameTime, setGameTime] = useState(userData.parentSettings?.gameTime || 15)
  const [wrongCharFreq, setWrongCharFreq] = useState(userData.parentSettings?.wrongCharFrequency || 50)
  const [pinyinDiff, setPinyinDiff] = useState<'easy' | 'medium' | 'hard'>(userData.parentSettings?.pinyinDifficulty || 'easy')
  const [showHint, setShowHint] = useState(userData.parentSettings?.showHint ?? true)
  const [countdownEnabled, setCountdownEnabled] = useState(userData.parentSettings?.countdownEnabled ?? false)
  const [countdownMinutes, setCountdownMinutes] = useState(userData.parentSettings?.countdownMinutes || 10)
  
  const [newPassword, setNewPassword] = useState('')
  const [vocabList, setVocabList] = useState<Question[]>([])
  const [newVocab, setNewVocab] = useState({ content: '', answer: '', char: '', type: 'pinyin-to-char' as const })
  const [wrongChar, setWrongChar] = useState({ char: '', pinyin: '', reason: '' })
  const [selectedGradeSem, setSelectedGradeSem] = useState('1-上册')
  const [selectedUnit, setSelectedUnit] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem('parent_password')
    if (!saved) {
      setShowPassword(true)
    }
  }, [])

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
    setShowHint(showHint)
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
    }
    const updated = { ...userData, customQuestions: [...(userData.customQuestions || []), newQuestion] }
    saveUserData(updated)
    setVocabList([...vocabList, newQuestion])
    setNewVocab({ content: '', answer: '', char: '', type: 'pinyin-to-char' })
    alert('添加成功')
  }

  const deleteVocab = (id: string) => {
    if (!confirm('确定删除？')) return
    const updated = { ...userData, deletedQuestionIds: [...(userData.deletedQuestionIds || []), id] }
    saveUserData(updated)
    setVocabList(vocabList.filter(q => q.id !== id))
    alert('删除成功')
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
            <p style={styles.hint}>当前密码状态：{localStorage.getItem('parent_password') ? '已设置自定义密码' : '默认密码 (123456)'}</p>
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
            <input type="number" style={styles.input} value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>单次游戏时间（分钟）</label>
            <input type="number" style={styles.input} value={gameTime} onChange={(e) => setGameTime(e.target.value)} />
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
              <input type="number" style={styles.input} value={countdownMinutes} onChange={(e) => setCountdownMinutes(e.target.value)} />
            </div>
          )}
          <button style={styles.btn} onClick={saveSettings}>保存时间设置</button>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>学习设置</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>错字出现频率（0-100%）</label>
            <input type="number" style={styles.input} value={wrongCharFreq} onChange={(e) => setWrongCharFreq(e.target.value)} min="0" max="100" />
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
              <input type="checkbox" checked={showHint} onChange={(e) => setShowHint(e.target.checked)} />
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
          <h2 style={styles.sectionTitle}>自定义题库</h2>
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
              <option value={1}>第一单元</option>
              <option value={2}>第二单元</option>
              <option value={3}>第三单元</option>
              <option value={4}>第四单元</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>题目内容</label>
            <input type="text" style={styles.input} value={newVocab.content} onChange={(e) => setNewVocab({ ...newVocab, content: e.target.value })} placeholder="如：míng tiān" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>答案</label>
            <input type="text" style={styles.input} value={newVocab.answer} onChange={(e) => setNewVocab({ ...newVocab, answer: e.target.value })} placeholder="如：明天" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>汉字</label>
            <input type="text" style={styles.input} value={newVocab.char} onChange={(e) => setNewVocab({ ...newVocab, char: e.target.value })} placeholder="如：明" />
          </div>
          <button style={styles.btn} onClick={addVocab}>添加题目</button>
        </section>

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
  content: { maxWidth: '800px', margin: '0 auto' },
  section: { background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  sectionTitle: { color: '#C83C23', borderBottom: '2px solid #C83C23', paddingBottom: '10px', marginBottom: '20px' },
  subTitle: { color: '#666', marginBottom: '15px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', border: '2px solid #E8D5C4', borderRadius: '8px', fontSize: '16px', marginBottom: '10px', boxSizing: 'border-box' },
  btn: { padding: '12px 25px', background: '#C83C23', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' },
  btnSecondary: { padding: '12px 25px', background: '#f5f5f5', color: '#333', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' },
  btnDanger: { padding: '12px 25px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' },
}
