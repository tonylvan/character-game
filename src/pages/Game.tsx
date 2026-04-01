import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame, QUESTION_CATEGORIES } from '../context/GameContext'
import { getUserData, getPinyinDifficulty, getShowHint } from '../utils/storage'

export default function Game() {
  const navigate = useNavigate()
  const { state, answerCorrect, answerWrong, nextQuestion, getStory } = useGame()
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [story, setStory] = useState<any>(null)
  
  // 难度设置
  const [pinyinDifficulty, setPinyinDifficultyState] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [showHint, setShowHintState] = useState(true)
  
  // 加载难度设置
  useEffect(() => {
    setPinyinDifficultyState(getPinyinDifficulty())
    setShowHintState(getShowHint())
  }, [])
  
  // 根据难度处理拼音显示
  const getProcessedPinyin = (content: string): string => {
    if (pinyinDifficulty === 'easy') {
      return content // 完整拼音
    }
    
    // 提取拼音部分（去掉数字声调）
    const pinyinParts = content.split(' ').map(p => {
      // 移除声调数字
      return p.replace(/[0-9]/g, '')
    })
    
    if (pinyinDifficulty === 'medium') {
      // 只保留声母
      return pinyinParts.map(p => {
        // 获取第一个字母作为声母
        return p.charAt(0)
      }).join(' ')
    }
    
    // hard: 纯声调 - 显示带声调的完整拼音但没有韵母提示
    return content
  }
  
  // 倒计时相关状态
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showCountdownAlert, setShowCountdownAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  
  // 手写识别相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([])

  // 初始化手写画布 - 设置正确的分辨率
  useEffect(() => {
    if (showCanvas && canvasRef.current) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      // 设置canvas实际分辨率与CSS大小一致（简化坐标计算）
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        // 绘制白色背景和边框
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, rect.width, rect.height)
        ctx.strokeStyle = '#C83C23'
        ctx.lineWidth = 3
        ctx.strokeRect(2, 2, rect.width - 4, rect.height - 4)
      }
    }
  }, [showCanvas])

  const question = state.currentQuestion
  const currentCategory = QUESTION_CATEGORIES.find(c => c.value === state.selectedCategory)

  useEffect(() => {
    if (!state.isPlaying && !state.isGameOver && !state.isLevelComplete) {
      navigate('/')
    }
  }, [state.isPlaying, state.isGameOver, state.isLevelComplete, navigate])

  // 监听键盘事件 - 支持Enter键提交答案和继续下一题
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 如果没有当前题目，不处理
      if (!question) return
      
      // 答案显示后，按Enter继续下一题
      if (showResult && e.key === 'Enter') {
        handleNext()
        return
      }
      
      // 提交答案（按Enter键）
      if (!showResult && e.key === 'Enter') {
        // fill-blank类型：如果已选择选项，则提交
        if (question.type === 'fill-blank' && selectedOption) {
          handleSubmit()
        }
        // 其他类型已在input的onKeyPress中处理
      }
      
      // fill-blank类型：支持按数字键1-4选择选项
      if (!showResult && question.type === 'fill-blank' && question.options) {
        const num = parseInt(e.key)
        if (num >= 1 && num <= question.options.length) {
          setSelectedOption(question.options[num - 1])
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showResult, selectedOption, question])

  useEffect(() => {
    if (question && story === null) {
      const s = getStory(question.char)
      setStory(s)
    }
  }, [question, story, getStory])

  // 倒计时逻辑
  useEffect(() => {
    const userData = getUserData()
    const settings = userData.parentSettings
    
    if (settings?.countdownEnabled && settings.countdownMinutes && settings.questionCount) {
      // 初始化倒计时（秒）
      const totalSeconds = settings.countdownMinutes * 60
      setCountdown(totalSeconds)
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            return 0
          }
          
          const newTime = prev - 1
          
          // 剩余 1 分钟提醒
          if (newTime === 60) {
            setAlertMessage('⏰ 剩余 1 分钟！')
            setShowCountdownAlert(true)
            setTimeout(() => setShowCountdownAlert(false), 3000)
          }
          
          // 剩余 30 秒提醒
          if (newTime === 30) {
            setAlertMessage('⏰ 剩余 30 秒！')
            setShowCountdownAlert(true)
            setTimeout(() => setShowCountdownAlert(false), 3000)
          }
          
          // 时间到
          if (newTime === 0) {
            setAlertMessage('⏰ 时间到！')
            setShowCountdownAlert(true)
            setTimeout(() => {
              setShowCountdownAlert(false)
              navigate('/')
            }, 3000)
          }
          
          return newTime
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [navigate])

  if (!question) return <div>加载中...</div>
  if (state.isGameOver) return <GameOver score={state.score} />
  if (state.isLevelComplete) return <LevelComplete level={state.level} />

  // 获取题目类型的显示名称
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'fill-blank': return '选字填空'
      case 'pinyin-to-char': return '拼音写汉字'
      case 'char-to-pinyin': return '汉字写拼音'
      default: return ''
    }
  }

  const handleSubmit = () => {
    if (showResult) return // 防止重复提交
    
    let correct = false
    
    if (question.type === 'fill-blank') {
      correct = selectedOption === question.answer
    } else if (question.type === 'pinyin-to-char') {
      correct = userAnswer.trim() === question.answer
    } else if (question.type === 'char-to-pinyin') {
      correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase()
    }

    if (correct) {
      answerCorrect()
      setShowResult(true)
      // 答案正确，3秒后自动进入下一题
      setTimeout(() => {
        handleNext()
      }, 3000)
    } else {
      answerWrong()
      setShowResult(true)
      // 答案错误，6秒后自动进入下一题
      setTimeout(() => {
        handleNext()
      }, 6000)
    }
  }

  const handleNext = () => {
    setUserAnswer('')
    setSelectedOption('')
    setShowResult(false)
    setStory(null)
    setShowCanvas(false)
    setStrokes([])
    setCurrentStroke([])
    nextQuestion()
  }

  // 手写识别功能
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    
    let clientX: number, clientY: number
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 手写时禁止页面滚动
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    setIsDrawing(true)
    const coords = getCanvasCoords(e)
    setCurrentStroke([coords])
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const coords = getCanvasCoords(e)
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.beginPath()
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1]
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    }
    
    setCurrentStroke([...currentStroke, coords])
  }

  const endDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // 恢复页面滚动
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentStroke.length > 0) {
      setStrokes([...strokes, currentStroke])
    }
    setCurrentStroke([])
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    // 白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    
    // 外框 - 红色
    ctx.strokeStyle = '#C83C23'
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, width - 4, height - 4)
    
    // 田字格线 - 浅色
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    
    // 竖中线
    ctx.beginPath()
    ctx.moveTo(width / 2, 5)
    ctx.lineTo(width / 2, height - 5)
    ctx.stroke()
    
    // 横中线
    ctx.beginPath()
    ctx.moveTo(5, height / 2)
    ctx.lineTo(width - 5, height / 2)
    ctx.stroke()
    
    ctx.setLineDash([])
    
    // 如果有笔画，重新绘制
    if (strokes.length > 0 || currentStroke.length > 0) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      const allStrokes = [...strokes, ...(currentStroke.length > 0 ? [currentStroke] : [])]
      
      allStrokes.forEach(stroke => {
        if (stroke.length < 2) return
        ctx.beginPath()
        ctx.moveTo(stroke[0].x, stroke[0].y)
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y)
        }
        ctx.stroke()
      })
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    drawGrid(ctx, canvas.width, canvas.height)
    setStrokes([])
    setCurrentStroke([])
  }

  const recognizeHandwriting = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    setIsRecognizing(true)
    
    try {
      // 获取图片Base64
      const dataUrl = canvas.toDataURL('image/png')
      
      // 调用百度OCR后端服务（使用服务器IP地址，支持局域网访问）
      const response = await fetch('http://192.168.1.113:5000/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
        signal: AbortSignal.timeout(30000)
      })
      
      const result = await response.json()
      
      if (result.success && result.text) {
        // 提取第一个汉字
        const chars = result.text.match(/[\u4e00-\u9fff]/g) || []
        if (chars.length > 0) {
          setUserAnswer(chars[0])
          setShowCanvas(false)
          setIsRecognizing(false)
          return
        }
      }
      
      // 识别失败
      alert(result.error || '未能识别到汉字，请书写更清晰')
    } catch (err) {
      console.error('OCR识别错误:', err)
      alert('识别服务连接失败，请确保后端服务运行中')
    }
    
    setIsRecognizing(false)
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'fill-blank':
        return (
          <div style={styles.questionContainer}>
            <p style={styles.questionText}>{question.content}</p>
            <div style={styles.options}>
              {question.options?.map((opt, idx) => (
                <button
                  key={idx}
                  style={{
                    ...styles.optionButton,
                    ...(selectedOption === opt ? styles.optionSelected : {}),
                    ...(showResult && opt === question.answer ? styles.optionCorrect : {}),
                    ...(showResult && selectedOption === opt && opt !== question.answer ? styles.optionWrong : {}),
                  }}
                  onClick={() => !showResult && setSelectedOption(opt)}
                  disabled={showResult}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )
      case 'pinyin-to-char':
        return (
          <div style={styles.questionContainer}>
            <p style={styles.questionLabel}>请写出对应的汉字：</p>
            <p style={styles.pinyin}>{getProcessedPinyin(question.content)}</p>
            {showHint && question.char && (
              <p style={styles.hintText}>💡 提示：部首"{question.char}"相关</p>
            )}
            
            {/* 输入框和手写按钮 */}
            <div style={styles.inputRow}>
              <input
                type="text"
                style={{...styles.input, flex: 1}}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="输入汉字"
                disabled={showResult}
              />
              <button 
                style={styles.handwriteBtn}
                onClick={() => setShowCanvas(!showCanvas)}
              >
                ✍️ 手写
              </button>
            </div>

            {/* 手写识别区域 */}
            {showCanvas && (
              <div style={styles.canvasWrapper}>
                <canvas
                  ref={canvasRef}
                  width={350}
                  height={120}
                  style={styles.canvas}
                  onMouseDown={(e) => startDrawing(e)}
                  onMouseMove={(e) => draw(e)}
                  onMouseUp={(e) => endDrawing(e)}
                  onMouseLeave={(e) => endDrawing(e)}
                  onTouchStart={(e) => startDrawing(e)}
                  onTouchMove={(e) => draw(e)}
                  onTouchEnd={(e) => endDrawing(e)}
                />
                <div style={styles.canvasActions}>
                  <button 
                    style={styles.canvasBtn} 
                    onClick={clearCanvas}
                  >
                    🗑️ 清除
                  </button>
                  <button 
                    style={{...styles.canvasBtn, ...styles.canvasBtnPrimary}} 
                    onClick={recognizeHandwriting}
                    disabled={isRecognizing}
                  >
                    {isRecognizing ? '识别中...' : '🔍 识别'}
                  </button>
                </div>
                <p style={styles.canvasHint}>在方格内书写汉字</p>
              </div>
            )}

            {showResult && (
              <p style={styles.answerText}>正确答案：{question.answer}</p>
            )}
          </div>
        )
      case 'char-to-pinyin':
        return (
          <div style={styles.questionContainer}>
            <p style={styles.questionLabel}>请写出对应的拼音：</p>
            <p style={styles.char}>{question.content}</p>
            <input
              type="text"
              style={styles.input}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="输入拼音，如：zhōng guó"
              disabled={showResult}
            />
            {showResult && (
              <p style={styles.answerText}>正确拼音：{question.answer}</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => navigate('/')} 
          style={styles.backBtn}
        >
          ←
        </button>
        <div style={styles.stat}>
          <span>❤️</span> {state.lives}
        </div>
        <div style={styles.stat}>
          <span>🏆</span> {state.score}分
        </div>
        <div style={styles.stat}>
          <span>🔥</span> {state.streak}连击
        </div>
        <div style={styles.stat}>
          关卡 {state.level}
        </div>
      </div>

      {/* 显示当前闯关类型 */}
      <div style={styles.categoryBanner}>
        📋 {currentCategory?.label || '混合闯关'} · {getQuestionTypeLabel(question.type)}
        {countdown !== null && (
          <span style={styles.countdownTimer}>
            ⏱️ {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </span>
        )}
      </div>

      {/* 倒计时提醒弹窗 */}
      {showCountdownAlert && (
        <div style={styles.countdownAlert}>
          {alertMessage}
        </div>
      )}

      <div style={styles.progress}>
        <div style={{...styles.progressBar, width: `${(state.questionIndex / state.totalQuestions) * 100}%`}} />
      </div>

      <div style={styles.content}>
        {renderQuestion()}

        {showResult && story && (
          <div style={styles.storyCard}>
            <h3 style={styles.storyTitle}>📖 {story.char} 的故事</h3>
            <p><strong>拼音：</strong>{story.pinyin}</p>
            <p><strong>含义：</strong>{story.meaning}</p>
            <p><strong>字源：</strong>{story.origin}</p>
            <p><strong>甲骨文：</strong>{story.oracle}</p>
            <p><strong>常见词：</strong>{story.words.join('、')}</p>
            <p><strong>例句：</strong>{story.sentence}</p>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        {!showResult ? (
          <button
            style={styles.submitButton}
            onClick={handleSubmit}
            disabled={question.type === 'fill-blank' ? !selectedOption : !userAnswer.trim()}
          >
            提交答案
          </button>
        ) : (
          <button style={styles.nextButton} onClick={handleNext}>
            {state.questionIndex >= state.totalQuestions ? '进入下一关' : '继续'}
          </button>
        )}
      </div>
    </div>
  )
}

function GameOver({ score }: { score: number }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  const handleSave = () => {
    // 保存到排行榜的逻辑在 context 中已处理
    navigate('/')
  }

  return (
    <div style={styles.gameOverContainer}>
      <h1 style={styles.gameOverTitle}>😢 游戏结束</h1>
      <p style={styles.finalScore}>最终得分：<span>{score}</span> 分</p>
      <input
        type="text"
        style={styles.nameInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        placeholder="输入你的名字"
        maxLength={10}
      />
      <button style={styles.saveButton} onClick={handleSave}>
        保存成绩
      </button>
      <button style={styles.restartButton} onClick={() => navigate('/')}>
        返回首页
      </button>
    </div>
  )
}

function LevelComplete({ level }: { level: number }) {
  const navigate = useNavigate()
  
  return (
    <div style={styles.levelCompleteContainer}>
      <h1 style={styles.levelCompleteTitle}>🎉 恭喜通关！</h1>
      <p style={styles.levelText}>第 {level} 关已完成</p>
      <button style={styles.nextLevelButton} onClick={() => navigate('/')}>
        进入第 {level + 1} 关
      </button>
      <button style={styles.homeButton} onClick={() => navigate('/')}>
        返回首页
      </button>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '15px',
    background: 'var(--header-bg, #C83C23)',
    color: 'white',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px 15px',
  },
  stat: {
    fontSize: '16px',
  },
  categoryBanner: {
    textAlign: 'center',
    padding: '10px',
    background: 'var(--banner-bg, #FFF5F3)',
    color: 'var(--primary-color, #C83C23)',
    fontSize: '14px',
    borderBottom: '1px solid var(--border-color, #C83C23)',
  },
  countdownTimer: {
    display: 'inline-block',
    marginLeft: '15px',
    padding: '5px 15px',
    background: '#ff4444',
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  countdownAlert: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255, 68, 68, 0.95)',
    color: 'white',
    padding: '30px 50px',
    borderRadius: '20px',
    fontSize: '32px',
    fontWeight: 'bold',
    zIndex: 9999,
    animation: 'fadeIn 0.3s',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  progress: {
    width: '100%',
    height: '8px',
    background: '#eee',
  },
  progressBar: {
    height: '100%',
    background: 'var(--primary-color, #C83C23)',
    transition: 'width 0.3s',
  },
  content: {
    flex: 1,
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto',
  },
  questionContainer: {
    background: 'var(--card-bg, white)',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  questionText: {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '25px',
    color: 'var(--text-color, #333)',
  },
  questionLabel: {
    fontSize: '18px',
    color: 'var(--text-color, #333)',
    marginBottom: '15px',
  },
  pinyin: {
    fontSize: '28px',
    color: 'var(--primary-color, #C83C23)',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: 'var(--font-family)',
  },
  hintText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '15px',
    fontStyle: 'italic',
  },
  char: {
    fontSize: '48px',
    color: 'var(--primary-color, #C83C23)',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: 'var(--font-family)',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  optionButton: {
    fontSize: '20px',
    padding: '20px',
    background: 'var(--card-bg, white)',
    color: 'var(--text-color, #333)',
    border: '2px solid var(--border-color, #C83C23)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  optionSelected: {
    background: 'var(--button-bg, #C83C23)',
    color: 'var(--button-color, white)',
  },
  optionCorrect: {
    background: '#4CAF50',
    color: 'white',
    borderColor: '#4CAF50',
  },
  optionWrong: {
    background: '#f44336',
    color: 'white',
    borderColor: '#f44336',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '20px',
    border: '2px solid var(--border-color, #C83C23)',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '15px',
    background: 'var(--input-bg, white)',
    color: 'var(--text-color, #333)',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '15px',
  },
  handwriteBtn: {
    padding: '15px 20px',
    background: 'var(--banner-bg, #FFF5F3)',
    color: 'var(--primary-color, #C83C23)',
    border: '2px solid var(--border-color, #C83C23)',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  canvasWrapper: {
    background: 'var(--card-bg)',
    borderRadius: '15px',
    padding: '15px',
    marginBottom: '15px',
    marginTop: '10px',
  },
  canvas: {
    width: '100%',
    height: '300px',
    border: '3px solid var(--border-color, #C83C23)',
    borderRadius: '10px',
    cursor: 'crosshair',
    display: 'block',
    background: 'var(--input-bg, white)',
    touchAction: 'none' as any,
    userSelect: 'none' as any,
    overscrollBehavior: 'none' as any,
  },
  canvasActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  canvasBtn: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  canvasBtnPrimary: {
    background: 'var(--button-bg, #C83C23)',
    color: 'var(--button-color, white)',
  },
  canvasHint: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
    marginTop: '8px',
  },
  answerText: {
    fontSize: '18px',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: '15px',
  },
  storyCard: {
    width: '100%',
    maxWidth: '500px',
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    animation: 'fadeIn 0.5s',
  },
  storyTitle: {
    fontSize: '24px',
    color: '#C83C23',
    marginBottom: '15px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '10px',
  },
  footer: {
    padding: '20px',
    textAlign: 'center',
    marginTop: '-5px',
  },
  submitButton: {
    fontSize: '20px',
    padding: '15px 50px',
    background: 'var(--button-bg, #C83C23)',
    color: 'var(--button-color, white)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  nextButton: {
    fontSize: '20px',
    padding: '15px 50px',
    background: 'var(--button-bg, #4CAF50)',
    color: 'var(--button-color, white)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  gameOverContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    padding: '20px',
  },
  gameOverTitle: {
    fontSize: '48px',
    color: '#C83C23',
    marginBottom: '20px',
  },
  finalScore: {
    fontSize: '24px',
    marginBottom: '30px',
  },
  nameInput: {
    padding: '15px',
    fontSize: '18px',
    border: '2px solid #C83C23',
    borderRadius: '10px',
    marginBottom: '20px',
    width: '200px',
    textAlign: 'center',
  },
  saveButton: {
    fontSize: '18px',
    padding: '15px 40px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  restartButton: {
    fontSize: '18px',
    padding: '15px 40px',
    background: 'white',
    color: '#C83C23',
    border: '2px solid #C83C23',
    borderRadius: '50px',
    cursor: 'pointer',
  },
  levelCompleteContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    padding: '20px',
  },
  levelCompleteTitle: {
    fontSize: '48px',
    color: '#C83C23',
    marginBottom: '20px',
  },
  levelText: {
    fontSize: '24px',
    marginBottom: '30px',
  },
  nextLevelButton: {
    fontSize: '20px',
    padding: '15px 50px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  homeButton: {
    fontSize: '18px',
    padding: '15px 40px',
    background: 'white',
    color: '#C83C23',
    border: '2px solid #C83C23',
    borderRadius: '50px',
    cursor: 'pointer',
  },
}
