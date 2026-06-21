// lib/qrFormatters.js
// كل دالة بترجع النص الصحيح اللي يتحول لـ QR Code حسب الستاندرد الخاص بنوع المحتوى

export function formatLink(url) {
  if (!url) return ''
  // إضافة https:// لو المستخدم ماكتبهاش
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }
  return url
}

export function formatText(text) {
  return text || ''
}

export function formatPhone(phone) {
  if (!phone) return ''
  return `tel:${phone.replace(/\s+/g, '')}`
}

export function formatEmail({ email, subject = '', body = '' }) {
  if (!email) return ''
  const params = new URLSearchParams()
  if (subject) params.append('subject', subject)
  if (body) params.append('body', body)
  const query = params.toString()
  return `mailto:${email}${query ? '?' + query : ''}`
}

export function formatWifi({ ssid, password, encryption = 'WPA', hidden = false }) {
  if (!ssid) return ''
  // الستاندرد الرسمي لـ WiFi QR codes
  // WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
  const escape = (str) => (str || '').replace(/([\\;,:"])/g, '\\$1')
  return `WIFI:T:${encryption};S:${escape(ssid)};P:${escape(password)};H:${hidden};;`
}

export function formatVCard({ name, phone, email, organization, title, url }) {
  if (!name) return ''
  // ستاندرد vCard 3.0
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    organization ? `ORG:${organization}` : null,
    title ? `TITLE:${title}` : null,
    phone ? `TEL;TYPE=CELL:${phone}` : null,
    email ? `EMAIL:${email}` : null,
    url ? `URL:${url}` : null,
    'END:VCARD',
  ].filter(Boolean)
  return lines.join('\n')
}

// الدالة الرئيسية اللي بتختار الفورماتر المناسب حسب النوع المختار
export function buildQrData(type, fields) {
  switch (type) {
    case 'link':
      return formatLink(fields.url)
    case 'text':
      return formatText(fields.text)
    case 'phone':
      return formatPhone(fields.phone)
    case 'email':
      return formatEmail(fields)
    case 'wifi':
      return formatWifi(fields)
    case 'vcard':
      return formatVCard(fields)
    default:
      return ''
  }
}
