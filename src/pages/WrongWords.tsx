import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWrongQuestions, removeWrongQuestion } from '../utils/storage'
import { Question } from '../types'

export default function WrongWords() {
  const navigate = useNavigate()
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>(getWrongQuestions())
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleRemove = (id: string) => {
    removeWrongQuestion(id)
    setWrongQuestions(getWrongQuestions())
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有错题吗？')) {
      wrongQuestions.forEach(q => removeWrongQuestion(q.id))
      setWrongQuestions([])
    }
  }

  const startPractice = () => {
    if (wrongQuestions.length > 0) {
      setPracticeMode(true)
      setCurrentQuestion(wrongQuestions[0])
    }
  }

  const handlePracticeSubmit = () => {
    if (!currentQuestion) return
    
    let correct = false
    if (currentQuestion.type === 'fill-blank') {
      correct = userAnswer === currentQuestion.answer
    } else if (currentQuestion.type === 'pinyin-to-char') {
      correct = userAnswer.trim() === currentQuestion.answer
    } else if (currentQuestion.type === 'char-to-pinyin') {
      correct = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()
    }

    if (correct) {
      removeWrongQuestion(currentQuestion.id)
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }
    setShowResult(true)
  }

  const handleNextPractice = () => {
    const currentIndex = wrongQuestions.findIndex(q => q.id === currentQuestion?.id)
    if (currentIndex < wrongQuestions.length - 1) {
      setCurrentQuestion(wrongQuestions[currentIndex + 1])
      setUserAnswer('')
      setShowResult(false)
    } else {
      setPracticeMode(false)
      setCurrentQuestion(null)
      setWrongQuestions(getWrongQuestions())
    }
  }

  if (practiceMode && currentQuestion) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📚 错题练习</h2>
        <div style={styles.card}>
          {currentQuestion.type === 'fill-blank' ? (
            <>
              <p style={styles.question}>{currentQuestion.content}</p>
              <div style={styles.options}>
                {currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    style={{
                      ...styles.optionBtn,
                      ...(showResult && opt === currentQuestion.answer ? styles.correct : {}),
                    }}
                    onClick={() => !showResult && setUserAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p style={styles.question}>{currentQuestion.content}</p>
              <input
                type="text"
                style={styles.input}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="输入答案"
              />
            </>
          )}
          
          {showResult && (
            <div style={isCorrect ? styles.successMsg : styles.errorMsg}>
              {isCorrect ? '✅ 回答正确！已从错题本移除' : `❌ 正确答案：${currentQuestion.answer}`}
            </div>
          )}
          
          <button style={styles.submitBtn} onClick={handlePracticeSubmit} disabled={showResult}>
            提交
          </button>
          {showResult && (
            <button style={styles.nextBtn} onClick={handleNextPractice}>
              继续
            </button>
          )}
        </div>
        <button style={styles.backBtn} onClick={() => setPracticeMode(false)}>
          返回
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 错题本</h2>
      
      {wrongQuestions.length === 0 ? (
        <div style={styles.empty}>
          <p>🎉 太棒了！没有错题</p>
        </div>
      ) : (
        <>
          <div style={styles.stats}>
            <span>共 {wrongQuestions.length} 道错题</span>
          </div>
          
          <button style={styles.practiceBtn} onClick={startPractice}>
            📝 开始练习
          </button>
          
          <div style={styles.list}>
            {wrongQuestions.map((q, idx) => (
              <div key={q.id} style={styles.item}>
                <span>{idx + 1}. {q.content}</span>
                <button style={styles.removeBtn} onClick={() => handleRemove(q.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <button style={styles.clearBtn} onClick={handleClearAll}>
            🗑️ 清空所有
          </button>
        </>
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
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '20px',
    color: '#666',
  },
  stats: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
  },
  practiceBtn: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto 20px',
    padding: '15px',
    fontSize: '18px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  list: {
    background: 'white',
    borderRadius: '15px',
    padding: '15px',
    marginBottom: '20px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  removeBtn: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
  },
  clearBtn: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto 20px',
    padding: '15px',
    fontSize: '18px',
    background: 'white',
    color: '#f44336',
    border: '2px solid #f44336',
    borderRadius: '50px',
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
  card: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  question: {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  optionBtn: {
    padding: '15px',
    fontSize: '18px',
    background: 'white',
    border: '2px solid #C83C23',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '20px',
    border: '2px solid #C83C23',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  nextBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    marginTop: '15px',
  },
  successMsg: {
    padding: '15px',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '15px',
  },
  errorMsg: {
    padding: '15px',
    background: '#ffebee',
    color: '#c62828',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '15px',
  },
}
