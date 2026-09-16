'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useScramble } from '@/lib/use-scramble'
import { content, defaultLang } from '@/lib/content'

const t = content[defaultLang].nav

// Extra invisible hit-area padding on the logo and theme toggle, in px.
// Paired everywhere with an equal negative margin so it grows only what's
// clickable, not the visible glyph, its position, or the header's layout.
const HIT_PAD = 16

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted]     = useState(false)
  const [hovering, setHovering]   = useState(false)
  const animating                  = useRef(false)
  const cleanupTimerRef            = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname                   = usePathname()
  const isProjectPage              = pathname.startsWith('/projects/')

  const logoRef    = useRef<HTMLAnchorElement>(null)
  const toggleRef  = useRef<HTMLButtonElement>(null)
  const scrollRef  = useRef(0)
  const progressRef = useRef(0)
  const rafRef     = useRef(0)
  const lastScrollRef = useRef(0)
  const [hidden, setHidden] = useState(false)

  // In-grid baseline offsets (untransformed), captured once before any spread.
  const baseLogoLeftRef   = useRef(0)
  const baseToggleRightRef = useRef(0)
  const baseReadyRef      = useRef(false)

  // On scroll (0..1) spread logo to the top-left and toggle to the top-right
  // corner via translateX from their captured in-grid positions. At p=0 they sit
  // in the grid. Baselines are measured once so ongoing transforms never feed back.
  useEffect(() => {
    setMounted(true)

    const capture = () => {
      // Both hit targets carry HIT_PAD of invisible padding, offset by an
      // equal negative margin so neither their flex position nor their
      // visible size moves — but that margin also pulls their own
      // getBoundingClientRect() edges outward by HIT_PAD, so it's added
      // back here to recover the visual (pre-padding) position this scroll
      // transform is built around.
      if (logoRef.current) baseLogoLeftRef.current = logoRef.current.getBoundingClientRect().left + HIT_PAD
      if (toggleRef.current) {
        baseToggleRightRef.current = window.innerWidth - toggleRef.current.getBoundingClientRect().right + HIT_PAD
      }
      baseReadyRef.current = true
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      if (!baseReadyRef.current) capture()

      const target = scrollRef.current <= 0 ? 0 : scrollRef.current >= 80 ? 1 : scrollRef.current / 80
      progressRef.current = lerp(progressRef.current, target, 0.08)
      if (Math.abs(progressRef.current - target) < 0.001) progressRef.current = target
      const p = progressRef.current

      if (logoRef.current) {
        const dx = (20 - baseLogoLeftRef.current) * p
        logoRef.current.style.transform = `translateX(${dx}px)`
      }
      if (toggleRef.current) {
        const dx = (baseToggleRightRef.current - 20) * p
        toggleRef.current.style.transform = `translateX(${dx}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const y = window.scrollY
      scrollRef.current = y
      if (window.innerWidth < 768) {
        const delta = y - lastScrollRef.current
        if (y > 120 && delta > 4) setHidden(true)
        else if (delta < -4) setHidden(false)
        if (y <= 4) setHidden(false)
      }
      lastScrollRef.current = y
    }
    const onResize = () => { baseReadyRef.current = false; setHidden(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const isDark = resolvedTheme === 'dark'

  // ── Pixel dissolve transition ──────────────────────────────────────────────
  const handleThemeToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (cleanupTimerRef.current) { clearTimeout(cleanupTimerRef.current); cleanupTimerRef.current = null }
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

      const cleanup = () => { svg.remove(); animating.current = false; cleanupTimerRef.current = null }
      transition.finished.then(cleanup).catch(cleanup)
      cleanupTimerRef.current = setTimeout(cleanup, 800)
    },
    [isDark, setTheme],
  )

  // ── Scramble labels ────────────────────────────────────────────────────────
  const themeWord = mounted ? (isDark ? t.light : t.dark) : t.dark
  const themeLabel = useScramble(themeWord)

  const showBack = isProjectPage && progressRef.current >= 1 && hovering

  const handleLinkEnter = useCallback(() => { setHovering(true) }, [])
  const handleLinkLeave = useCallback(() => { setHovering(false) }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms ease-in-out',
      }}
    >
      <div className="w-full max-w-[var(--measure)] mx-auto p-5 flex items-center justify-between">

        {/* Logo — in-grid left; translateX spreads it to top-left corner on scroll */}
        <Link
          ref={logoRef}
          href="/"
          aria-label={showBack ? 'Back to home' : t.name}
          className="group relative block pointer-events-auto p-4 -m-4"
          style={{ willChange: 'transform' }}
          onMouseEnter={handleLinkEnter}
          onMouseLeave={handleLinkLeave}
        >
          <span className="relative block" style={{ width: 28, height: 17 }}>
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: showBack ? 0 : 1,
                transform: showBack ? 'translateX(-100%)' : 'translateX(0)',
                transition: 'opacity 400ms ease-in-out, transform 400ms ease-in-out',
              }}
              aria-hidden={showBack}
            >
              <svg width="28" height="17" viewBox="0 0 5 3" fill="currentColor" className="text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]" aria-hidden="true"><rect x="1" y="0" width="1" height="1"/><rect x="3" y="0" width="1" height="1"/><rect x="0" y="1" width="1" height="1"/><rect x="2" y="1" width="1" height="1"/><rect x="4" y="1" width="1" height="1"/><rect x="1" y="2" width="1" height="1"/><rect x="3" y="2" width="1" height="1"/></svg>
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: showBack ? 1 : 0,
                transform: showBack ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'opacity 400ms ease-in-out, transform 400ms ease-in-out',
              }}
              aria-hidden={!showBack}
            >
              <svg width="24" height="17" viewBox="0 0 16 16" fill="none" className="text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]" aria-hidden="true"><path d="M14 8H2M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/></svg>
            </span>
          </span>
        </Link>

        {/* Theme toggle — in-grid right; translateX spreads it to top-right corner on scroll */}
        <button
          ref={toggleRef}
          onClick={handleThemeToggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="text-eyebrow text-[var(--color-300)] hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out cursor-pointer pointer-events-auto p-6 -m-4"
          style={{ willChange: 'transform' }}
          onMouseEnter={themeLabel.scramble}
          onMouseLeave={themeLabel.reset}
        >
          <span ref={themeLabel.spanRef} aria-hidden="true">{themeWord}</span>
        </button>

      </div>
    </header>
  )
}
