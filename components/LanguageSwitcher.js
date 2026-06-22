'use client'

import { useLocale } from '@/lib/i18n'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
  { code: 'ar', label: 'عر' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-0.5
                    bg-white/80 dark:bg-zinc-800/70
                    border border-indigo-100/60 dark:border-transparent
                    rounded-lg p-1">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          aria-label={lang.code.toUpperCase()}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide transition-all duration-150
            ${locale === lang.code
              ? 'bg-indigo-50 dark:bg-zinc-600 text-indigo-700 dark:text-white shadow-sm ring-1 ring-indigo-200/60 dark:ring-transparent'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
