'use client'

import Image from 'next/image'
import { projects } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { FadeUp } from '@/components/fade-up'
import { ProjectRow } from '@/components/project-row'
import { ScrollToTop } from '@/components/scroll-to-top'
import { content, defaultLang } from '@/lib/content'
import { useState, useCallback } from 'react'
import { noOrphans } from '@/lib/no-orphans'
import { useScramble } from '@/lib/use-scramble'

const t = content[defaultLang]

// ─── Experience data ────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    logo: '/logos/logoedrone.png',
    company: 'edrone',
    companySlug: '/edrone',
    url: 'https://edrone.me',
    role: 'Sr Product Designer & Team Lead',
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

type HoverId = 'email' | 'phone' | null

function ContactBar() {
  const [copiedId, setCopiedId] = useState<CopiedId>(null)
  const [hoverId, setHoverId]   = useState<HoverId>(null)
  const email    = useScramble(t.contact.email)
  const phone    = useScramble(t.contact.phone)

  const copy = useCallback((text: string, id: CopiedId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }, [])

  const tooltipBase =
    'pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-10 flex items-center gap-1 rounded-[0.125rem] px-2 py-0.5 shadow-[0_2px_10px_2px_rgba(0,0,0,0.12)] whitespace-nowrap text-eyebrow transition-opacity duration-[400ms] ease-in-out opacity-0'
  // Light command tooltip (hover) — DS neutrals; accent tooltip for confirm.
  const tooltipOpen  = `${tooltipBase} bg-[var(--color-000)] border border-[var(--color-100)] text-[var(--color-300)]`
  const tooltipCopied = `${tooltipBase} bg-[var(--accent)] text-[var(--background)]`
  const tooltipSym   = 'font-neubit text-[0.75rem] leading-none'

  // One flowing sentence, not a chip row: email and phone (copy on click)
  // lead since they matter more, resume and LinkedIn (open) follow. Every
  // word shows a hover tooltip with its command; copy flips to an accent
  // "copied" confirm.
  const linkCls =
    'relative inline-block cursor-pointer hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out'
  const wordCls = 'underline underline-offset-2 decoration-[var(--color-100)]'
  return (
    <p className="text-body-2 text-[var(--color-500)] mb-8 text-pretty">
      {noOrphans(t.hero.contactLead)}
      <button
        onClick={() => copy(t.contact.email, 'email')}
        aria-label={`Copy email: ${t.contact.email}`}
        className={linkCls}
        onMouseEnter={() => { setHoverId('email'); if (copiedId !== 'email') email.scramble() }}
        onMouseLeave={() => { setHoverId(null); email.reset() }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle mr-1" aria-hidden="true">
          <path d="M6 8h2v2H6zm2 2h2v2H8zm10-2h-2v2h2zm-2 2h-2v2h2zm-6 2h4v2h-4zM2 6h2v12H2zm18 0h2v12h-2zM4 4h16v2H4zm0 14h16v2H4z" />
        </svg>
        <span ref={email.spanRef} className={wordCls}>{t.contact.email}</span>
        <span role="status" className={`${copiedId === 'email' ? tooltipCopied : tooltipOpen} ${hoverId === 'email' || copiedId === 'email' ? 'opacity-100' : ''}`}>
          {copiedId === 'email' ? t.contact.copied : <>{t.contact.copy}<span className={`${tooltipSym} text-[var(--color-200)]`}>⧉</span></>}
        </span>
      </button>
      {noOrphans(t.hero.contactOr)}
      <button
        onClick={() => copy(t.contact.phoneRaw, 'phone')}
        aria-label={`Copy phone: ${t.contact.phone}`}
        className={linkCls}
        onMouseEnter={() => { setHoverId('phone'); if (copiedId !== 'phone') phone.scramble() }}
        onMouseLeave={() => { setHoverId(null); phone.reset() }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle mr-1" aria-hidden="true">
          <path d="M4 1h5v2H4zm5 2h2v4H9zM7 7h2v4H7zm-3 5h2v2H4zM2 3h2v9H2zm7 8h2v2H9zm2 2h2v2h-2zm2 2h4v2h-4zm4-2h4v2h-4zm4 2h2v5h-2zM6 14h2v2H6zm2 2h2v2H8zm2 2h2v2h-2zm2 2h9v2h-9z" />
        </svg>
        <span ref={phone.spanRef} className={wordCls}>{t.contact.phone}</span>
        <span role="status" className={`${copiedId === 'phone' ? tooltipCopied : tooltipOpen} ${hoverId === 'phone' || copiedId === 'phone' ? 'opacity-100' : ''}`}>
          {copiedId === 'phone' ? t.contact.copied : <>{t.contact.copy}<span className={`${tooltipSym} text-[var(--color-200)]`}>⧉</span></>}
        </span>
      </button>
      {noOrphans(t.hero.contactBridge)}
      <a
        href="/olaf-resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download resume (PDF)"
        className={linkCls}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle mr-1" aria-hidden="true">
          <path d="M21 15v4h-2v-4zm-2 4v2H5v-2zM5 15v4H3v-4zm8-12v14h-2V3z" />
          <path d="M7 11v2h10v-2zm2 2v2h2v-2zm4 0v2h2v-2z" />
          <path d="M15 11v2h2v-2z" />
        </svg>
        <span className={wordCls}>{t.hero.closingResume}</span>
      </a>
      {noOrphans(t.hero.closingMid)}
      <a
        href="https://www.linkedin.com/in/olafotrzasek/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile (opens in new tab)"
        className={linkCls}
      >
        <Image src="/logos/linkedin.svg" alt="" width={14} height={14} className="inline-block align-middle mr-1" />
        <span className={wordCls}>{t.hero.closingLinkedin}</span>
      </a>
      {noOrphans(t.hero.closingEnd)}
    </p>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--background)]">
      <div className="max-w-[var(--measure)] mx-auto px-5 pt-[10rem] pb-24">

        {/* ── Hero ── */}
        <section className="mb-16">

          {/* The one-line identity, then the story under it. */}
          <FadeUp delay={0}>
            <p className="text-body-2 font-[450] text-[var(--color-500)] mb-3 text-pretty">
              {noOrphans(t.hero.positioning)}
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="text-body-2 text-[var(--color-500)] mb-8 text-pretty">
              {noOrphans(t.hero.body)}
              <a
                href="https://edrone.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out"
              >
                <Image src="/logos/logoedrone.png" alt="" width={14} height={14} className="inline-block align-middle mr-1" />
                <span className="underline underline-offset-2 decoration-[var(--color-100)]">{t.hero.bodyEdrone}</span>
              </a>
              {noOrphans(t.hero.bodyMid)}
              <a
                href="https://claude.com/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out"
              >
                <Image src="/logos/claude-code.svg" alt="" width={14} height={14} className="inline-block align-middle mr-1" />
                <span className="underline underline-offset-2 decoration-[var(--color-100)]">{t.hero.bodyClaude}</span>
              </a>
              {noOrphans(t.hero.bodyEnd)}
            </p>
          </FadeUp>

          <FadeUp delay={0.12}>
            <ContactBar />
          </FadeUp>
        </section>

        {/* ── Selected Projects ── */}
        <section className="mb-16">
          <FadeUp delay={0}>
            <SectionBadge>{t.sections.projects}</SectionBadge>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="flex flex-col gap-10 sm:gap-16">
              {projects.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
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
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Logo */}
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 p-1 border border-[var(--color-100)] bg-[var(--color-000)] rounded-[0.125rem]">
                    <Image
                      src={job.logo}
                      alt={job.company}
                      width={28}
                      height={28}
                      quality={95}
                      sizes="28px"
                      className="object-contain rounded-[0.125rem]"
                    />
                  </div>

                  {/* Role + company + period (period below on mobile) */}
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:flex-1 sm:min-w-0 sm:justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-eyebrow text-[var(--color-300)] whitespace-nowrap">
                        {job.role}
                      </span>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-eyebrow text-[var(--color-300)] hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out whitespace-nowrap"
                      >
                        {job.companySlug}
                      </a>
                    </div>
                    <span className="text-eyebrow text-[var(--color-300)] whitespace-nowrap">
                      {job.from} – {job.to}
                    </span>
                  </div>
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
