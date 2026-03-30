import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { POETRY } from '../data/poetry'

export default function LearnPoetry() {
  const navigate = useNavigate()
  const [selectedPoetry, setSelectedPoetry] = useState<typeof POETRY[0] | null>(null)
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all')

  const filteredPoetry = filterGrade === 'all'
    ? POETRY
    : POETRY.filter(poem => poem.grade === filterGrade)

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📜 学诗歌</h2>

      {/* 年级筛选 */}
      <div style={styles.filterBar}>
        <button
          style={{
            ...styles.filterBtn,
            ...(filterGrade === 'all' ? styles.filterBtnActive : {})
          }}
          onClick={() => setFilterGrade('all')}
        >
          全部
        </button>
        <button
          style={{
            ...styles.filterBtn,
            ...(filterGrade === 4 ? styles.filterBtnActive : {})
          }}
          onClick={() => setFilterGrade(4)}
        >
          四年级
        </button>
        <button
          style={{
            ...styles.filterBtn,
            ...(filterGrade === 5 ? styles.filterBtnActive : {})
          }}
          onClick={() => setFilterGrade(5)}
        >
          五年级
        </button>
        <button
          style={{
            ...styles.filterBtn,
            ...(filterGrade === 6 ? styles.filterBtnActive : {})
          }}
          onClick={() => setFilterGrade(6)}
        >
          六年级
        </button>
      </div>

      {/* 诗歌列表 */}
      <div style={styles.poetryList}>
        {filteredPoetry.map((poem) => (
          <div
            key={poem.id}
            style={styles.poetryCard}
            onClick={() => setSelectedPoetry(poem)}
          >
            <div style={styles.poetryTitle}>{poem.title}</div>
            <div style={styles.poetryAuthor}>
              【{poem.dynasty}】{poem.author}
            </div>
            <div style={styles.poetryContent}>
              {poem.content.slice(0, 2).join('')}
              {poem.content.length > 2 ? '...' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* 诗歌详情弹窗 */}
      {selectedPoetry && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedPoetry(null)}
        >
          <div
            style={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>{selectedPoetry.title}</h3>
            <p style={styles.modalAuthor}>
              【{selectedPoetry.dynasty}】{selectedPoetry.author}
            </p>

            {/* 诗歌正文 */}
            <div style={styles.poetryText}>
              {selectedPoetry.content.map((line, idx) => (
                <div key={idx} style={styles.poetryLine}>
                  <span style={styles.lineText}>{line}</span>
                  <span style={styles.linePinyin}>{selectedPoetry.pinyin[idx]}</span>
                </div>
              ))}
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📖 译文</h4>
              <p style={styles.sectionContent}>{selectedPoetry.meaning}</p>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📜 创作背景</h4>
              <p style={styles.sectionContent}>{selectedPoetry.story}</p>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>💡 赏析</h4>
              <p style={styles.sectionContent}>{selectedPoetry.appreciation}</p>
            </div>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedPoetry(null)}
            >
              关闭
            </button>
          </div>
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
    fontSize: '32px',
    color: '#C83C23',
    textAlign: 'center',
    marginBottom: '20px',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 20px',
    background: 'white',
    border: '2px solid #C83C23',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterBtnActive: {
    background: '#C83C23',
    color: 'white',
  },
  poetryList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  poetryCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  poetryTitle: {
    fontSize: '24px',
    color: '#C83C23',
    fontWeight: 'bold',
    marginBottom: '8px',
    textAlign: 'center',
  },
  poetryAuthor: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '15px',
  },
  poetryContent: {
    fontSize: '16px',
    color: '#333',
    textAlign: 'center',
    lineHeight: 1.8,
    fontFamily: '"Noto Serif SC", serif',
  },
  modalOverlay: {
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
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '28px',
    color: '#C83C23',
    textAlign: 'center',
    marginBottom: '10px',
  },
  modalAuthor: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '20px',
  },
  poetryText: {
    background: '#FFF5F3',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  poetryLine: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  lineText: {
    display: 'block',
    fontSize: '20px',
    color: '#C83C23',
    fontWeight: 'bold',
    marginBottom: '5px',
    fontFamily: '"Noto Serif SC", serif',
  },
  linePinyin: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#C83C23',
    marginBottom: '10px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '5px',
  },
  sectionContent: {
    fontSize: '16px',
    color: '#333',
    lineHeight: 1.8,
  },
  closeBtn: {
    width: '100%',
    padding: '15px',
    background: '#C83C23',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
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
