'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { projects, type Project } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { FadeUp } from '@/components/fade-up'
import { useEffect, useState } from 'react'

// ─── Project Card ──────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <motion.article
        className="flex flex-col md:flex-row overflow-hidden rounded-sm border"
        style={{ borderColor: 'var(--color-100)' }}
        whileHover={{ scale: 1.015, borderColor: '#D9D0BC' }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {/* Top / Left — thumbnail */}
        <div
          className="relative w-full md:w-[55%] shrink-0 flex items-end justify-center"
          style={{ backgroundColor: 'var(--color-000)', aspectRatio: '16/9' }}
        >
          <Image
            src={project.thumbnailImage}
            alt={project.title}
            fill
            className="object-contain object-bottom"
            priority={index < 3}
          />
        </div>

        {/* Bottom / Right — content */}
        <div
          className="flex flex-col justify-center p-5 gap-6 border-t md:border-t-0 md:border-l md:w-[45%]"
          style={{ backgroundColor: 'var(--background)', borderColor: 'inherit' }}
        >
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-[20px] font-normal leading-[1.5] text-foreground text-pretty">
              {project.title}
            </h3>
            <p className="text-[14px] font-normal leading-[1.71] text-ink-2 text-pretty">
              {project.description}
            </p>
          </div>

          <div className="flex flex-row gap-8">
            {project.metrics.slice(0, 2).map((metric, i) => (
              <div key={i} className="flex flex-row md:flex-col gap-2 md:gap-1">
                <span className={`font-mono text-[12px] font-medium leading-5 ${metric.color === 'accent' ? 'text-accent-orange' : 'text-foreground'}`}>
                  {metric.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 leading-5">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 group-hover:text-foreground transition-colors duration-150">
            DISCOVER
            <span className="opacity-0 group-hover:opacity-100 text-accent-orange text-[20px] leading-[1] transition-opacity duration-150" style={{ fontFamily: "'PPNeueBit', monospace" }}>
              {'→'}
            </span>
          </span>
        </div>
      </motion.article>
    </Link>
  )
}

// ─── Scroll To Top ─────────────────────────────────────────────────────────

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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-9 h-9 rounded-sm border border-[var(--color-150)] bg-background text-ink-2 hover:text-accent-orange hover:border-[var(--color-150)] transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 200ms, transform 200ms, color 200ms',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

// ─── Experience data ───────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    logo: '/logos/logoedrone.png',
    company: 'edrone',
    url: 'https://edrone.me',
    role: 'Senior Product Designer & Team Lead',
    period: 'NOV 2022 \u2013 MAR 2026',
  },
  {
    logo: '/logos/logodeepsolver.png',
    company: 'Deepsolver',
    url: 'https://deepsolver.com',
    role: 'Product Designer',
    period: 'NOV 2020 \u2013 OCT 2022',
  },
  {
    logo: '/logos/logoeq.png',
    company: 'eq system',
    url: 'https://www.eqsystem.pl/en/',
    role: 'UX Designer',
    period: 'SEP 2019 \u2013 JUL 2020',
  },
  {
    logo: '/logos/logois.png',
    company: 'Inventive Software',
    url: 'https://inventivesoftwarellc.com/',
    role: 'Junior UX/UI Designer',
    period: 'JAN 2019 \u2013 JUN 2019',
  },
]

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyClick = (e: React.MouseEvent<HTMLButtonElement>, text: string, id: string) => {
    e.preventDefault()
    setCopiedId(id)
    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  useEffect(() => {
    const equalizeCardHeights = () => {
      const articles = document.querySelectorAll('section.mb-20:nth-of-type(2) > div > a > article')
      if (!articles.length) return

      const isDesktop = window.innerWidth >= 768

      articles.forEach((article) => {
        ;(article as HTMLElement).style.minHeight = 'auto'
      })

      const maxHeight = Array.from(articles).reduce((max, article) => {
        const height = (article as HTMLElement).offsetHeight
        return Math.max(max, height)
      }, 0)

      articles.forEach((article) => {
        ;(article as HTMLElement).style.minHeight = `${maxHeight}px`
      })
    }

    equalizeCardHeights()
    window.addEventListener('resize', equalizeCardHeights)
    return () => window.removeEventListener('resize', equalizeCardHeights)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 md:pt-28 md:pb-24">

        {/* Hero */}
        <section className="mb-20">
          <FadeUp delay={0}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 mb-4">
              Olaf Otrzasek
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-display text-[clamp(28px,6vw,44px)] leading-[1.2] text-foreground mb-6 text-pretty">
              I let the data find the <span className="text-accent-orange">opportunity.</span>
              <br /> Then I design the experience.
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="text-[15px] leading-relaxed text-ink-2 text-pretty">
              Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed. Previously led design at <a href="https://edrone.me/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-[var(--color-150)] hover:text-accent-orange transition-colors duration-200">edrone</a>, rebuilding the platform from sales-gated to self-serve freemium. Before that, sole designer at <a href="https://deepsolver.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-[var(--color-150)] hover:text-accent-orange transition-colors duration-200">Deepsolver</a> & <a href="https://plogenius.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-[var(--color-150)] hover:text-accent-orange transition-colors duration-200">PLO Genius</a>, two products from zero to launch.
            </p>
          </FadeUp>

          <FadeUp delay={0.24}>
          <div className="flex flex-row gap-0 mt-8 border border-[#E3DDCF] rounded-sm overflow-hidden w-fit">
            {/* Resume */}
            <a
              href="/olaf-otrzasek-resume.html"
              target="_blank"
              className="flex flex-row items-center gap-1.5 px-4 py-2 border-r border-[#E3DDCF] hover:bg-[var(--color-000)] transition-colors duration-200"
            >
              <span className="font-mono text-[12px] font-medium underline underline-offset-2 decoration-[#E3DDCF] uppercase tracking-[0.15em] text-[#525252] hover:text-accent-orange transition-colors duration-200">
                Resume
              </span>
              <span className="text-[#525252] text-[20px] leading-[1]" style={{ fontFamily: "'PPNeueBit', monospace" }}>
                ↗
              </span>
            </a>

            {/* Email */}
            <div className="relative">
              <button
                onClick={(e) => handleCopyClick(e, 'olafotrzasek@gmail.com', 'email')}
                className="flex flex-row items-center gap-1.5 px-4 py-2 border-r border-[#E3DDCF] hover:bg-[var(--color-000)] transition-colors duration-200 cursor-pointer"
              >
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-[#525252] hover:text-accent-orange transition-colors duration-200">
                  olafotrzasek@gmail.com
                </span>
                <span className="text-[#525252] text-[14px] leading-[1]" style={{ fontFamily: "'PPNeueBit', monospace", paddingTop: '4px' }}>
                  ⧉
                </span>
              </button>
              {copiedId === 'email' && (
                <div className="absolute top-full left-0 mt-1 whitespace-nowrap text-[11px] font-mono text-accent-orange">
                  ✓ COPIED
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <button
                onClick={(e) => handleCopyClick(e, '732188613', 'phone')}
                className="flex flex-row items-center gap-1.5 px-4 py-2 border-r border-[#E3DDCF] hover:bg-[var(--color-000)] transition-colors duration-200 cursor-pointer"
              >
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-[#525252] hover:text-accent-orange transition-colors duration-200">
                  732188613
                </span>
                <span className="text-[#525252] text-[14px] leading-[1]" style={{ fontFamily: "'PPNeueBit', monospace", paddingTop: '4px' }}>
                  ⧉
                </span>
              </button>
              {copiedId === 'phone' && (
                <div className="absolute top-full left-0 mt-1 whitespace-nowrap text-[11px] font-mono text-accent-orange">
                  ✓ COPIED
                </div>
              )}
            </div>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/olafotrzasek"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-1.5 px-4 py-2 hover:bg-[var(--color-000)] transition-colors duration-200"
            >
              <span className="font-mono text-[12px] font-medium underline underline-offset-2 decoration-[#E3DDCF] uppercase tracking-[0.15em] text-[#525252] hover:text-accent-orange transition-colors duration-200">
                LinkedIn
              </span>
              <span className="text-[#525252] text-[20px] leading-[1]" style={{ fontFamily: "'PPNeueBit', monospace" }}>
                ↗
              </span>
            </a>
          </div>
          </FadeUp>
        </section>

        {/* Selected Projects */}
        <section className="mb-20">
          <FadeUp delay={0}>
            <div className="mb-8">
              <SectionBadge>Selected Projects</SectionBadge>
            </div>
          </FadeUp>
          <div className="flex flex-col gap-4">
            {projects.map((project, index) => (
              <FadeUp key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} index={index} />
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <FadeUp delay={0}>
            <div className="mb-8">
              <SectionBadge>Experience</SectionBadge>
            </div>
          </FadeUp>
          <div className="flex flex-col">
            {EXPERIENCE.map((job, index) => (
              <FadeUp key={job.company} delay={index * 0.08}>
                <div className="flex items-center justify-between py-4 border-b border-[var(--color-100)] gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg border border-[var(--color-100)] overflow-hidden shrink-0 flex items-center justify-center bg-white">
                      <Image src={job.logo} alt={job.company} width={40} height={40} className="object-contain" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-foreground underline underline-offset-2 decoration-[var(--color-150)] hover:text-accent-orange transition-colors duration-200 shrink-0"
                      >
                        {job.company}
                      </a>
                      <span className="text-ink-3 text-[14px]">/</span>
                      <span className="text-[14px] font-medium text-foreground">{job.role}</span>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 shrink-0 whitespace-nowrap">
                    {job.period}
                  </p>
                </div>
              </FadeUp>
            ))}
            <FadeUp delay={EXPERIENCE.length * 0.08}>
              <div className="pt-6">
                <a
                  href="/olaf-otrzasek-resume.html"
                  target="_blank"
                  className="group flex items-center justify-between py-2 border-b border-[var(--color-100)] text-[11px] font-mono uppercase tracking-wide text-ink-2 hover:text-accent-orange transition-colors duration-200"
                >
                  <span>Full Resume</span>
                  <span className="opacity-0 group-hover:opacity-100 text-accent-orange text-[20px] leading-[1] transition-opacity duration-200" style={{ fontFamily: "'PPNeueBit', monospace" }}>{'→'}</span>
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>
      <ScrollToTop />
    </main>
  )
}
