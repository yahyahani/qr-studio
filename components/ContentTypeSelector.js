'use client'

import { useLocale } from '@/lib/i18n'

const TYPE_IDS = ['link', 'text', 'wifi', 'phone', 'email', 'vcard']

export default function ContentTypeSelector({ activeType, onChange }) {
  const { t } = useLocale()

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {TYPE_IDS.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150
            ${activeType === id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]'
              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100'
            }`}
        >
          {t.types[id]}
        </button>
      ))}
    </div>
  )
}
