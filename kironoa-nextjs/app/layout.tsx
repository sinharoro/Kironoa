import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-poppins',
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
    <html lang="en" data-theme="dark" className={poppins.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}
