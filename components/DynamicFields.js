'use client'

import { useLocale } from '@/lib/i18n'

function Field({ label, ...props }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input {...props} className="field-input" />
    </div>
  )
}

function SelectField({ label, value, onChange, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="field-input"
      >
        {children}
      </select>
    </div>
  )
}

export default function DynamicFields({ type, fields, setFields }) {
  const { t } = useLocale()
  const update = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))

  switch (type) {
    case 'link':
      return (
        <Field
          label={t.url}
          type="url"
          inputMode="url"
          placeholder={t.urlPlaceholder}
          value={fields.url || ''}
          onChange={update('url')}
        />
      )

    case 'text':
      return (
        <div className="mb-0">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            {t.textLabel}
          </label>
          <textarea
            rows={5}
            placeholder={t.textPlaceholder}
            value={fields.text || ''}
            onChange={update('text')}
            className="field-input resize-none"
          />
        </div>
      )

    case 'wifi':
      return (
        <>
          <Field label={t.networkName}  value={fields.ssid       || ''} onChange={update('ssid')} />
          <Field label={t.password}     value={fields.password   || ''} onChange={update('password')} />
          <SelectField label={t.encryption} value={fields.encryption || 'WPA'} onChange={update('encryption')}>
            <option value="WPA">WPA / WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">{t.noPassword}</option>
          </SelectField>
        </>
      )

    case 'phone':
      return (
        <Field
          label={t.phoneNumber}
          type="tel"
          inputMode="tel"
          placeholder={t.phonePlaceholder}
          value={fields.phone || ''}
          onChange={update('phone')}
        />
      )

    case 'email':
      return (
        <>
          <Field label={t.emailAddress} type="email" inputMode="email" value={fields.email   || ''} onChange={update('email')} />
          <Field label={t.emailSubject}                                 value={fields.subject || ''} onChange={update('subject')} />
        </>
      )

    case 'vcard':
      return (
        <>
          <Field label={t.fullName}    value={fields.name         || ''} onChange={update('name')} />
          <Field label={t.phoneNumber} type="tel" inputMode="tel" value={fields.phone  || ''} onChange={update('phone')} />
          <Field label={t.emailAddress} type="email" inputMode="email"   value={fields.email  || ''} onChange={update('email')} />
          <Field label={t.company}     value={fields.organization || ''} onChange={update('organization')} />
          <Field label={t.jobTitle}    value={fields.title        || ''} onChange={update('title')} />
        </>
      )

    default:
      return null
  }
}
