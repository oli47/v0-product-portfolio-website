'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useScramble } from '@/lib/use-scramble'
import { content, defaultLang } from '@/lib/content'

const t = content[defaultLang].nav

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted]     = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [hovering, setHovering]   = useState(false)
  const animating                  = useRef(false)
  const pathname                   = usePathname()
  const isProjectPage              = pathname.startsWith('/projects/')

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = resolvedTheme === 'dark'

  // ── Pixel dissolve transition ──────────────────────────────────────────────
  const handleThemeToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animating.current) return

      const button   = e.currentTarget
      const rect     = button.getBoundingClientRect()
      const x        = rect.left + rect.width  / 2
      const y        = rect.top  + rect.height / 2
      const newTheme = isDark ? 'light' : 'dark'

      if (!document.startViewTransition) {
        setTheme(newTheme)
        return
      }

      const svgNS   = 'http://www.w3.org/2000/svg'
      const svg     = document.createElementNS(svgNS, 'svg')
      const defs    = document.createElementNS(svgNS, 'defs')
      const clip    = document.createElementNS(svgNS, 'clipPath')
      const polygon = document.createElementNS(svgNS, 'polygon')

      svg.setAttribute('style', 'position:fixed;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:999999')
      clip.setAttribute('id', 'theme-pixel-clip')
      clip.setAttribute('clipPathUnits', 'userSpaceOnUse')

      clip.appendChild(polygon)
      defs.appendChild(clip)
      svg.appendChild(defs)
      document.body.appendChild(svg)

      animating.current = true

      const maxR    = Math.hypot(
        Math.max(x, window.innerWidth  - x),
        Math.max(y, window.innerHeight - y),
      ) + 12
      const PIXEL    = 8
      const SEGMENTS = 360

      const setRadius = (r: number) => {
        const raw: [number, number][] = []
        for (let i = 0; i < SEGMENTS; i++) {
          const angle = (i / SEGMENTS) * Math.PI * 2
          const px = Math.round((x + Math.cos(angle) * r) / PIXEL) * PIXEL
          const py = Math.round((y + Math.sin(angle) * r) / PIXEL) * PIXEL
          const last = raw[raw.length - 1]
          if (!last || last[0] !== px || last[1] !== py) raw.push([px, py])
        }

        const pts: string[] = []
        for (let i = 0; i < raw.length; i++) {
          const [px, py]   = raw[i]
          const [npx, npy] = raw[(i + 1) % raw.length]
          pts.push(`${px},${py}`)
          if (px !== npx && py !== npy) {
            pts.push(`${npx},${py}`)
          }
        }

        polygon.setAttribute('points', pts.join(' '))
      }

      setRadius(0)

      const transition = document.startViewTransition(() => {
        setTheme(newTheme)
      })

      transition.ready.then(() => {
        const duration  = 600
        const startTime = performance.now()

        const frame = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setRadius(eased * maxR)
          if (t < 1) requestAnimationFrame(frame)
        }

        requestAnimationFrame(frame)
      })

      transition.finished.then(() => {
        svg.remove()
        animating.current = false
      })
    },
    [isDark, setTheme],
  )

  // ── Scramble labels ────────────────────────────────────────────────────────
  const themeWord  = mounted ? (isDark ? t.light : t.dark) : t.dark
  const themeLabel = useScramble(themeWord)
  const nameLabel  = useScramble(t.name)
  const backLabel  = useScramble('Back')

  const showBack = isProjectPage && scrolled && hovering

  const handleLinkEnter = useCallback(() => {
    setHovering(true)
    if (isProjectPage && scrolled) backLabel.scramble()
    else nameLabel.scramble()
  }, [isProjectPage, scrolled, backLabel, nameLabel])

  const handleLinkLeave = useCallback(() => {
    setHovering(false)
    if (isProjectPage && scrolled) backLabel.reset()
    else nameLabel.reset()
  }, [isProjectPage, scrolled, backLabel, nameLabel])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none py-[2.5rem]">
      <div className="w-full max-w-[45rem] mx-auto px-5">
        <div
          className="pointer-events-auto mx-auto transition-all duration-[400ms] ease-in-out"
          style={{
            width: scrolled ? '93%' : '100%',
            ...(scrolled
              ? {
                  background: 'var(--color-000)',
                  border: '1px solid var(--color-100)',
                  borderRadius: '0.125rem',
                  boxShadow: '0 0 0.75rem rgba(0,0,0,0.08)',
                }
              : {
                  background: 'transparent',
                }),
          }}
        >
          {/* Single padding source: px-3 (8px) always on this container */}
          <div className="h-[2.5rem] flex items-center justify-between px-3">

            {/* Left */}
            <div className="flex items-center">
              <Link
                href="/"
                aria-label={showBack ? 'Back to home' : t.name}
                className="group text-eyebrow text-[var(--color-500)] hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out"
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                {/*
                  inline-grid: ghost (always t.name) fixes the element width.
                  OLAF and BACK layers sit on top, cross-fading via opacity.
                  Width never changes → separator and status never move.
                */}
                <span className="inline-grid shrink-0">

                  {/* Ghost — invisible, always t.name, fixes width */}
                  <span
                    className="col-start-1 row-start-1 invisible whitespace-nowrap select-none"
                    aria-hidden
                  >
                    {t.name}
                  </span>

                  {/* OLAF layer — visible by default, fades out on project+scrolled */}
                  <span
                    className="col-start-1 row-start-1 flex items-center whitespace-nowrap"
                    style={{ opacity: showBack ? 0 : 1, transition: 'opacity 400ms ease-in-out' }}
                    aria-hidden={showBack}
                  >
                    <span ref={nameLabel.spanRef}>{t.name}</span>
                  </span>

                  {/* BACK layer — fades in on project+scrolled */}
                  <span
                    className="col-start-1 row-start-1 flex items-center whitespace-nowrap"
                    style={{ opacity: showBack ? 1 : 0, transition: 'opacity 400ms ease-in-out' }}
                    aria-hidden={!showBack}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mr-1 shrink-0" style={{stroke:'currentColor'}}><path d="M14 8H2M7 3L2 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
                    <span ref={backLabel.spanRef}>Back</span>
                  </span>

                </span>
              </Link>

              {/* Separator */}
              <div className="w-px h-[1.125rem] bg-[var(--color-100)] mx-3" />

              {/* Status — hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-[0.125rem] bg-[var(--accent-green)] animate-pulse-slow shrink-0"
                  aria-hidden="true"
                />
                <span className="text-eyebrow text-[var(--accent-green)]">
                  {t.status}
                </span>
              </div>
            </div>

            {/* Right */}
            <button
              onClick={handleThemeToggle}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="text-eyebrow text-[var(--color-300)] hover:text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out cursor-pointer"
              onMouseEnter={themeLabel.scramble}
              onMouseLeave={themeLabel.reset}
            >
              <span ref={themeLabel.spanRef} aria-hidden="true">{themeWord}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}
