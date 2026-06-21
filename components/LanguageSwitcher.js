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
    <div className="flex items-center gap-0.5 bg-zinc-800/70 rounded-lg p-1">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          aria-label={lang.code.toUpperCase()}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide transition-all duration-150
            ${locale === lang.code
              ? 'bg-zinc-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
