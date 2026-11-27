import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { asset } from './site'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Portfolio | Kironoa Roro',
  description: 'A high-performance personal portfolio',
  icons: {
    icon: asset('/images/Kiro.png'),
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <div className="noise-overlay" />
        <Script src={asset('/script.js')} strategy="afterInteractive" />
      </body>
    </html>
  )
}