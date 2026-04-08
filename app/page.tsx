'use client'

import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { FadeUp } from '@/components/fade-up'
import { ProjectRow, ProjectRowSoon } from '@/components/project-row'
import { content, defaultLang } from '@/lib/content'
import { useEffect, useState, useCallback, useRef } from 'react'

const t = content[defaultLang]

// ─── Experience data ────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    logo: '/logos/logoedrone.png',
    company: 'edrone',
    companySlug: '/edrone',
    url: 'https://edrone.me',
    role: 'Senior Product Designer & Team Lead',
    from: 'Nov 2022',
    to: 'Mar 2026',
  },
  {
    logo: '/logos/logodeepsolver.png',
    company: 'Deepsolver',
    companySlug: '/Deepsolver',
    url: 'https://deepsolver.com',
    role: 'Product Designer',
    from: 'Nov 2020',
    to: 'Oct 2022',
  },
  {
    logo: '/logos/logoeq.png',
    company: 'eq system',
    companySlug: '/eq system',
    url: 'https://www.eqsystem.pl/en/',
    role: 'UX Designer',
    from: 'Sep 2019',
    to: 'Jul 2020',
  },
  {
    logo: '/logos/logois.png',
    company: 'Inventive Software',
    companySlug: '/Inventive Software',
    url: 'https://inventivesoftwarellc.com/',
    role: 'Junior UX/UI Designer',
    from: 'Jan 2019',
    to: 'Jun 2019',
  },
]

// ─── Contact Bar ────────────────────────────────────────────────────────────

type CopiedId = 'email' | 'phone' | null

// ── Scramble hook ────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function useScramble(word: string) {
  const spanRef  = useRef<HTMLSpanElement>(null)
  const timerId  = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    const el = spanRef.current
    if (!el) return
    if (timerId.current) clearInterval(timerId.current)
    let n = 0; const max = 14
    timerId.current = setInterval(() => {
      el.textContent = word.split('').map((c, i) =>
        n / max > i / word.length ? c : CHARS[Math.floor(Math.random() * 26)]
      ).join('')
      if (++n > max) { clearInterval(timerId.current!); el.textContent = word }
    }, 28)
  }, [word])

  const reset = useCallback(() => {
    if (timerId.current) clearInterval(timerId.current)
    if (spanRef.current) spanRef.current.textContent = word
  }, [word])

  useEffect(() => () => { if (timerId.current) clearInterval(timerId.current) }, [])

  return { spanRef, scramble, reset }
}

function ContactBar() {
  const [copiedId, setCopiedId] = useState<CopiedId>(null)
  const [progressKey, setProgressKey] = useState(0)
  const resume   = useScramble(t.contact.resume)
  const linkedin = useScramble(t.contact.linkedin)

  const copy = useCallback((text: string, id: CopiedId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setProgressKey(k => k + 1)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }, [])

  const baseItem =
    'relative flex items-center gap-1.5 px-3 py-2.5 border-l border-[var(--color-100)] transition-colors duration-200 hover:bg-[var(--color-000)] overflow-hidden'
  const labelCls = 'text-eyebrow text-[var(--color-300)] transition-colors duration-150'
  const icon     = 'font-mono text-[0.75rem] leading-[1.25rem] text-[var(--color-200)]'
  const arrow    = 'font-neubit text-[1.25rem] leading-[1.25rem] text-[var(--color-200)]'

  return (
    <div className="flex border border-[var(--color-100)] rounded-[0.125rem] overflow-hidden w-fit">

      {/* Resume — scramble on hover */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseItem} border-l-0 cursor-pointer`}
        onMouseEnter={resume.scramble}
        onMouseLeave={resume.reset}
      >
        <span ref={resume.spanRef} className={labelCls}>{t.contact.resume}</span>
        <span className={arrow}>↗</span>
      </a>

      {/* Email — fixed width: show original invisible to hold space, copied state absolute */}
      <button
        onClick={() => copy(t.contact.email, 'email')}
        className={`${baseItem} cursor-pointer`}
      >
        <span className={`flex items-center gap-1.5 ${copiedId === 'email' ? 'invisible' : ''}`}>
          <span className={labelCls}>{t.contact.email}</span>
          <span className={icon}>⧉</span>
        </span>
        {copiedId === 'email' && (
          <span className="absolute inset-0 flex items-center px-3">
            <span className="text-eyebrow text-[var(--accent)]">{t.contact.copied}</span>
            <span key={progressKey} className="animate-progress absolute bottom-0 left-0 h-px bg-[var(--accent)]" />
          </span>
        )}
      </button>

      {/* Phone — fixed width: same approach */}
      <button
        onClick={() => copy(t.contact.phoneRaw, 'phone')}
        className={`${baseItem} cursor-pointer`}
      >
        <span className={`flex items-center gap-1.5 ${copiedId === 'phone' ? 'invisible' : ''}`}>
          <span className={labelCls}>{t.contact.phone}</span>
          <span className={icon}>⧉</span>
        </span>
        {copiedId === 'phone' && (
          <span className="absolute inset-0 flex items-center px-3">
            <span className="text-eyebrow text-[var(--accent)]">{t.contact.copied}</span>
            <span key={progressKey} className="animate-progress absolute bottom-0 left-0 h-px bg-[var(--accent)]" />
          </span>
        )}
      </button>

      {/* LinkedIn — scramble on hover */}
      <a
        href="https://www.linkedin.com/in/olafotrzasek/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseItem} cursor-pointer`}
        onMouseEnter={linkedin.scramble}
        onMouseLeave={linkedin.reset}
      >
        <span ref={linkedin.spanRef} className={labelCls}>{t.contact.linkedin}</span>
        <span className={arrow}>↗</span>
      </a>
    </div>
  )
}

