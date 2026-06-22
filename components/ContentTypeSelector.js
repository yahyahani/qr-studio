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
              /* Active: same in both modes */
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
              /* Inactive light: white pill with border + shadow so it reads as a surface above the gradient bg */
              /* Inactive dark: unchanged zinc-800 pill */
              : 'bg-white/90 dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-transparent shadow-sm dark:shadow-none text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700/80 hover:border-indigo-300/50 dark:hover:border-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-md dark:hover:shadow-none'
            }`}
        >
          {t.types[id]}
        </button>
      ))}
    </div>
  )
}
