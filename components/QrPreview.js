'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'

export default function QrPreview({ data, type, label }) {
  const { t } = useLocale()
  const containerRef   = useRef(null)
  const qrInstanceRef  = useRef(null)
  const [dotColor, setDotColor]   = useState('#6366f1')
  const [bgColor,  setBgColor]    = useState('#ffffff')
  const [dotStyle, setDotStyle]   = useState('rounded')
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  useEffect(() => {
    let mounted = true
    async function init() {
      const QRCodeStyling = (await import('qr-code-styling')).default
      if (!mounted) return
      qrInstanceRef.current = new QRCodeStyling({
        width: 240,
        height: 240,
        data: data || ' ',
        dotsOptions:       { color: dotColor, type: dotStyle },
        backgroundOptions: { color: bgColor },
        qrOptions:         { errorCorrectionLevel: 'H' },
      })
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        qrInstanceRef.current.append(containerRef.current)
      }
    }
    init()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!qrInstanceRef.current) return
    qrInstanceRef.current.update({
      data: data || ' ',
      dotsOptions:       { color: dotColor, type: dotStyle },
      backgroundOptions: { color: bgColor },
    })
  }, [data, dotColor, bgColor, dotStyle])

  useEffect(() => { setSaveState('idle') }, [data])

  const download = (ext) => {
    if (!qrInstanceRef.current || !data) return
    qrInstanceRef.current.download({ name: 'qr-code', extension: ext })
  }

  const saveToHistory = async () => {
    if (!data) return
    setSaveState('saving')
    try {
      const res = await fetch('/api/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, label: label || data.slice(0, 50), data, dotColor, bgColor, dotStyle }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const shapes = [
    { value: 'rounded', label: t.shapeRounded },
    { value: 'dots',    label: t.shapeDots    },
    { value: 'square',  label: t.shapeSquare  },
    { value: 'classy',  label: t.shapeClassy  },
  ]

  return (
    <div className="glass-card p-5 flex flex-col items-center">

      {/* QR canvas — always white so the code is scannable */}
      <div className="rounded-2xl p-2.5 mb-5
                      shadow-[0_4px_20px_rgba(99,102,241,0.15),0_1px_4px_rgba(0,0,0,0.06)]
                      dark:shadow-xl dark:shadow-black/40
                      ring-1 ring-indigo-100/60 dark:ring-white/10"
           style={{ background: bgColor }}>
        <div ref={containerRef} />
      </div>

      {!data && (
        <p className="text-zinc-500 dark:text-zinc-600 text-xs text-center mb-5 leading-relaxed max-w-[190px]">
          {t.fillFieldsHint}
        </p>
      )}

      {/* Customization */}
      <div className="w-full space-y-3.5 mb-4">

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1.5 font-medium">
              {t.dotColor}
            </label>
            <input
              type="color"
              value={dotColor}
              onChange={(e) => setDotColor(e.target.value)}
              className="w-full h-9 rounded-xl cursor-pointer
                         bg-white/90 dark:bg-zinc-800
                         border border-zinc-200 dark:border-zinc-700/60 p-0.5
                         hover:border-indigo-300/60 dark:hover:border-zinc-600 transition-colors duration-150"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1.5 font-medium">
              {t.bgColor}
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-9 rounded-xl cursor-pointer
                         bg-white/90 dark:bg-zinc-800
                         border border-zinc-200 dark:border-zinc-700/60 p-0.5
                         hover:border-indigo-300/60 dark:hover:border-zinc-600 transition-colors duration-150"
            />
          </div>
        </div>

        {/* Shape selector */}
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1.5 font-medium">
            {t.shape}
          </label>
          <select
            value={dotStyle}
            onChange={(e) => setDotStyle(e.target.value)}
            className="field-input"
          >
            {shapes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex gap-2 w-full mb-2.5">
        <button
          onClick={() => download('png')}
          disabled={!data}
          className="flex-1 py-2 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     hover:from-indigo-500 hover:to-violet-500
                     text-white font-semibold
                     shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                     transition-all duration-200"
        >
          ↓ {t.downloadPng}
        </button>
        <button
          onClick={() => download('svg')}
          disabled={!data}
          className="flex-1 py-2 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed
                     bg-zinc-100 dark:bg-zinc-700/80
                     hover:bg-zinc-200 dark:hover:bg-zinc-600/80
                     text-zinc-700 dark:text-zinc-100 font-semibold
                     transition-all duration-200"
        >
          ↓ {t.downloadSvg}
        </button>
      </div>

      {/* Save button */}
      <button
        onClick={saveToHistory}
        disabled={!data || saveState === 'saving' || saveState === 'saved'}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          disabled:cursor-not-allowed
          ${saveState === 'saved'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
            : saveState === 'error'
            ? 'bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800/50 text-red-600 dark:text-red-400'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35'
          }`}
      >
        {saveState === 'idle'   && t.saveToHistory}
        {saveState === 'saving' && t.saving}
        {saveState === 'saved'  && `✓ ${t.saved}`}
        {saveState === 'error'  && t.saveError}
      </button>
    </div>
  )
}
