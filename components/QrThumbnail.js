'use client'

import { useEffect, useRef } from 'react'

// Lichte, read-only variant van QrPreview — geen kleurkiezers, alleen renderen
export default function QrThumbnail({ data, dotColor, bgColor, dotStyle, size = 100 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    let qrInstance = null

    async function init() {
      const QRCodeStyling = (await import('qr-code-styling')).default
      if (!mounted || !containerRef.current) return

      qrInstance = new QRCodeStyling({
        width: size,
        height: size,
        data: data || ' ',
        dotsOptions: { color: dotColor || '#6366f1', type: dotStyle || 'rounded' },
        backgroundOptions: { color: bgColor || '#ffffff' },
        qrOptions: { errorCorrectionLevel: 'H' },
      })

      containerRef.current.innerHTML = ''
      qrInstance.append(containerRef.current)
    }

    init()
    return () => {
      mounted = false
    }
  }, [data, dotColor, bgColor, dotStyle, size])

  return <div ref={containerRef} />
}
