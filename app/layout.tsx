import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PageTransition } from '@/components/page-transition'
import './globals.css'

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'Olaf Otrząsek · Senior Product Designer',
  description: 'Senior Product Designer building SaaS that performs. 7+ years of experience crafting products where smart UX and AI meet business outcomes.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#fafafa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} font-sans antialiased`}>
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  )
}
