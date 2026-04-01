import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCharError, getCharErrorRanking } from '../utils/storage'

// 百度OCR后端服务地址（使用服务器IP地址，支持局域网访问）
const OCR_SERVER_URL = 'http://192.168.1.113:5000/api/ocr'

// 手写白板组件
export default function HandwritingBoard() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([])
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [recognizedChars, setRecognizedChars] = useState<string[]>([])
  const [inputMode, setInputMode] = useState<'write' | 'text'>('write')
  const [textInput, setTextInput] = useState('')
  const [errorLog, setErrorLog] = useState<string[]>([])
  const errorRanking = getCharErrorRanking()

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 设置画布大小
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // 设置画笔样式
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // 绘制田字格背景
    drawGrid(ctx, canvas.width, canvas.height)
  }, [])

  // 绘制田字格
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    // 绘制外框
    ctx.strokeStyle = '#C83C23'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, width - 20, height - 20)
    
    // 绘制中线
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    
    // 竖中线
    ctx.beginPath()
    ctx.moveTo(width / 2, 10)
    ctx.lineTo(width / 2, height - 10)
    ctx.stroke()
    
    // 横中线
    ctx.beginPath()
    ctx.moveTo(10, height / 2)
    ctx.lineTo(width - 10, height / 2)
    ctx.stroke()
    
    ctx.setLineDash([])
  }

  // 获取坐标
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    }
  }

  // 开始绘制
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const coords = getCoords(e)
    setCurrentStroke([coords])
  }

  // 绘制中
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    const coords = getCoords(e)
    
    // 绘制当前笔画
    ctx.beginPath()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    
    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1]
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    }
    
    setCurrentStroke([...currentStroke, coords])
  }

  // 结束绘制
  const endDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    
    if (currentStroke.length > 0) {
      setStrokes([...strokes, currentStroke])
    }
    setCurrentStroke([])
  }

  // 清除画布
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    drawGrid(ctx, canvas.width, canvas.height)
    setStrokes([])
    setCurrentStroke([])
  }

  // 撤销上一笔
  const undo = () => {
    if (strokes.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    const newStrokes = strokes.slice(0, -1)
    setStrokes(newStrokes)
    
    // 重新绘制
    drawGrid(ctx, canvas.width, canvas.height)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    
    newStrokes.forEach(stroke => {
      if (stroke.length < 2) return
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.stroke()
    })
  }

  // 识别笔画 - 调用百度OCR后端服务
  const recognizeStrokes = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    setErrorLog(['🔍 正在识别，请稍候...'])
    
    try {
      // 将canvas转换为base64图片
      const imageData = canvas.toDataURL('image/png')
      
      // 调用百度OCR后端服务
      const response = await fetch(OCR_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })
      
      const result = await response.json()
      
      if (result.success && result.text) {
        const chars = result.text.match(/[\u4e00-\u9fff]/g) || []
        if (chars.length > 0) {
          setRecognizedChars(chars)
          setErrorLog([`✅ 识别到：${chars.join(' ')}`])
        } else {
          setErrorLog(['⚠️ 未识别到汉字，请书写更清晰'])
        }
      } else {
        setErrorLog([`⚠️ ${result.error || '未识别到汉字，请重试'}`])
      }
    } catch (err) {
      console.error('OCR识别错误:', err)
      setErrorLog(['❌ 识别服务连接失败，请确保后端服务运行中 (python ocr_server.py)'])
    }
  }

  // 文字输入模式 - 确认添加错字
  const addErrors = () => {
    const chars = inputMode === 'text' 
      ? textInput.match(/[\u4e00-\u9fff]/g) || []
      : recognizedChars
    
    chars.forEach(char => {
      addCharError(char, 'ocr')
    })
    
    if (chars.length > 0) {
      setErrorLog([`✅ 已添加 ${chars.length} 个汉字到错字本`])
      setTextInput('')
      setRecognizedChars([])
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✍️ 手写输入白板</h2>

      {/* 模式切换 */}
      <div style={styles.modeSwitch}>
        <button
          style={{...styles.modeBtn, ...(inputMode === 'write' ? styles.modeBtnActive : {})}}
          onClick={() => setInputMode('write')}
        >
          ✍️ 手写模式
        </button>
        <button
          style={{...styles.modeBtn, ...(inputMode === 'text' ? styles.modeBtnActive : {})}}
          onClick={() => setInputMode('text')}
        >
          ⌨️ 文字输入
        </button>
      </div>

      {inputMode === 'write' ? (
        <>
          {/* 手写区域 */}
          <div style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              style={styles.canvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
            <div style={styles.hint}>在此处书写汉字</div>
          </div>

          {/* 操作按钮 */}
          <div style={styles.actions}>
            <button style={styles.btn} onClick={undo}>↩️ 撤销</button>
            <button style={styles.btn} onClick={clearCanvas}>🗑️ 清除</button>
            <button style={styles.btnPrimary} onClick={recognizeStrokes}>🔍 识别</button>
          </div>
        </>
      ) : (
        <>
          {/* 文字输入区域 */}
          <div style={styles.textInputContainer}>
            <textarea
              style={styles.textInput}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="输入包含错字的词语或句子..."
              rows={3}
            />
            <p style={styles.textHint}>直接输入或粘贴带错字的句子</p>
          </div>

          {/* 提取的汉字预览 */}
          {(textInput.match(/[\u4e00-\u9fff]/g) || []).length > 0 && (
            <div style={styles.preview}>
              <span style={styles.previewLabel}>识别到的汉字：</span>
              {textInput.match(/[\u4e00-\u9fff]/g)?.map((char, idx) => (
                <span key={idx} style={styles.charBadge}>{char}</span>
              ))}
            </div>
          )}

          <button 
            style={styles.btnPrimary} 
            onClick={addErrors}
            disabled={!textInput.match(/[\u4e00-\u9fff]/g)}
          >
            ✅ 确认添加到错字本
          </button>
        </>
      )}

      {/* 错字排行榜 */}
      <div style={styles.ranking}>
        <h3>📊 错字排行榜 TOP 10</h3>
        {errorRanking.length === 0 ? (
          <p style={styles.empty}>暂无错字记录</p>
        ) : (
          <div style={styles.rankingList}>
            {errorRanking.slice(0, 10).map((item, idx) => (
              <div key={item.char} style={styles.rankingItem}>
                <span style={styles.rankNum}>{idx + 1}</span>
                <span style={styles.rankChar}>{item.char}</span>
                <span style={styles.rankCount}>×{item.count}</span>
              </div>
            ))}
          </div>
        )}

        <button 
          style={styles.clearBtn}
          onClick={() => {
            if (confirm('确定清空所有错字记录吗？')) {
              localStorage.removeItem('chinese-character-game')
              setErrorLog(['已清空所有记录'])
            }
          }}
        >
          🗑️ 清空记录
        </button>
      </div>

      {/* 识别结果 - 显示在错字排行榜上方 */}
      {recognizedChars.length > 0 && (
        <div style={styles.recognizedResult}>
          <h3 style={styles.resultTitle}>✍️ 识别结果</h3>
          <div style={styles.recognizedChars}>
            {recognizedChars.map((char, idx) => (
              <span key={idx} style={styles.recognizedChar}>{char}</span>
            ))}
          </div>
          <button 
            style={styles.addResultBtn} 
            onClick={() => {
              recognizedChars.forEach(char => addCharError(char, 'ocr'))
              setErrorLog([`✅ 已添加 ${recognizedChars.length} 个汉字到错字本`])
              setRecognizedChars([])
            }}
          >
            ✅ 添加到错字本
          </button>
        </div>
      )}

      {/* 日志提示 */}
      {errorLog.length > 0 && (
        <div style={styles.log}>
          {errorLog.map((log, idx) => (
            <p key={idx}>{log}</p>
          ))}
        </div>
      )}

      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ← 返回首页
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
    fontSize: '28px',
    color: '#C83C23',
    textAlign: 'center',
    marginBottom: '15px',
  },
  modeSwitch: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  modeBtn: {
    padding: '12px 25px',
    fontSize: '16px',
    background: 'white',
    color: '#333',
    border: '2px solid #C83C23',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  modeBtnActive: {
    background: '#C83C23',
    color: 'white',
  },
  canvasContainer: {
    position: 'relative',
    background: 'white',
    borderRadius: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    maxWidth: '350px',
    height: '280px',
    display: 'block',
    margin: '0 auto',
    cursor: 'crosshair',
    touchAction: 'none',
    userSelect: 'none',
    overscrollBehavior: 'none',
    WebkitTouchCallout: 'none',
  },
  hint: {
    position: 'absolute',
    bottom: '10px',
    left: '0',
    right: '0',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  btn: {
    padding: '12px 20px',
    fontSize: '16px',
    background: 'white',
    color: '#333',
    border: '2px solid #C83C23',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '14px 30px',
    fontSize: '18px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  textInputContainer: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
  },
  textInput: {
    width: '100%',
    padding: '15px',
    fontSize: '20px',
    border: '2px solid #C83C23',
    borderRadius: '10px',
    resize: 'none',
    fontFamily: '"Noto Serif SC", serif',
  },
  textHint: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
  },
  preview: {
    background: 'white',
    padding: '15px',
    borderRadius: '15px',
    marginBottom: '20px',
  },
  previewLabel: {
    fontSize: '14px',
    color: '#666',
    display: 'block',
    marginBottom: '10px',
  },
  charBadge: {
    display: 'inline-block',
    padding: '8px 12px',
    margin: '5px',
    background: '#FFF5F3',
    color: '#C83C23',
    borderRadius: '20px',
    fontSize: '24px',
    fontFamily: '"Noto Serif SC", serif',
  },
  ranking: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
  },
  rankingList: {
    marginTop: '15px',
  },
  rankingItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  rankNum: {
    width: '30px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  rankChar: {
    flex: 1,
    fontSize: '24px',
    fontFamily: '"Noto Serif SC", serif',
  },
  rankCount: {
    fontSize: '16px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
  recognizedResult: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    marginTop: '10px',
  },
  resultTitle: {
    fontSize: '18px',
    color: '#C83C23',
    marginBottom: '15px',
    textAlign: 'center',
  },
  recognizedChars: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  recognizedChar: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#FFF5F3',
    color: '#C83C23',
    borderRadius: '20px',
    fontSize: '28px',
    fontFamily: '"Noto Serif SC", serif',
  },
  addResultBtn: {
    width: '100%',
    padding: '12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  clearBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  log: {
    background: '#FFF5F3',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    color: '#C83C23',
    fontSize: '14px',
  },
  backBtn: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '30px auto 0',
    padding: '15px',
    fontSize: '18px',
    background: 'white',
    color: '#C83C23',
    border: '2px solid #C83C23',
    borderRadius: '50px',
    cursor: 'pointer',
  },
}