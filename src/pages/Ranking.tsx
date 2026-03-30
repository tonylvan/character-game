import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRanking, addRanking, getUserData } from '../utils/storage'

export default function Ranking() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState(getRanking())
  const [showSubmit, setShowSubmit] = useState(false)
  const [name, setName] = useState(getUserData().userName)
  const [score, setScore] = useState(0)

  // 模拟提交分数（实际应该从游戏状态获取）
  const handleSubmit = () => {
    if (name.trim()) {
      addRanking(name.trim(), score || Math.floor(Math.random() * 1000))
      setRanking(getRanking())
      setShowSubmit(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 排行榜</h2>

      <div style={styles.list}>
        {ranking.length === 0 ? (
          <div style={styles.empty}>
            <p>暂无排行榜数据</p>
            <p>快去闯关创造记录吧！</p>
          </div>
        ) : (
          ranking.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.item,
                ...(index === 0 ? styles.first : {}),
                ...(index === 1 ? styles.second : {}),
                ...(index === 2 ? styles.third : {}),
              }}
            >
              <span style={styles.rank}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <span style={styles.name}>{item.name}</span>
              <span style={styles.score}>{item.score}分</span>
            </div>
          ))
        )}
      </div>

      <button style={styles.submitBtn} onClick={() => setShowSubmit(true)}>
        📝 提交成绩
      </button>

      {showSubmit && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>提交成绩</h3>
            <input
              type="text"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
            />
            <input
              type="number"
              style={styles.input}
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value) || 0)}
              placeholder="分数"
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowSubmit(false)}>
                取消
              </button>
              <button style={styles.confirmBtn} onClick={handleSubmit}>
                提交
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
  list: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    maxWidth: '500px',
    margin: '0 auto 30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #eee',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  first: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: 'white',
  },
  second: {
    background: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
    color: 'white',
  },
  third: {
    background: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    color: 'white',
  },
  rank: {
    fontSize: '24px',
    marginRight: '15px',
    width: '40px',
  },
  name: {
    flex: 1,
    fontSize: '18px',
  },
  score: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  submitBtn: {
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
