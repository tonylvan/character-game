// 主题配置
export interface Theme {
  id: string
  name: string
  // 主要颜色
  primaryColor: string
  secondaryColor: string
  // 背景
  background: string
  backgroundGradient: string
  cardBg: string
  // 文字
  textColor: string
  // 边框
  borderColor: string
  // 按钮
  buttonBg: string
  buttonColor: string
  buttonHover: string
  // 特殊元素
  headerBg: string
  bannerBg: string
  inputBg: string
  fontFamily: string
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: '古典中国风',
    primaryColor: '#C83C23',
    secondaryColor: '#D4AF37',
    background: '#F5F0E6',
    backgroundGradient: 'linear-gradient(135deg, #F5F0E6 0%, #E8D5C4 100%)',
    cardBg: 'white',
    textColor: '#333',
    borderColor: '#C83C23',
    buttonBg: '#C83C23',
    buttonColor: 'white',
    buttonHover: '#A52A1A',
    headerBg: '#C83C23',
    bannerBg: '#FFF5F3',
    inputBg: 'white',
    fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif'
  },
  {
    id: 'blue',
    name: '清新蓝色',
    primaryColor: '#2563EB',
    secondaryColor: '#3B82F6',
    background: '#EFF6FF',
    backgroundGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    cardBg: 'white',
    textColor: '#1E3A8A',
    borderColor: '#2563EB',
    buttonBg: '#2563EB',
    buttonColor: 'white',
    buttonHover: '#1D4ED8',
    headerBg: '#2563EB',
    bannerBg: '#DBEAFE',
    inputBg: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif'
  },
  {
    id: 'green',
    name: '清新绿色',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    background: '#ECFDF5',
    backgroundGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    cardBg: 'white',
    textColor: '#064E3B',
    borderColor: '#059669',
    buttonBg: '#059669',
    buttonColor: 'white',
    buttonHover: '#047857',
    headerBg: '#059669',
    bannerBg: '#D1FAE5',
    inputBg: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif'
  },
  {
    id: 'purple',
    name: '优雅紫色',
    primaryColor: '#7C3AED',
    secondaryColor: '#8B5CF6',
    background: '#F5F3FF',
    backgroundGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    cardBg: 'white',
    textColor: '#4C1D95',
    borderColor: '#7C3AED',
    buttonBg: '#7C3AED',
    buttonColor: 'white',
    buttonHover: '#6D28D9',
    headerBg: '#7C3AED',
    bannerBg: '#EDE9FE',
    inputBg: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif'
  },
  {
    id: 'orange',
    name: '活力橙色',
    primaryColor: '#EA580C',
    secondaryColor: '#F97316',
    background: '#FFF7ED',
    backgroundGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    cardBg: 'white',
    textColor: '#7C2D12',
    borderColor: '#EA580C',
    buttonBg: '#EA580C',
    buttonColor: 'white',
    buttonHover: '#C2410C',
    headerBg: '#EA580C',
    bannerBg: '#FFEDD5',
    inputBg: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif'
  }
]

// 默认主题
export const DEFAULT_THEME = THEMES[0]