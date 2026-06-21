'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import QrThumbnail from '@/components/QrThumbnail'
import { useLocale } from '@/lib/i18n'

function Spinner() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-indigo-400 animate-spin shrink-0" />
  )
}

export default function HistoryPage() {
  const { t, locale } = useLocale()
  const [qrcodes, setQrcodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/qrcodes')
      if (!res.ok) throw new Error()
      setQrcodes(await res.json())
    } catch {
      setError(t.loadError)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setQrcodes((prev) => prev.filter((q) => q.id !== id))
    try {
      const res = await fetch(`/api/qrcodes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
    } catch {
      loadHistory()
    }
  }

  const formatDate = (dateStr) => {
    const localeMap = { ar: 'ar-EG', nl: 'nl-NL', en: 'en-GB' }
    return new Date(dateStr).toLocaleDateString(localeMap[locale] ?? 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Header activePage="history" />
      <main className="min-h-[calc(100vh-56px)] px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-zinc-50 mb-1 tracking-tight">
              {t.historyTitle}
            </h1>
            <p className="text-zinc-500 text-sm">{t.historySubtitle}</p>
          </div>

          {loading && (
            <div className="flex items-center gap-2.5 text-zinc-500 text-sm py-10">
              <Spinner />
              {t.loading}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 text-red-400 bg-red-950/20 border border-red-900/40 rounded-xl px-4 py-3 text-sm">
              <span className="mt-0.5">⚠</span>
              {error}
            </div>
          )}

          {!loading && !error && qrcodes.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-zinc-600 mb-4 text-sm">{t.emptyHistory}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-150"
              >
                {t.createFirst}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

          {qrcodes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
              {qrcodes.map((qr) => (
                <article
                  key={qr.id}
                  className="group bg-zinc-900 border border-zinc-800/70 rounded-2xl p-4 flex gap-3.5
                             hover:border-zinc-700 transition-colors duration-150"
                >
                  <div className="bg-white rounded-xl p-1.5 shrink-0 shadow-sm">
                    <QrThumbnail
                      data={qr.data}
                      dotColor={qr.dotColor}
                      bgColor={qr.bgColor}
                      dotStyle={qr.dotStyle}
                      size={72}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 mb-1.5 font-medium">
                      {t.types[qr.type] || qr.type}
                    </span>
                    <p
                      className="text-sm text-zinc-200 truncate leading-snug mb-1"
                      title={qr.label}
                    >
                      {qr.label}
                    </p>
                    <p className="text-xs text-zinc-500 mb-3">
                      {formatDate(qr.createdAt)}
                    </p>
                    <button
                      onClick={() => handleDelete(qr.id)}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors duration-150 font-medium"
                    >
                      {t.deleteBtn}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
