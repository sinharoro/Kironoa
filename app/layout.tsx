import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CommandPalette from '@/components/ui/CommandPalette'
import LiquidMesh from '@/components/ui/LiquidMesh'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kironoa | Portfolio',
  description: 'Kironoa Roro – BSCS student, vibe coder, and creator.',
  icons: { icon: '/images/MyLogo.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" className={inter.variable}>
      <body className="font-sans">
        <LiquidMesh />
        {children}
        <CommandPalette />
      </body>
    </html>
  )
}