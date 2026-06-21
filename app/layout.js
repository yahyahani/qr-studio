import { Inter } from 'next/font/google'
import LanguageProvider from '@/components/LanguageProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'QR Studio',
  description: 'Create beautiful, customizable QR codes in seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
