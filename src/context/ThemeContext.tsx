import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, THEMES, DEFAULT_THEME } from '../data/themes'
import { getThemeId, setThemeId } from '../utils/storage'

interface ThemeContextType {
  theme: Theme
  themeId: string
  setTheme: (id: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>('default')
  
  useEffect(() => {
    const savedId = getThemeId()
    setThemeIdState(savedId)
  }, [])
  
  const theme = THEMES.find(t => t.id === themeId) || DEFAULT_THEME
  
  const setTheme = (id: string) => {
    setThemeIdState(id)
    setThemeId(id)
  }
  
  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export { THEMES } from '../data/themes'