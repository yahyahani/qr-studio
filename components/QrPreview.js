'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/i18n'

export default function QrPreview({ data, type, label }) {
  const { t } = useLocale()
  const containerRef = useRef(null)
  const qrInstanceRef = useRef(null)
  const [dotColor, setDotColor] = useState('#6366f1')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotStyle, setDotStyle] = useState('rounded')
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
        dotsOptions: { color: dotColor, type: dotStyle },
        backgroundOptions: { color: bgColor },
        qrOptions: { errorCorrectionLevel: 'H' },
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
      dotsOptions: { color: dotColor, type: dotStyle },
      backgroundOptions: { color: bgColor },
    })
  }, [data, dotColor, bgColor, dotStyle])

  useEffect(() => {
    setSaveState('idle')
  }, [data])

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
        body: JSON.stringify({
          type,
          label: label || data.slice(0, 50),
          data,
          dotColor,
          bgColor,
          dotStyle,
        }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const shapes = [
    { value: 'rounded', label: t.shapeRounded },
    { value: 'dots', label: t.shapeDots },
    { value: 'square', label: t.shapeSquare },
    { value: 'classy', label: t.shapeClassy },
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-2xl p-5 flex flex-col items-center shadow-sm">

      {/* QR canvas */}
      <div className="bg-white rounded-2xl p-2.5 mb-5 shadow-xl">
        <div ref={containerRef} />
      </div>

      {!data && (
        <p className="text-zinc-600 text-xs text-center mb-5 leading-relaxed max-w-[190px]">
          {t.fillFieldsHint}
        </p>
      )}

      {/* Customization */}
      <div className="w-full space-y-3.5 mb-4">

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">{t.dotColor}</label>
            <input
              type="color"
              value={dotColor}
              onChange={(e) => setDotColor(e.target.value)}
              className="w-full h-9 rounded-xl cursor-pointer bg-zinc-800 border border-zinc-700/60 p-0.5"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">{t.bgColor}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-9 rounded-xl cursor-pointer bg-zinc-800 border border-zinc-700/60 p-0.5"
            />
          </div>
        </div>

        {/* Shape selector */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">{t.shape}</label>
          <select
            value={dotStyle}
            onChange={(e) => setDotStyle(e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 text-sm text-zinc-200
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-150"
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
          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40
                     disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white
                     transition-colors duration-150"
        >
          ↓ {t.downloadPng}
        </button>
        <button
          onClick={() => download('svg')}
          disabled={!data}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40
                     disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white
                     transition-colors duration-150"
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
            ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
            : saveState === 'error'
            ? 'bg-red-950/60 border border-red-800/50 text-red-400'
            : 'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white'
          }`}
      >
        {saveState === 'idle' && t.saveToHistory}
        {saveState === 'saving' && t.saving}
        {saveState === 'saved' && `✓ ${t.saved}`}
        {saveState === 'error' && t.saveError}
      </button>
    </div>
  )
}