// ─── Scroll To Top ───────────────────────────────────────────────────────────

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-9 h-9 rounded-[0.125rem] border border-[var(--color-100)] bg-[var(--background)] text-[var(--color-300)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 200ms, transform 200ms, color 200ms, border-color 200ms',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-[45rem] mx-auto px-5 pt-24 pb-24 md:pt-28">

        {/* ── Hero ── */}
        <section className="mb-16">
          <FadeUp delay={0}>
            <h1
              className="font-display font-normal tracking-[0.025rem] text-[var(--color-500)] mb-5 text-pretty"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                lineHeight: 'clamp(3rem, 6vw, 3.5rem)',
              }}
            >
              {t.hero.headlinePre}
              <span style={{ color: 'var(--accent)' }}>{t.hero.headlineAccent}</span>
              {t.hero.headlinePost}
            </h1>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="text-body-1 text-[var(--color-300)] mb-8 text-pretty">
              {t.hero.body}
              <a
                href="https://edrone.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-[var(--color-100)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                {t.hero.bodyEdrone}
              </a>
              {t.hero.bodyPost}
            </p>
          </FadeUp>

          <FadeUp delay={0.16}>
            <ContactBar />
          </FadeUp>
        </section>

        {/* ── Selected Projects ── */}
        <section className="mb-16">
          <FadeUp delay={0}>
            <SectionBadge>{t.sections.projects}</SectionBadge>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="border border-[var(--color-100)] rounded-[0.125rem] overflow-hidden">
              {projects.map((project, i) => (
                <ProjectRow
                  key={project.slug}
                  project={project}
                  isLast={false}
                />
              ))}
              <div className="border-t border-[var(--color-100)]">
                <ProjectRowSoon
                  title="PLO Genius"
                  description="Poker odds calculator and learning platform, designed from zero to launch."
                />
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── Currently ── */}
        <section className="mb-16">
          <FadeUp delay={0}>
            <SectionBadge>{t.sections.currently}</SectionBadge>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-body-1 text-[var(--color-300)] text-pretty">
              {t.currently}
            </p>
          </FadeUp>
        </section>

        {/* ── Experience ── */}
        <section className="mb-0">
          <FadeUp delay={0}>
            <SectionBadge>{t.sections.experience}</SectionBadge>
          </FadeUp>

          <div className="flex flex-col gap-6">
            {EXPERIENCE.map((job, i) => (
              <FadeUp key={job.company} delay={i * 0.06}>
                <div className="flex items-center justify-between gap-4">
                  {/* Logo */}
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 p-1 border border-[var(--color-100)] bg-[var(--color-000)] rounded-[0.125rem]">
                    <Image
                      src={job.logo}
                      alt={job.company}
                      width={28}
                      height={28}
                      className="object-contain rounded-[0.125rem]"
                    />
                  </div>

                  {/* Role + company */}
                  <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
                    <span className="text-eyebrow text-[var(--color-500)] whitespace-nowrap">
                      {job.role}
                    </span>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eyebrow text-[var(--color-300)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
                    >
                      {job.companySlug}
                    </a>
                  </div>

                  {/* Period */}
                  <span className="text-eyebrow text-[var(--color-300)] shrink-0 whitespace-nowrap">
                    {job.from} – {job.to}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

      </div>

      <ScrollToTop />
    </main>
  )
}
