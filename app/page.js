'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import ContentTypeSelector from '@/components/ContentTypeSelector'
import DynamicFields from '@/components/DynamicFields'
import QrPreview from '@/components/QrPreview'
import { buildQrData } from '@/lib/qrFormatters'
import { useLocale } from '@/lib/i18n'

export default function Home() {
  const { t } = useLocale()
  const [type,   setType]   = useState('link')
  const [fields, setFields] = useState({})

  const handleTypeChange = (newType) => {
    setType(newType)
    setFields({})
  }

  const qrData = useMemo(() => buildQrData(type, fields), [type, fields])

  const qrLabel = useMemo(() => {
    if (fields.url)   return fields.url
    if (fields.ssid)  return `WiFi: ${fields.ssid}`
    if (fields.name)  return fields.name
    if (fields.phone) return fields.phone
    if (fields.email) return fields.email
    if (fields.text)  return fields.text.slice(0, 50)
    return ''
  }, [fields])

  return (
    <>
      <Header activePage="home" />
      <main className="min-h-[calc(100vh-56px)] px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">
              {t.appName}
            </h1>
            <p className="text-zinc-500 text-sm">{t.appTagline}</p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[1fr_288px] gap-5 items-start">

            {/* Left: form */}
            <div className="w-full min-w-0 animate-fade-in">
              <ContentTypeSelector activeType={type} onChange={handleTypeChange} />
              <div className="glass-card p-5">
                <DynamicFields type={type} fields={fields} setFields={setFields} />
              </div>
            </div>

            {/* Right: preview */}
            <div className="w-full md:w-auto animate-fade-in">
              <QrPreview data={qrData} type={type} label={qrLabel} />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
