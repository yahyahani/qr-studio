'use client'

import { useState, useEffect } from 'react'
import { LocaleContext, translations } from '@/lib/i18n'

const STORAGE_KEY = 'qrstudio-locale'

export default function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) setLocaleState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const setLocale = (l) => {
    if (translations[l]) setLocaleState(l)
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
