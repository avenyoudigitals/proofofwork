import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from './_components/cookie-consent'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'ProofForge', template: '%s — ProofForge' },
  description: 'The verified proof-of-work network. Where professionals showcase real contributions and companies validate talent.',
  keywords: ['proof of work', 'verified contributions', 'professional network', 'portfolio verification'],
  openGraph: {
    siteName: 'ProofForge',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}<CookieConsent /></body>
    </html>
  )
}