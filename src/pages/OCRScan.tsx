import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCharError, getCharErrorRanking } from '../utils/storage'

// 百度OCR后端服务地址（使用服务器IP地址，支持局域网访问）
const OCR_SERVER_URL = 'http://192.168.1.113:9005/api/ocr'

export default function OCRScan() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [image, setImage] = useState<string | null>(null)
  const [recognizedChars, setRecognizedChars] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorLog, setErrorLog] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // 启动摄像头
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (err) {
      alert('无法访问摄像头，请确保已授权相机权限')
    }
  }

  // 停止摄像头
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  // 拍照
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setImage(dataUrl)
        stopCamera()
        processImage(dataUrl)
      }
    }
  }

  // 选择文件
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result as string
        setImage(result)
        processImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 处理图片 - 调用百度OCR后端服务
  const processImage = async (imageData: string) => {
    setIsProcessing(true)
    setProgress(50)
    setErrorLog([])
    
    try {
      // 调用百度OCR后端服务
      const response = await fetch(OCR_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })
      
      const result = await response.json()
      setProgress(100)
      
      if (result.success && result.text) {
        // 提取所有汉字
        const chineseChars = result.text.match(/[\u4e00-\u9fff]/g) || []
        
        // 去除重复，按顺序保留
        const uniqueChars: string[] = []
        chineseChars.forEach((char: string) => {
          if (!uniqueChars.includes(char)) {
            uniqueChars.push(char)
          }
        })
        
        setRecognizedChars(uniqueChars)
        
        if (uniqueChars.length > 0) {
          setErrorLog([`识别到 ${uniqueChars.length} 个汉字`])
        } else {
          setErrorLog(['未能识别到汉字，请尝试重新拍摄'])
        }
      } else {
        setErrorLog([result.error || '识别失败，请重试'])
      }
      
    } catch (err) {
      setErrorLog(['识别服务连接失败，请确保后端服务运行中'])
    }
    
    setIsProcessing(false)
  }

  // 确认添加错字
  const confirmAddErrors = () => {
    recognizedChars.forEach(char => {
      addCharError(char, 'ocr')
    })
    setErrorLog(prev => [...prev, `已添加 ${recognizedChars.length} 个汉字到错字本`])
    setRecognizedChars([])
  }

  // 手动输入错字
  const [manualInput, setManualInput] = useState('')
  
  const handleManualAdd = () => {
    const chars = manualInput.match(/[\u4e00-\u9fff]/g) || []
    chars.forEach(char => addCharError(char, 'ocr'))
    setErrorLog(prev => [...prev, `已添加 ${chars.length} 个汉字到错字本`])
    setManualInput('')
  }

  // 查看错字排行
  const errorRanking = getCharErrorRanking()

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📷 错字拍照识别</h2>

      {/* 功能说明 */}
      <div style={styles.info}>
        <p>📸 拍照或上传图片，自动识别汉字并记入错题本</p>
        <p>🔢 错字按出错次数排名，出错多的字闯关更常出现</p>
      </div>

      {/* 图片/摄像头预览 */}
      <div style={styles.previewArea}>
        {showCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={styles.video}
          />
        ) : image ? (
          <img src={image} alt="预览" style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            📷 点击下方按钮拍照或上传
          </div>
        )}
      </div>

      {/* 识别进度 */}
      {isProcessing && (
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
          <span>{progress}%</span>
        </div>
      )}

      {/* 识别结果 */}
      {recognizedChars.length > 0 && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>识别到的汉字：</h3>
          <div style={styles.charGrid}>
            {recognizedChars.map((char, idx) => (
              <span key={idx} style={styles.charBadge}>{char}</span>
            ))}
          </div>
          <button style={styles.confirmBtn} onClick={confirmAddErrors}>
            ✅ 确认添加到错字本
          </button>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => fileInputRef.current?.click()}>
          📁 上传图片
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {!showCamera ? (
          <button style={styles.btn} onClick={startCamera}>
            📷 拍照识别
          </button>
        ) : (
          <>
            <button style={styles.btn} onClick={capturePhoto}>
              🆗 拍照
            </button>
            <button style={styles.btnSecondary} onClick={stopCamera}>
              ❌ 取消
            </button>
          </>
        )}
      </div>

      {/* 手动输入 */}
      <div style={styles.manual}>
        <h3>✏️ 手动输入错字</h3>
        <div style={styles.manualInput}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="输入包含错字的词语或句子"
            style={styles.input}
          />
          <button onClick={handleManualAdd} style={styles.addBtn}>
            添加
          </button>
        </div>
      </div>

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
                <span style={styles.rankSource}>
                  {item.sources.includes('ocr') ? '📷' : ''}
                  {item.sources.includes('game') ? '🎮' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 日志显示 */}
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
  info: {
    background: 'white',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
  },
  previewArea: {
    width: '100%',
    maxWidth: '400px',
    height: '250px',
    margin: '0 auto 20px',
    borderRadius: '15px',
    overflow: 'hidden',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  placeholder: {
    color: '#999',
    fontSize: '16px',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  progressBar: {
    flex: 1,
    height: '10px',
    background: '#ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#C83C23',
    transition: 'width 0.3s',
  },
  result: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
  },
  resultTitle: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '15px',
  },
  charGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '15px',
  },
  charBadge: {
    display: 'inline-block',
    padding: '8px 15px',
    background: '#FFF5F3',
    color: '#C83C23',
    borderRadius: '20px',
    fontSize: '24px',
    fontFamily: '"Noto Serif SC", serif',
  },
  confirmBtn: {
    width: '100%',
    padding: '12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '12px 25px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '12px 25px',
    background: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  manual: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
  },
  manualInput: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #C83C23',
    borderRadius: '10px',
  },
  addBtn: {
    padding: '12px 20px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
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
    marginRight: '10px',
  },
  rankSource: {
    fontSize: '16px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
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