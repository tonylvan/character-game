import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import charStories from '../data/charStories'
import { LearnCategory } from '../types'

// 学习分类配置
const LEARN_CATEGORIES: { value: LearnCategory; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: '📚' },
  { value: 'by-pinyin', label: '按拼音', icon: '🔤' },
  { value: 'by-level', label: '按难度', icon: '📊' },
  { value: 'by-stroke', label: '按笔画', icon: '✏️' },
  { value: 'favorites', label: '收藏', icon: '⭐' },
]

// 笔画数估算
const strokeCounts: { [char: string]: number } = {
  '添': 11, '兔': 8, '牢': 7, '铃': 10, '剑': 9, '数': 13, '珠': 10,
  '竹': 6, '睛': 12, '琴': 12, '厉': 5, '流': 10, '焕': 11, '哭': 10,
  '成': 6, '屈': 8, '贻': 9, '走': 7, '班': 10, '画': 8, '明': 8,
  '春': 9, '黄': 11, '人': 2, '李': 7, '学': 8, '中': 4, '水': 4,
  '长': 4, '飞': 3, '电': 5, '工': 3, '语': 9, '文': 4, '刻': 8,
  '井': 4, '亡': 3, '掩': 11, '鹬': 21, '参': 8, '矫': 11, '幅': 12,
  '源': 13, '糖': 16, '缘': 12, '枉': 8, '凭': 8, '呕': 7, '摧': 14,
}

export default function Learn() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<LearnCategory>('all')

  // 按拼音首字母分组
  const byPinyinGroups = useMemo(() => {
    const groups: { [key: string]: typeof charStories } = {}
    charStories.forEach(story => {
      const initial = story.pinyin.charAt(0).toUpperCase()
      if (!groups[initial]) groups[initial] = []
      groups[initial].push(story)
    })
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  // 按难度分组
  const byLevelGroups = useMemo(() => {
    const groups: { [key: number]: typeof charStories } = {}
    charStories.forEach((story, idx) => {
      const level = idx < 10 ? 1 : idx < 20 ? 2 : idx < 30 ? 3 : 4
      if (!groups[level]) groups[level] = []
      groups[level].push(story)
    })
    return Object.entries(groups).map(([level, stories]) => ({ 
      level: parseInt(level), 
      stories 
    }))
  }, [])

  // 过滤汉字
  const filteredStories = charStories.filter(story =>
    story.char.includes(searchTerm) ||
    story.pinyin.includes(searchTerm) ||
    story.meaning.includes(searchTerm)
  )

  const renderCharCard = (story: typeof charStories[0]) => (
    <div
      key={story.char}
      style={styles.card}
      onClick={() => navigate(`/learn/${story.char}`)}
    >
      <div style={styles.char}>{story.char}</div>
      <div style={styles.pinyin}>{story.pinyin}</div>
      <div style={styles.meaning}>{story.meaning}</div>
    </div>
  )

  const renderAllCategory = () => (
    <div style={styles.grid}>
      {filteredStories.map(renderCharCard)}
    </div>
  )

  const renderByPinyin = () => (
    <div>
      {byPinyinGroups.map(([initial, stories]) => (
        <div key={initial} style={styles.group}>
          <div style={styles.groupTitle}>{initial}</div>
          <div style={styles.grid}>
            {stories.map(renderCharCard)}
          </div>
        </div>
      ))}
    </div>
  )

  const renderByLevel = () => (
    <div>
      {byLevelGroups.map(({ level, stories }) => (
        <div key={level} style={styles.group}>
          <div style={styles.groupTitle}>
            难度 {level} {level === 1 ? '⭐' : level === 2 ? '⭐⭐' : level === 3 ? '⭐⭐⭐' : '⭐⭐⭐⭐'}
          </div>
          <div style={styles.grid}>
            {stories.map(renderCharCard)}
          </div>
        </div>
      ))}
    </div>
  )

  const renderByStroke = () => {
    const groups: { [key: string]: typeof charStories } = {
      '1-5画': [], '6-10画': [], '11-15画': [], '16画以上': []
    }
    charStories.forEach(story => {
      const strokes = strokeCounts[story.char] || 8
      if (strokes <= 5) groups['1-5画'].push(story)
      else if (strokes <= 10) groups['6-10画'].push(story)
      else if (strokes <= 15) groups['11-15画'].push(story)
      else groups['16画以上'].push(story)
    })
    return Object.entries(groups).map(([label, stories]) => (
      <div key={label} style={styles.group}>
        <div style={styles.groupTitle}>{label}</div>
        <div style={styles.grid}>
          {stories.map(renderCharCard)}
        </div>
      </div>
    ))
  }

  const renderFavorites = () => (
    <div style={styles.empty}>
      <p>⭐ 收藏功能即将推出</p>
      <p style={styles.emptyHint}>点击汉字卡片可以添加收藏</p>
    </div>
  )

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📖 汉字学习</h2>
      
      {/* 分类切换 */}
      <div style={styles.categoryTabs}>
        {LEARN_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            style={{
              ...styles.categoryTab,
              ...(selectedCategory === cat.value ? styles.categoryTabActive : {})
            }}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 搜索框 - 全部模式显示 */}
      {selectedCategory === 'all' && (
        <input
          type="text"
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索汉字、拼音或含义..."
        />
      )}

      {/* 统计信息 */}
      <div style={styles.stats}>
        <span>共 {charStories.length} 个汉字</span>
      </div>

      {/* 内容区域 */}
      <div style={styles.content}>
        {selectedCategory === 'all' && renderAllCategory()}
        {selectedCategory === 'by-pinyin' && renderByPinyin()}
        {selectedCategory === 'by-level' && renderByLevel()}
        {selectedCategory === 'by-stroke' && renderByStroke()}
        {selectedCategory === 'favorites' && renderFavorites()}
      </div>

      {selectedCategory === 'all' && filteredStories.length === 0 && (
        <div style={styles.empty}>
          <p>没有找到相关汉字</p>
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
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  categoryTab: {
    padding: '8px 16px',
    background: 'white',
    border: '2px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    background: '#C83C23',
    color: 'white',
    border: '2px solid #C83C23',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #C83C23',
    borderRadius: '50px',
    marginBottom: '15px',
    display: 'block',
    margin: '0 auto 15px',
    textAlign: 'center',
  },
  stats: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px',
  },
  content: {
    maxHeight: '60vh',
    overflow: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  group: {
    marginBottom: '25px',
  },
  groupTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#C83C23',
    padding: '10px',
    background: 'rgba(200, 60, 35, 0.1)',
    borderRadius: '10px',
    marginBottom: '15px',
    maxWidth: '800px',
    margin: '0 auto 15px',
  },
  card: {
    background: 'white',
    padding: '15px 10px',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  char: {
    fontSize: '40px',
    color: '#C83C23',
    marginBottom: '8px',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
  },
  pinyin: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '3px',
  },
  meaning: {
    fontSize: '11px',
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
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