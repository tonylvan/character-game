import { useParams, useNavigate } from 'react-router-dom'
import charStories from '../data/charStories'

export default function CharDetail() {
  const { char } = useParams<{ char: string }>()
  const navigate = useNavigate()
  
  const story = charStories.find(s => s.char === char)

  if (!story) {
    return (
      <div style={styles.container}>
        <p>没有找到该汉字</p>
        <button style={styles.backBtn} onClick={() => navigate('/learn')}>
          ← 返回
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.bigChar}>{story.char}</div>
        <div style={styles.pinyin}>{story.pinyin}</div>
        <div style={styles.meaning}>{story.meaning}</div>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📜 字源故事</h3>
          <p style={styles.text}>{story.origin}</p>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>🔍 甲骨文/金文</h3>
          <p style={styles.text}>{story.oracle}</p>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>💬 常见词组</h3>
          <div style={styles.words}>
            {story.words.map((word, idx) => (
              <span key={idx} style={styles.word}>{word}</span>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📝 例句</h3>
          <p style={styles.sentence}>{story.sentence}</p>
        </section>
      </div>

      <button style={styles.backBtn} onClick={() => navigate('/learn')}>
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
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  bigChar: {
    fontSize: '96px',
    color: '#C83C23',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
    marginBottom: '10px',
  },
  pinyin: {
    fontSize: '24px',
    color: '#666',
    marginBottom: '10px',
  },
  meaning: {
    fontSize: '18px',
    color: '#999',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#C83C23',
    marginBottom: '15px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '10px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
  },
  words: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  word: {
    background: '#F5F0E6',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#C83C23',
  },
  sentence: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#333',
    fontStyle: 'italic',
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
