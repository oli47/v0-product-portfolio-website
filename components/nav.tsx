'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-[var(--color-100)]">
      <div className="max-w-3xl mx-auto px-6 h-11 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <Link href="/" className="nav-link font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
            Olaf Otrząsek
          </Link>
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-green">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-slow shrink-0" aria-hidden="true" />
            Open to opportunities
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="nav-link font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 hover:text-foreground transition-colors duration-150 cursor-pointer"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted ? (resolvedTheme === 'dark' ? 'Light' : 'Dark') : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  )
}
