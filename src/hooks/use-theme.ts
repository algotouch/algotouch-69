import { useContext } from 'react'
import { ThemeContext, Theme } from '@/contexts/theme'

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    console.warn('useTheme must be used within ThemeProvider')
    return {
      theme: 'dark' as Theme,
      setTheme: () => {
        /* noop */
      }
    }
  }
  return ctx
}

export default useTheme
