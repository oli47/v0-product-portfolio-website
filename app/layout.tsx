import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PageTransition } from '@/components/page-transition'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

const dmMono = DM_Mono({ 
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Olaf Otrząsek • Design',
  description: 'Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed.',
  metadataBase: new URL('https://olafotrzasek.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Olaf Otrząsek • Design',
    description: 'Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed.',
    url: 'https://olafotrzasek.com',
    siteName: 'Olaf Otrząsek',
    images: [{ url: '/images/avatar.jpg', width: 800, height: 800, alt: 'Olaf Otrząsek' }],
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5F3EE',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/ppmondwest-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <Nav />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
