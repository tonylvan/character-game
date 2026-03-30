import { useNavigate } from 'react-router-dom'
import { getUserData, getCharErrorRanking, getRanking } from '../utils/storage'

export default function ProgressReport() {
  const navigate = useNavigate()
  const userData = getUserData()
  const errorRanking = getCharErrorRanking()
  const ranking = getRanking()
  
  // 计算学习数据
  const uniqueWrong = errorRanking.length
  const myRank = ranking.findIndex(r => r.name === userData.userName) + 1
  
  // 计算掌握程度
  const masterLevel = userData.level <= 3 ? '🌱 入门级' :
                      userData.level <= 6 ? '📚 进阶级' :
                      userData.level <= 9 ? '🎓 熟练级' : '🏆 大师级'

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 学习进度报告</h2>

      {/* 学习概览 */}
      <div style={styles.overview}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.userName}>{userData.userName}</div>
          <div style={styles.masterLevel}>{masterLevel}</div>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏆</div>
            <div style={styles.statValue}>{userData.score}</div>
            <div style={styles.statLabel}>总积分</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📈</div>
            <div style={styles.statValue}>{userData.level}</div>
            <div style={styles.statLabel}>当前关卡</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>❌</div>
            <div style={styles.statValue}>{uniqueWrong}</div>
            <div style={styles.statLabel}>错字数</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📝</div>
            <div style={styles.statValue}>{userData.wrongQuestions.length}</div>
            <div style={styles.statLabel}>错题数</div>
          </div>
        </div>
      </div>

      {/* 掌握情况 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 知识点掌握</h3>
        <div style={styles.progressList}>
          <div style={styles.progressItem}>
            <span>拼音书写</span>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${Math.min(100, (userData.level / 10) * 100)}%`}} />
            </div>
          </div>
          <div style={styles.progressItem}>
            <span>汉字认知</span>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${Math.min(100, (userData.level / 8) * 100)}%`}} />
            </div>
          </div>
          <div style={styles.progressItem}>
            <span>成语理解</span>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${Math.min(100, (userData.level / 6) * 100)}%`}} />
            </div>
          </div>
          <div style={styles.progressItem}>
            <span>古诗背诵</span>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${Math.min(100, (userData.level / 5) * 100)}%`}} />
            </div>
          </div>
        </div>
      </div>

      {/* 薄弱环节 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚠️ 需要加强的字 TOP 5</h3>
        {errorRanking.length === 0 ? (
          <p style={styles.empty}>暂无错字记录，继续加油！</p>
        ) : (
          <div style={styles.weakList}>
            {errorRanking.slice(0, 5).map((item, idx) => (
              <div key={item.char} style={styles.weakItem}>
                <span style={styles.weakRank}>{idx + 1}</span>
                <span style={styles.weakChar}>{item.char}</span>
                <div style={styles.weakProgress}>
                  <div style={{...styles.weakFill, width: `${Math.min(100, item.count * 20)}%`}} />
                </div>
                <span style={styles.weakCount}>错{item.count}次</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 学习建议 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💡 学习建议</h3>
        <div style={styles.tips}>
          {uniqueWrong > 10 ? (
            <p>🔴 你需要加强练习错字本中的汉字，每天复习10分钟会有进步！</p>
          ) : uniqueWrong > 5 ? (
            <p>🟡 继续加油！建议每天花5分钟复习错字本。</p>
          ) : (
            <p>🟢 你表现很棒！保持每天学习，积累更多词汇。</p>
          )}
          {myRank > 0 && <p>🏅 当前排行榜第{myRank}名，继续努力！</p>}
        </div>
      </div>

      {/* 今日任务 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 今日任务</h3>
        <div style={styles.tasks}>
          <div style={styles.task}>
            <span style={styles.taskCheck}>☐</span>
            <span>完成5道闯关题</span>
          </div>
          <div style={styles.task}>
            <span style={styles.taskCheck}>☐</span>
            <span>复习3个错字</span>
          </div>
          <div style={styles.task}>
            <span style={styles.taskCheck}>☐</span>
            <span>学习1个新汉字故事</span>
          </div>
        </div>
      </div>

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
    marginBottom: '20px',
  },
  overview: {
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  avatar: {
    fontSize: '60px',
    marginBottom: '10px',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  masterLevel: {
    fontSize: '16px',
    color: '#C83C23',
    marginTop: '5px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  statCard: {
    background: '#FFF5F3',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  section: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#C83C23',
    marginBottom: '15px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '10px',
  },
  progressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  progressItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  progressBar: {
    flex: 1,
    height: '10px',
    background: '#eee',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #C83C23, #F5A623)',
    borderRadius: '5px',
    transition: 'width 0.5s',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
  weakList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  weakItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#FFF5F3',
    borderRadius: '10px',
  },
  weakRank: {
    width: '24px',
    height: '24px',
    background: '#C83C23',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  weakChar: {
    fontSize: '28px',
    fontFamily: '"Noto Serif SC", serif',
    width: '40px',
  },
  weakProgress: {
    flex: 1,
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
  },
  weakFill: {
    height: '100%',
    background: '#f44336',
    borderRadius: '4px',
  },
  weakCount: {
    fontSize: '14px',
    color: '#666',
    minWidth: '60px',
    textAlign: 'right',
  },
  tips: {
    fontSize: '16px',
    color: '#333',
    lineHeight: 1.8,
  },
  tasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  task: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '10px',
    fontSize: '16px',
  },
  taskCheck: {
    fontSize: '20px',
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