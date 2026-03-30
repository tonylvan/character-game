import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame, QUESTION_CATEGORIES, GRADE_LEVELS, UNIT_NUMBERS } from '../context/GameContext'
import { getRanking } from '../utils/storage'
import { QuestionCategory, GradeLevel, UnitNumber } from '../types'
import ThemeSelector from '../components/ThemeSelector'

export default function Home() {
  const navigate = useNavigate()
  const { startGame, state, setCategory, setGrade, setUnit } = useGame()
  const ranking = getRanking()
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [showUnitModal, setShowUnitModal] = useState(false)

  const handleStart = () => {
    startGame()
    navigate('/game')
  }

  const handleSelectCategory = (category: QuestionCategory) => {
    setCategory(category)
    setShowCategoryModal(false)
  }

  const handleSelectGrade = (grade: GradeLevel) => {
    setGrade(grade)
    setShowGradeModal(false)
    setUnit('all')
  }

  const handleSelectUnit = (unit: UnitNumber) => {
    setUnit(unit)
    setShowUnitModal(false)
  }

  const currentCategory = QUESTION_CATEGORIES.find(c => c.value === state.selectedCategory)
  const currentGrade = GRADE_LEVELS.find(g => g.value === state.selectedGrade)
  const currentUnit = UNIT_NUMBERS.find(u => u.value === state.selectedUnit)

  return (
    <div style={styles.container}>
      <ThemeSelector />
      <h1 style={styles.title}>汉字闯关</h1>
      <p style={styles.subtitle}>学汉字，讲故事，闯关卡</p>
      
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>当前关卡</span>
          <span style={styles.statValue}>{state.level}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>总积分</span>
          <span style={styles.statValue}>{state.score}</span>
        </div>
      </div>

      {/* 年级选择 */}
      <div style={styles.buttonRow}>
        <button 
          style={styles.categoryButton} 
          onClick={() => setShowGradeModal(true)}
        >
          🎓 {currentGrade?.label || '选择年级'} ▾
        </button>
        
        <button 
          style={{...styles.categoryButton, ...(state.selectedGrade !== 'all' ? {} : styles.categoryButtonDisabled)}} 
          onClick={() => state.selectedGrade !== 'all' && setShowUnitModal(true)}
          disabled={state.selectedGrade === 'all'}
        >
          📚 {currentUnit?.label || '选择单元'} ▾
        </button>
        
        <button 
          style={styles.categoryButton} 
          onClick={() => setShowCategoryModal(true)}
        >
          📋 {currentCategory?.label || '混合闯关'} ▾
        </button>
      </div>

      <button style={styles.startButton} onClick={handleStart}>
        🎮 开始闯关
      </button>

      <div style={styles.menu}>
        <button style={styles.menuButton} onClick={() => navigate('/learn')}>
          📖 学汉字
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/learn-idioms')}>
          📚 学成语
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/learn-poetry')}>
          📜 学诗歌
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/wrong-words')}>
          📚 错题本
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/handwriting')}>
          ✍️ 手写白板
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/ocr')}>
          📷 拍照识错字
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/progress')}>
          📊 学习报告
        </button>
        <button style={styles.menuButton} onClick={() => navigate('/parent')}>
          ⚙️ 家长管控
        </button>
      </div>

      {ranking.length > 0 && (
        <div style={styles.rankingPreview}>
          <h3>🏅 排行榜 TOP 3</h3>
          {ranking.slice(0, 3).map((item, index) => (
            <div key={index} style={styles.rankingItem}>
              <span>{index + 1}. {item.name}</span>
              <span>{item.score}分</span>
            </div>
          ))}
        </div>
      )}

      {/* 年级选择弹窗 */}
      {showGradeModal && (
        <div style={styles.modalOverlay} onClick={() => setShowGradeModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>🎓 选择年级</h2>
            <button
              style={{
                ...styles.categoryOption,
                ...(state.selectedGrade === 'all' ? styles.categoryOptionActive : {})
              }}
              onClick={() => handleSelectGrade('all')}
            >
              <span style={styles.categoryLabel}>全部年级</span>
              <span style={styles.categoryDesc}>涵盖1-6年级所有词汇</span>
            </button>
            {GRADE_LEVELS.map((grade) => (
              <button
                key={grade.value}
                style={{
                  ...styles.categoryOption,
                  ...(state.selectedGrade === grade.value ? styles.categoryOptionActive : {})
                }}
                onClick={() => handleSelectGrade(grade.value)}
              >
                <span style={styles.categoryLabel}>{grade.label}</span>
                <span style={styles.categoryDesc}>{grade.desc}</span>
              </button>
            ))}
            <button 
              style={styles.modalClose} 
              onClick={() => setShowGradeModal(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 分类选择弹窗 */}
      {showCategoryModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCategoryModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>选择闯关类型</h2>
            {QUESTION_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                style={{
                  ...styles.categoryOption,
                  ...(state.selectedCategory === cat.value ? styles.categoryOptionActive : {})
                }}
                onClick={() => handleSelectCategory(cat.value)}
              >
                <span style={styles.categoryLabel}>{cat.label}</span>
                <span style={styles.categoryDesc}>{cat.desc}</span>
              </button>
            ))}
            <button 
              style={styles.modalClose} 
              onClick={() => setShowCategoryModal(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 单元选择弹窗 */}
      {showUnitModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUnitModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>📚 选择单元</h2>
            <button
              style={{
                ...styles.categoryOption,
                ...(state.selectedUnit === 'all' ? styles.categoryOptionActive : {})
              }}
              onClick={() => handleSelectUnit('all')}
            >
              <span style={styles.categoryLabel}>全部单元</span>
              <span style={styles.categoryDesc}>该年级所有单元词汇</span>
            </button>
            {UNIT_NUMBERS.map((unit) => (
              <button
                key={unit.value}
                style={{
                  ...styles.categoryOption,
                  ...(state.selectedUnit === unit.value ? styles.categoryOptionActive : {})
                }}
                onClick={() => handleSelectUnit(unit.value)}
              >
                <span style={styles.categoryLabel}>{unit.label}</span>
                <span style={styles.categoryDesc}>四年级第{unit.value}单元词汇</span>
              </button>
            ))}
            <button 
              style={styles.modalClose} 
              onClick={() => setShowUnitModal(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    padding: '20px',
  },
  title: {
    fontSize: '48px',
    color: '#C83C23',
    marginBottom: '10px',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
  },
  stats: {
    display: 'flex',
    gap: '40px',
    marginBottom: '30px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  statValue: {
    display: 'block',
    fontSize: '32px',
    color: '#C83C23',
    fontWeight: 'bold',
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    fontSize: '16px',
    padding: '12px 20px',
    background: 'white',
    color: '#333',
    border: '2px solid #C83C23',
    borderRadius: '25px',
    cursor: 'pointer',
    minWidth: '130px',
  },
  categoryButtonDisabled: {
    background: '#f0f0f0',
    color: '#999',
    borderColor: '#ddd',
    cursor: 'not-allowed',
  },
  startButton: {
    fontSize: '24px',
    padding: '20px 60px',
    background: 'linear-gradient(135deg, #C83C23 0%, #A52A1A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(200, 60, 35, 0.4)',
    marginBottom: '30px',
  },
  menu: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    width: '100%',
    maxWidth: '400px',
  },
  menuButton: {
    fontSize: '18px',
    padding: '15px 20px',
    background: 'white',
    color: '#333',
    border: '2px solid #C83C23',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  rankingPreview: {
    marginTop: '40px',
    padding: '20px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  rankingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
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
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    width: '90%',
    maxWidth: '400px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '24px',
    color: '#C83C23',
    textAlign: 'center',
    marginBottom: '20px',
  },
  categoryOption: {
    width: '100%',
    padding: '15px 20px',
    marginBottom: '10px',
    background: '#f5f5f5',
    border: '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  categoryOptionActive: {
    background: '#FFF5F3',
    border: '2px solid #C83C23',
  },
  categoryLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  categoryDesc: {
    fontSize: '14px',
    color: '#666',
  },
  modalClose: {
    width: '100%',
    padding: '15px',
    marginTop: '10px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
}