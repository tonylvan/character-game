import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSignInData,
  doSignIn,
  hasSignedInToday,
  getConsecutiveDays,
  calculateSignInReward,
  SIGN_IN_REWARDS,
} from '../utils/storage';
import { SignInData } from '../types';

export default function SignIn() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState<SignInData | null>(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [rewardResult, setRewardResult] = useState<{ reward: number; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getSignInData();
    setSignInData(data);
    setHasSigned(hasSignedInToday());
    setConsecutiveDays(getConsecutiveDays());
  };

  const handleSignIn = () => {
    const result = doSignIn();
    if (result.success) {
      setShowAnimation(true);
      setRewardResult({ reward: result.reward, message: result.message });
      loadData();
      
      // 3秒后隐藏动画
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
    }
  };

  // 获取下一个奖励
  const getNextReward = () => {
    for (const reward of SIGN_IN_REWARDS) {
      if (consecutiveDays < reward.streakDays) {
        return reward;
      }
    }
    return null;
  };

  const nextReward = getNextReward();
  const currentReward = calculateSignInReward(consecutiveDays);

  return (
    <div style={styles.container}>
      {/* 签到成功动画 */}
      {showAnimation && rewardResult && (
        <div style={styles.animationOverlay}>
          <div style={styles.animationContent}>
            <div style={styles.animationIcon}>🎉</div>
            <div style={styles.animationText}>签到成功！</div>
            <div style={styles.animationReward}>+{rewardResult.reward} 积分</div>
            {rewardResult.message.includes('连续') && (
              <div style={styles.animationBonus}>连续签到奖励已生效！</div>
            )}
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1 style={styles.title}>每日签到</h1>
        <div style={styles.placeholder}></div>
      </div>

      {/* 签到状态卡片 */}
      <div style={styles.mainCard}>
        <div style={styles.streakContainer}>
          <div style={styles.streakNumber}>{consecutiveDays}</div>
          <div style={styles.streakLabel}>连续签到天数</div>
        </div>

        {hasSigned ? (
          <div style={styles.signedStatus}>
            <div style={styles.signedIcon}>✓</div>
            <div style={styles.signedText}>今日已签到</div>
            <div style={styles.signedTip}>明天继续加油！</div>
          </div>
        ) : (
          <button style={styles.signInButton} onClick={handleSignIn}>
            立即签到
          </button>
        )}

        {/* 今日可获得积分 */}
        {!hasSigned && (
          <div style={styles.todayReward}>
            今日可获得：<span style={styles.rewardHighlight}>{currentReward.total} 积分</span>
            {currentReward.bonus > 0 && (
              <span style={styles.rewardBonusText}>（含连续奖励 {currentReward.bonus} 分）</span>
            )}
          </div>
        )}
      </div>

      {/* 奖励进度 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>连续签到奖励</h2>
        <div style={styles.rewardList}>
          {SIGN_IN_REWARDS.map((reward, index) => {
            const achieved = consecutiveDays >= reward.streakDays;
            const isNext = nextReward?.streakDays === reward.streakDays;
            
            return (
              <div
                key={index}
                style={{
                  ...styles.rewardItem,
                  ...(achieved ? styles.rewardItemAchieved : {}),
                  ...(isNext ? styles.rewardItemNext : {}),
                }}
              >
                <div style={styles.rewardIcon}>{achieved ? '🏆' : '🎁'}</div>
                <div style={styles.rewardInfo}>
                  <div style={styles.rewardTitle}>{reward.label}</div>
                  <div style={styles.rewardBonus}>+{reward.bonusPoints} 积分</div>
                </div>
                {achieved && <div style={styles.achievedBadge}>已达成</div>}
                {isNext && !achieved && (
                  <div style={styles.progressBadge}>
                    还差 {reward.streakDays - consecutiveDays} 天
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 签到统计 */}
      {signInData && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>签到统计</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{signInData.totalDays}</div>
              <div style={styles.statLabel}>累计签到</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{consecutiveDays}</div>
              <div style={styles.statLabel}>连续签到</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>
                {signInData.records.reduce((sum, r) => sum + r.reward, 0)}
              </div>
              <div style={styles.statLabel}>累计获得</div>
            </div>
          </div>
        </div>
      )}

      {/* 签到日历 */}
      {signInData && signInData.records.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>最近签到记录</h2>
          <div style={styles.recordList}>
            {signInData.records.slice(-7).reverse().map((record, index) => (
              <div key={index} style={styles.recordItem}>
                <div style={styles.recordDate}>{record.date}</div>
                <div style={styles.recordInfo}>
                  <span style={styles.recordStreak}>连续{record.streakAtSign}天</span>
                  <span style={styles.recordReward}>+{record.reward}分</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 规则说明 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>签到规则</h2>
        <div style={styles.rules}>
          <div style={styles.ruleItem}>📌 每日签到获得基础 <strong>10 积分</strong></div>
          <div style={styles.ruleItem}>🔥 连续签到可获得额外奖励</div>
          <div style={styles.ruleItem}>💔 断签后连续天数将重置</div>
          <div style={styles.ruleItem}>🎁 连续30天可获得100积分奖励</div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    padding: '20px',
    paddingBottom: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#C83C23',
    cursor: 'pointer',
    padding: '10px',
  },
  title: {
    fontSize: '24px',
    color: '#C83C23',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
  },
  placeholder: {
    width: '60px',
  },
  mainCard: {
    background: 'linear-gradient(135deg, #C83C23 0%, #A52A1A 100%)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(200, 60, 35, 0.3)',
  },
  streakContainer: {
    marginBottom: '20px',
  },
  streakNumber: {
    fontSize: '64px',
    fontWeight: 'bold',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  streakLabel: {
    fontSize: '16px',
    opacity: 0.9,
  },
  signedStatus: {
    padding: '20px',
  },
  signedIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  signedText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  signedTip: {
    fontSize: '14px',
    opacity: 0.8,
  },
  signInButton: {
    fontSize: '24px',
    padding: '18px 60px',
    background: 'white',
    color: '#C83C23',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  todayReward: {
    marginTop: '15px',
    fontSize: '14px',
    opacity: 0.9,
  },
  rewardHighlight: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  rewardBonusText: {
    fontSize: '12px',
  },
  section: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '15px',
    borderBottom: '2px solid #C83C23',
    paddingBottom: '10px',
  },
  rewardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rewardItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '12px',
    border: '2px solid transparent',
  },
  rewardItemAchieved: {
    background: '#FFF5F3',
    border: '2px solid #C83C23',
  },
  rewardItemNext: {
    border: '2px solid #FFB800',
    background: '#FFFBF0',
  },
  rewardIcon: {
    fontSize: '32px',
    marginRight: '15px',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  rewardBonus: {
    fontSize: '14px',
    color: '#C83C23',
  },
  achievedBadge: {
    padding: '5px 12px',
    background: '#C83C23',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
  },
  progressBadge: {
    padding: '5px 12px',
    background: '#FFB800',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
  },
  statItem: {
    textAlign: 'center',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '12px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  },
  recordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recordItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: '#f9f9f9',
    borderRadius: '10px',
  },
  recordDate: {
    fontSize: '14px',
    color: '#666',
  },
  recordInfo: {
    display: 'flex',
    gap: '15px',
  },
  recordStreak: {
    fontSize: '12px',
    color: '#999',
  },
  recordReward: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#C83C23',
  },
  rules: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  ruleItem: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  animationOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  animationContent: {
    textAlign: 'center',
    color: 'white',
  },
  animationIcon: {
    fontSize: '80px',
    animation: 'bounce 0.5s ease infinite',
  },
  animationText: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  animationReward: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: '15px',
  },
  animationBonus: {
    fontSize: '18px',
    color: '#FFB800',
    marginTop: '10px',
  },
};