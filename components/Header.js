'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

function QrIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M17 14h3" />
      <path d="M14 17v3" />
      <path d="M17 17h3v3h-3z" />
    </svg>
  )
}

export default function Header({ activePage }) {
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-zinc-100 shrink-0 hover:text-white transition-colors"
        >
          <span className="text-indigo-400">
            <QrIcon />
          </span>
          <span className="text-sm tracking-tight">{t.appName}</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150
              ${activePage === 'home'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
          >
            {t.newQr}
          </Link>
          <Link
            href="/history"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150
              ${activePage === 'history'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
          >
            {t.history}
          </Link>
          <div className="w-px h-4 bg-zinc-700 mx-1.5" aria-hidden="true" />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
