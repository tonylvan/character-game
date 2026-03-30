import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IDIOMS } from '../data/idioms'

export default function LearnIdioms() {
  const navigate = useNavigate()
  const [selectedIdiom, setSelectedIdiom] = useState<typeof IDIOMS[0] | null>(null)
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all')

  const filteredIdioms = filterGrade === 'all' 
    ? IDIOMS 
    : IDIOMS.filter(idiom => idiom.grade === filterGrade)

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 学成语</h2>

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

      {/* 成语列表 */}
      <div style={styles.idiomList}>
        {filteredIdioms.map((idiom) => (
          <div
            key={idiom.id}
            style={styles.idiomCard}
            onClick={() => setSelectedIdiom(idiom)}
          >
            <div style={styles.idiomTitle}>{idiom.idiom}</div>
            <div style={styles.idiomPinyin}>{idiom.pinyin}</div>
            <div style={styles.idiomMeaning}>{idiom.meaning}</div>
          </div>
        ))}
      </div>

      {/* 成语详情弹窗 */}
      {selectedIdiom && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedIdiom(null)}
        >
          <div
            style={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>{selectedIdiom.idiom}</h3>
            <p style={styles.modalPinyin}>{selectedIdiom.pinyin}</p>
            
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📖 释义</h4>
              <p style={styles.sectionContent}>{selectedIdiom.meaning}</p>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📜 成语故事</h4>
              <p style={styles.sectionContent}>{selectedIdiom.story}</p>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📚 出处</h4>
              <p style={styles.sectionContent}>{selectedIdiom.source}</p>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>✍️ 例句</h4>
              <p style={styles.sectionContent}>{selectedIdiom.example}</p>
            </div>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedIdiom(null)}
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
  idiomList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  idiomCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  idiomTitle: {
    fontSize: '24px',
    color: '#C83C23',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  idiomPinyin: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  idiomMeaning: {
    fontSize: '14px',
    color: '#333',
    lineHeight: 1.6,
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
  modalPinyin: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '20px',
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
