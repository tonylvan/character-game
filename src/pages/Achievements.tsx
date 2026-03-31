import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Achievement } from '../types';
import { getAllAchievementsWithStatus, getAchievementUnlockTime, getCheckinStatus, checkin, AchievementWithStatus } from '../utils/storage';
import { ACHIEVEMENT_CATEGORIES } from '../data/achievements';

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementWithStatus | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [checkinStatus, setCheckinStatus] = useState(getCheckinStatus());
  
  useEffect(() => {
    loadAchievements();
  }, []);
  
  const loadAchievements = () => {
    const allAchievements = getAllAchievementsWithStatus();
    const withTime = allAchievements.map(a => ({
      ...a,
      unlocked: a.unlocked ?? false,
      unlockTime: a.unlocked ? getAchievementUnlockTime(a.id) : undefined,
    }));
    setAchievements(withTime as AchievementWithStatus[]);
  };
  
  const handleCheckin = () => {
    const result = checkin();
    if (result.success) {
      setCheckinStatus(getCheckinStatus());
      if (result.newlyUnlocked.length > 0) {
        setNewlyUnlocked(result.newlyUnlocked);
      }
      loadAchievements();
    }
  };
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  // 格式化解锁时间
  const formatUnlockTime = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 关闭新解锁提示
  const closeNewlyUnlocked = () => {
    setNewlyUnlocked([]);
  };
  
  return (
    <div style={styles.container}>
      {/* 头部 */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1 style={styles.title}>🏆 成就徽章</h1>
        <div style={styles.progress}>
          <span style={styles.progressText}>已解锁 {unlockedCount}/{totalCount}</span>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${(unlockedCount / totalCount) * 100}%`,
            }} />
          </div>
        </div>
      </div>
      
      {/* 签到区域 */}
      <div style={styles.checkinSection}>
        <div style={styles.checkinInfo}>
          <span style={styles.checkinIcon}>📅</span>
          <div style={styles.checkinStats}>
            <span style={styles.checkinLabel}>连续签到</span>
            <span style={styles.checkinValue}>{checkinStatus.streak} 天</span>
          </div>
        </div>
        <button 
          style={{
            ...styles.checkinButton,
            ...(checkinStatus.todayChecked ? styles.checkinButtonDisabled : {}),
          }}
          onClick={handleCheckin}
          disabled={checkinStatus.todayChecked}
        >
          {checkinStatus.todayChecked ? '✓ 今日已签到' : '立即签到'}
        </button>
      </div>
      
      {/* 分类筛选 */}
      <div style={styles.categoryTabs}>
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryTab,
              ...(selectedCategory === cat.id ? styles.categoryTabActive : {}),
            }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span style={styles.categoryName}>{cat.name}</span>
          </button>
        ))}
      </div>
      
      {/* 成就列表 */}
      <div style={styles.achievementList}>
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            style={{
              ...styles.achievementCard,
              ...(achievement.unlocked ? styles.achievementCardUnlocked : styles.achievementCardLocked),
            }}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div style={{
              ...styles.achievementIcon,
              ...(achievement.unlocked ? {} : styles.achievementIconLocked),
            }}>
              {achievement.icon}
            </div>
            <div style={styles.achievementInfo}>
              <span style={{
                ...styles.achievementName,
                ...(achievement.unlocked ? {} : styles.achievementNameLocked),
              }}>
                {achievement.name}
              </span>
              <span style={styles.achievementDesc}>{achievement.desc}</span>
              {achievement.unlocked && achievement.unlockTime && (
                <span style={styles.unlockTime}>解锁于 {formatUnlockTime(achievement.unlockTime)}</span>
              )}
            </div>
            <div style={styles.achievementStatus}>
              {achievement.unlocked ? (
                <span style={styles.statusUnlocked}>✓ 已解锁</span>
              ) : (
                <span style={styles.statusLocked}>🔒 未解锁</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 成就详情弹窗 */}
      {selectedAchievement && (
        <div style={styles.modalOverlay} onClick={() => setSelectedAchievement(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{
              ...styles.modalIcon,
              ...(selectedAchievement.unlocked ? {} : styles.modalIconLocked),
            }}>
              {selectedAchievement.icon}
            </div>
            <h2 style={{
              ...styles.modalTitle,
              ...(selectedAchievement.unlocked ? {} : styles.modalTitleLocked),
            }}>
              {selectedAchievement.name}
            </h2>
            <p style={styles.modalDesc}>{selectedAchievement.desc}</p>
            
            {selectedAchievement.unlocked ? (
              <div style={styles.modalUnlockInfo}>
                <span style={styles.modalUnlockBadge}>🎉 已解锁</span>
                <span style={styles.modalUnlockTime}>
                  解锁时间：{formatUnlockTime(selectedAchievement.unlockTime)}
                </span>
              </div>
            ) : (
              <div style={styles.modalCondition}>
                <span style={styles.modalConditionLabel}>解锁条件</span>
                <span style={styles.modalConditionText}>
                  {selectedAchievement.condition.type === 'questions_correct' && `答对 ${selectedAchievement.condition.value} 道题`}
                  {selectedAchievement.condition.type === 'streak' && `连续答对 ${selectedAchievement.condition.value} 题`}
                  {selectedAchievement.condition.type === 'total_score' && `累计获得 ${selectedAchievement.condition.value} 分`}
                  {selectedAchievement.condition.type === 'checkin_streak' && `连续签到 ${selectedAchievement.condition.value} 天`}
                  {selectedAchievement.condition.type === 'level' && `通过第 ${selectedAchievement.condition.value} 关`}
                </span>
              </div>
            )}
            
            <button style={styles.modalClose} onClick={() => setSelectedAchievement(null)}>
              关闭
            </button>
          </div>
        </div>
      )}
      
      {/* 新解锁成就提示 */}
      {newlyUnlocked.length > 0 && (
        <div style={styles.unlockModalOverlay} onClick={closeNewlyUnlocked}>
          <div style={styles.unlockModalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.unlockModalTitle}>🎉 成就解锁！</h2>
            <div style={styles.unlockList}>
              {newlyUnlocked.map(achievement => (
                <div key={achievement.id} style={styles.unlockItem}>
                  <span style={styles.unlockItemIcon}>{achievement.icon}</span>
                  <span style={styles.unlockItemName}>{achievement.name}</span>
                </div>
              ))}
            </div>
            <button style={styles.unlockModalClose} onClick={closeNewlyUnlocked}>
              太棒了！
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    padding: '20px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    alignSelf: 'flex-start',
    fontSize: '16px',
    padding: '10px 20px',
    background: 'white',
    color: '#C83C23',
    border: '2px solid #C83C23',
    borderRadius: '25px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  title: {
    fontSize: '32px',
    color: '#C83C23',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
    marginBottom: '10px',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    maxWidth: '300px',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    minWidth: '80px',
  },
  progressBar: {
    flex: 1,
    height: '12px',
    background: '#ddd',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #C83C23, #A52A1A)',
    borderRadius: '6px',
    transition: 'width 0.3s ease',
  },
  
  // 签到区域
  checkinSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
    padding: '15px 20px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  checkinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  checkinIcon: {
    fontSize: '32px',
  },
  checkinStats: {
    display: 'flex',
    flexDirection: 'column',
  },
  checkinLabel: {
    fontSize: '14px',
    color: '#666',
  },
  checkinValue: {
    fontSize: '24px',
    color: '#C83C23',
    fontWeight: 'bold',
  },
  checkinButton: {
    fontSize: '16px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #C83C23 0%, #A52A1A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  checkinButtonDisabled: {
    background: '#999',
    cursor: 'not-allowed',
  },
  
  // 分类筛选
  categoryTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryTab: {
    fontSize: '14px',
    padding: '8px 16px',
    background: 'white',
    color: '#666',
    border: '2px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  categoryTabActive: {
    background: '#FFF5F3',
    color: '#C83C23',
    border: '2px solid #C83C23',
  },
  categoryIcon: {
    fontSize: '16px',
  },
  categoryName: {
    fontWeight: '500',
  },
  
  // 成就列表
  achievementList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  achievementCard: {
    background: 'white',
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
  achievementCardUnlocked: {
    border: '2px solid #C83C23',
  },
  achievementCardLocked: {
    opacity: 0.6,
    background: '#f5f5f5',
  },
  achievementIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  achievementIconLocked: {
    filter: 'grayscale(100%)',
  },
  achievementInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  achievementName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  achievementNameLocked: {
    color: '#999',
  },
  achievementDesc: {
    fontSize: '12px',
    color: '#666',
  },
  unlockTime: {
    fontSize: '10px',
    color: '#888',
  },
  achievementStatus: {
    marginTop: '10px',
    fontSize: '12px',
  },
  statusUnlocked: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statusLocked: {
    color: '#999',
  },
  
  // 详情弹窗
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
    maxWidth: '350px',
    textAlign: 'center',
  },
  modalIcon: {
    fontSize: '64px',
    marginBottom: '15px',
  },
  modalIconLocked: {
    filter: 'grayscale(100%)',
  },
  modalTitle: {
    fontSize: '24px',
    color: '#C83C23',
    marginBottom: '10px',
  },
  modalTitleLocked: {
    color: '#999',
  },
  modalDesc: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  modalUnlockInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  modalUnlockBadge: {
    fontSize: '20px',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  modalUnlockTime: {
    fontSize: '14px',
    color: '#888',
  },
  modalCondition: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    padding: '15px',
    background: '#FFF5F3',
    borderRadius: '12px',
  },
  modalConditionLabel: {
    fontSize: '14px',
    color: '#C83C23',
    fontWeight: 'bold',
  },
  modalConditionText: {
    fontSize: '16px',
    color: '#333',
  },
  modalClose: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #C83C23 0%, #A52A1A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  
  // 新解锁提示
  unlockModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  unlockModalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    width: '90%',
    maxWidth: '350px',
    textAlign: 'center',
    animation: 'pop 0.3s ease',
  },
  unlockModalTitle: {
    fontSize: '28px',
    color: '#C83C23',
    marginBottom: '20px',
  },
  unlockList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
  },
  unlockItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#FFF5F3',
    borderRadius: '12px',
  },
  unlockItemIcon: {
    fontSize: '32px',
  },
  unlockItemName: {
    fontSize: '18px',
    color: '#C83C23',
    fontWeight: 'bold',
  },
  unlockModalClose: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #C83C23 0%, #A52A1A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '18px',
    cursor: 'pointer',
  },
};