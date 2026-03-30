import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, saveUserData, exportData, importData, resetUserData } from '../utils/storage'
import { Question } from '../types'

export default function My() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(getUserData())
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'fill-blank',
    level: 1,
  })
  const [importText, setImportText] = useState('')

  const handleSaveName = (name: string) => {
    userData.userName = name
    saveUserData(userData)
    setUserData({ ...userData })
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `汉字闯关备份-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData(importText)) {
      setUserData(getUserData())
      alert('导入成功！')
      setImportText('')
    } else {
      alert('导入失败，请检查 JSON 格式')
    }
  }

  const handleAddQuestion = () => {
    if (!newQuestion.content || !newQuestion.answer || !newQuestion.char) {
      alert('请填写完整信息')
      return
    }
    
    const question: Question = {
      id: `custom_${Date.now()}`,
      type: newQuestion.type as any,
      content: newQuestion.content!,
      answer: newQuestion.answer!,
      options: newQuestion.options,
      level: newQuestion.level || 1,
      char: newQuestion.char!,
    }

    const data = getUserData()
    data.customQuestions.push(question)
    saveUserData(data)
    setUserData({ ...userData })
    setShowAddQuestion(false)
    setNewQuestion({ type: 'fill-blank', level: 1 })
    alert('添加成功！')
  }

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      resetUserData()
      setUserData(getUserData())
      alert('已重置')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ 我的</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>👤 个人信息</h3>
        <input
          type="text"
          style={styles.input}
          value={userData.userName}
          onChange={(e) => handleSaveName(e.target.value)}
          placeholder="你的名字"
        />
        <div style={styles.info}>
          <p>当前关卡：{userData.level}</p>
          <p>总积分：{userData.score}</p>
          <p>错题数：{userData.wrongQuestions.length}</p>
          <p>自定义题目：{userData.customQuestions.length}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📝 题库管理</h3>
        <button style={styles.button} onClick={() => setShowAddQuestion(true)}>
          ➕ 添加自定义题目
        </button>
        <button style={styles.button} onClick={handleExport}>
          📤 导出数据
        </button>
        <button style={styles.button} onClick={handleImport}>
          📥 导入数据
        </button>
        {importText && (
          <textarea
            style={styles.textarea}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="粘贴 JSON 数据..."
          />
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚠️ 数据管理</h3>
        <button style={styles.dangerButton} onClick={handleReset}>
          🗑️ 重置所有数据
        </button>
      </div>

      {showAddQuestion && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>添加自定义题目</h3>
            
            <label style={styles.label}>题型</label>
            <select
              style={styles.select}
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
            >
              <option value="fill-blank">选字填空</option>
              <option value="pinyin-to-char">看拼音写汉字</option>
              <option value="char-to-pinyin">看汉字写拼音</option>
            </select>

            <label style={styles.label}>题目内容</label>
            <input
              type="text"
              style={styles.input}
              value={newQuestion.content || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              placeholder="如：画蛇_____"
            />

            <label style={styles.label}>正确答案</label>
            <input
              type="text"
              style={styles.input}
              value={newQuestion.answer || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
              placeholder="如：添足"
            />

            {newQuestion.type === 'fill-blank' && (
              <>
                <label style={styles.label}>选项（用逗号分隔）</label>
                <input
                  type="text"
                  style={styles.input}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="如：添足，填足，加足，多足"
                />
              </>
            )}

            <label style={styles.label}>关联汉字</label>
            <input
              type="text"
              style={styles.input}
              value={newQuestion.char || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, char: e.target.value })}
              placeholder="如：添"
            />

            <label style={styles.label}>难度等级 (1-10)</label>
            <input
              type="number"
              style={styles.input}
              value={newQuestion.level || 1}
              onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value) })}
              min="1"
              max="10"
            />

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowAddQuestion(false)}>
                取消
              </button>
              <button style={styles.confirmBtn} onClick={handleAddQuestion}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ← 返回
      </button>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
  },
  title: {
    fontSize: '32px',
    color: '#C83C23',
    textAlign: 'center',
    marginBottom: '30px',
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '15px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '10px',
  },
  info: {
    color: '#666',
    lineHeight: '2',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    marginBottom: '15px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    marginBottom: '15px',
    minHeight: '150px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  dangerButton: {
    display: 'block',
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    background: 'white',
    color: '#f44336',
    border: '2px solid #f44336',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  backBtn: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
    padding: '15px',
    fontSize: '18px',
    background: 'white',
    color: '#C83C23',
    border: '2px solid #C83C23',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    background: 'white',
    color: '#666',
    border: '2px solid #ddd',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
}
