import React, { useEffect, createContext, useState, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { GlobalStyles, theme } from '../styles/index'

export const ThemeContext = createContext({
  themeMode: 'dark',
  toggleTheme: () => {
    return
  },
})

export const AppProvider: React.FC = ({ children }) => {
  const [themeMode, setThemeMode] = useState<string>('dark')
  const currentTheme = (theme as any)[themeMode]

  useEffect(() => {
    setThemeMode(localStorage.getItem('theme') || 'dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  const toggleTheme = () => {
    setThemeMode((oldTheme) => {
      if (oldTheme === 'light') return 'dark'
      else return 'light'
    })
  }

  //  combine into one object for global ThemeContext state
  const value = useMemo(() => ({ themeMode, toggleTheme }), [themeMode])
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
