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

      // View Transitions API: browser freezes old theme as screenshot,
      // new theme reveals from button position via pixelated SVG clip-path
      if (!document.startViewTransition) {
        setTheme(newTheme)
        return
      }

      // Build SVG clipPath with polygon — points will be updated each rAF frame
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
      ) + 12         // slightly overshoot
      const PIXEL    = 8   // quantization grid in px — larger = chunkier pixels
      const SEGMENTS = 360 // many vertices so quantization creates clear staircase

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
        const duration  = 600   // ms
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
  const nameLabel  = useScramble(isProjectPage ? 'Back' : t.name)

  // ── Styles ────────────────────────────────────────────────────────────────
  const btnClass =
    'text-eyebrow text-[var(--color-300)] hover:text-[var(--color-500)] transition-colors duration-150 cursor-pointer px-3 py-[0.625rem]'

  return (
    /* Always constrained to content width — only background animates on scroll */
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none py-[2.5rem]">
      <div
        className="pointer-events-auto transition-all duration-300 ease-out"
        style={{
          width: 'calc(100% - 2.5rem)',
          maxWidth: '45rem',
          ...(scrolled
            ? {
                background: 'var(--color-000)',
                border: '1px solid var(--color-100)',
                borderRadius: '0.125rem',
                boxShadow: '0 0 0.75rem rgba(0,0,0,0.08)',
              }
            : {
                background: 'color-mix(in srgb, var(--background) 90%, transparent)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }),
        }}
      >
        {/* h-[2.5rem] = 40px */}
        <div className="px-5 h-[2.5rem] flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-eyebrow text-[var(--color-500)] hover:text-[var(--accent)] transition-colors duration-150 px-3 py-[0.625rem]"
              onMouseEnter={() => nameLabel.scramble()}
              onMouseLeave={() => {
                nameLabel.reset()
                if (isProjectPage && nameLabel.spanRef.current) {
                  nameLabel.spanRef.current.textContent = t.name
                }
              }}
            >
              {/* Arrow — only on project pages, always in DOM so layout is stable */}
              {isProjectPage && (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" aria-hidden>←</span>
              )}
              {/*
                inline-grid: ghost (name) and real text share one cell.
                shrink-0 prevents flex from squeezing the grid.
                Ghost has whitespace-nowrap → grid is always name-width.
                Real text (name or "Back") is left-aligned within that width.
              */}
              <span className="inline-grid shrink-0">
                <span className="col-start-1 row-start-1 invisible whitespace-nowrap select-none" aria-hidden>{t.name}</span>
                <span ref={nameLabel.spanRef} className="col-start-1 row-start-1 text-left">{t.name}</span>
              </span>
            </Link>
            <div className="w-px h-[1.125rem] bg-[var(--color-100)]" />
            {/* Status — hidden on mobile to prevent overflow */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-[0.625rem]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-slow shrink-0"
                aria-hidden="true"
              />
              <span className="text-eyebrow text-[var(--accent-green)]">
                {t.status}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center">
            <button
              onClick={handleThemeToggle}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className={btnClass}
              onMouseEnter={themeLabel.scramble}
              onMouseLeave={themeLabel.reset}
            >
              <span ref={themeLabel.spanRef}>{themeWord}</span>
            </button>
            <div className="w-px h-[1.125rem] bg-[var(--color-100)]" />
            {/* Language switcher — wire to i18n context when ready */}
            <button
              disabled
              className={`${btnClass} opacity-40 cursor-not-allowed`}
              title="Polish version coming soon"
            >
              {t.langSwitch}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
