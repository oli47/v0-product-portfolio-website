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

const META_DESCRIPTION = 'Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed.'

export const metadata: Metadata = {
  title: { default: 'Olaf Otrząsek • Design', template: '%s — Olaf Otrząsek' },
  description: META_DESCRIPTION,
  metadataBase: new URL('https://olafotrzasek.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Olaf Otrząsek • Design',
    description: META_DESCRIPTION,
    url: 'https://olafotrzasek.com',
    siteName: 'Olaf Otrząsek',
    images: [{ url: '/images/avatar.jpg', width: 800, height: 800, alt: 'Olaf Otrząsek' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olaf Otrząsek • Design',
    description: META_DESCRIPTION,
    images: ['/images/avatar.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/ppmondwest-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ppneuebit-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Olaf Otrząsek',
              url: 'https://olafotrzasek.com',
              jobTitle: 'Senior Product Designer',
              description: META_DESCRIPTION,
              sameAs: ['https://www.linkedin.com/in/olafotrzasek/'],
            }),
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-sm focus:bg-[var(--accent)] focus:text-white focus:text-eyebrow"
        >
          Skip to content
        </a>
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
