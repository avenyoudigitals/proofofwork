import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from './_components/cookie-consent'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'ProofForge', template: '%s — ProofForge' },
  description: 'The professional verification network for developers and builders. Company-verified proof of work.',
  keywords: ['proof of work', 'verified portfolio', 'developer verification', 'professional network'],
  openGraph: { siteName: 'ProofForge', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}<CookieConsent /></body>
    </html>
  )
}