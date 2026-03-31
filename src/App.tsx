import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import WrongWords from './pages/WrongWords'
import My from './pages/My'
import Learn from './pages/Learn'
import CharDetail from './pages/CharDetail'
import OCRScan from './pages/OCRScan'
import HandwritingBoard from './pages/HandwritingBoard'
import ProgressReport from './pages/ProgressReport'
import ParentalControl from './pages/ParentalControl'
import LearnIdioms from './pages/LearnIdioms'
import LearnPoetry from './pages/LearnPoetry'
import SignIn from './pages/SignIn'
import Achievements from './pages/Achievements'
import { GameProvider } from './context/GameContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useEffect } from 'react'

// 应用主题样式的组件
function ThemeStyles() {
  const { theme } = useTheme()
  
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primaryColor)
    root.style.setProperty('--secondary-color', theme.secondaryColor)
    root.style.setProperty('--bg-color', theme.background)
    root.style.setProperty('--bg-gradient', theme.backgroundGradient)
    root.style.setProperty('--card-bg', theme.cardBg)
    root.style.setProperty('--text-color', theme.textColor)
    root.style.setProperty('--border-color', theme.borderColor)
    root.style.setProperty('--font-family', theme.fontFamily)
    root.style.setProperty('--button-bg', theme.buttonBg)
    root.style.setProperty('--button-color', theme.buttonColor)
    root.style.setProperty('--button-hover', theme.buttonHover)
    root.style.setProperty('--header-bg', theme.headerBg)
    root.style.setProperty('--banner-bg', theme.bannerBg)
    root.style.setProperty('--input-bg', theme.inputBg)
  }, [theme])
  
  return null
}

function AppContent() {
  return (
    <>
      <ThemeStyles />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/wrong-words" element={<WrongWords />} />
        <Route path="/my" element={<My />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:char" element={<CharDetail />} />
        <Route path="/learn-idioms" element={<LearnIdioms />} />
        <Route path="/learn-poetry" element={<LearnPoetry />} />
        <Route path="/ocr" element={<OCRScan />} />
        <Route path="/handwriting" element={<HandwritingBoard />} />
        <Route path="/progress" element={<ProgressReport />} />
        <Route path="/parent" element={<ParentalControl />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  )
}

export default App