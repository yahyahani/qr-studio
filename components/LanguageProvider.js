'use client'

import { useState, useEffect } from 'react'
import { LocaleContext, translations } from '@/lib/i18n'

const LOCALE_KEY = 'qrstudio-locale'
const THEME_KEY  = 'qrstudio-theme'

export default function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en')
  const [theme,  setThemeState]  = useState(null) // null = not yet hydrated

  // Restore locale
  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && translations[saved]) setLocaleState(saved)
  }, [])

  // Restore theme (system preference as fallback)
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Apply locale to <html>
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(LOCALE_KEY, locale)
  }, [locale])

  // Apply theme class to <html>
  useEffect(() => {
    if (!theme) return
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const setLocale = (l) => {
    if (translations[l]) setLocaleState(l)
  }

  const toggleTheme = () =>
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t:    translations[locale],
        dir:  locale === 'ar' ? 'rtl' : 'ltr',
        theme,
        toggleTheme,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
