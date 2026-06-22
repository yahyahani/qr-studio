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

// Runs before React hydrates — prevents flash of wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem('qrstudio-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
