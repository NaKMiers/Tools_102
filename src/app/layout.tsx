import Providers from '@/components/providers/Providers'
import type { Metadata } from 'next'
import { Montserrat, Source_Sans_3 } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tools 102',
  description: 'All tools in one place',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${sourceSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
