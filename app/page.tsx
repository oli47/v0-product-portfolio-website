'use client'

import Image from 'next/image'
import Link from 'next/link'
import { projects, type Project } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { useEffect, useState } from 'react'

// ─── Project Card ──────────────────────────────────────────────────────────

function handleArticleEnter(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = 'var(--color-150)'
}
function handleArticleLeave(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = 'var(--color-100)'
}
function handleContentEnter(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.backgroundColor = 'var(--color-000)'
  e.currentTarget.style.borderColor = 'var(--color-150)'
}
function handleContentLeave(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.backgroundColor = 'var(--background)'
  e.currentTarget.style.borderColor = 'var(--color-100)'
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article
        className="flex flex-col md:flex-row overflow-hidden rounded-sm border transition-colors duration-200"
        style={{ borderColor: 'var(--color-100)' }}
        onMouseEnter={handleArticleEnter}
        onMouseLeave={handleArticleLeave}
      >
        {/* Top / Left — thumbnail */}
        <div
          className="relative w-full md:w-[55%] shrink-0"
          style={{ backgroundColor: 'var(--color-000)', aspectRatio: '16/9' }}
        >
          <Image
            src={project.thumbnailImage}
            alt={project.title}
            fill
            className="object-cover"
            priority={index < 2}
          />
        </div>

        {/* Bottom / Right — content */}
        <div
          className="flex flex-col justify-center p-5 gap-6 border-t md:border-t-0 md:border-l transition-colors duration-200 md:w-[45%]"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--color-100)' }}
          onMouseEnter={handleContentEnter}
          onMouseLeave={handleContentLeave}
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
              <div key={i} className="flex flex-col gap-1">
                <span className={`font-mono text-[12px] font-medium leading-5 ${metric.color === 'accent' ? 'text-accent-orange' : 'text-foreground'}`}>
                  {metric.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 leading-5">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 group-hover:text-foreground transition-colors duration-200">
            VIEW
            <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity duration-200">
              {'→'}
            </span>
          </span>
        </div>
      </article>
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
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ─── Experience data ───────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    logo: '/logos/edrone.jpg',
    company: 'edrone',
    url: 'https://edrone.me',
    role: 'Senior Product Designer & Team Lead',
    period: 'NOV 2022 \u2013 MAR 2026',
  },
  {
    logo: '/logos/deepsolver.jpg',
    company: 'Deepsolver',
    url: 'https://deepsolver.com',
    role: 'Product Designer',
    period: 'NOV 2020 \u2013 OCT 2022',
  },
  {
    logo: '/logos/eqsystem.jpg',
    company: 'eq system',
    url: 'https://eqsystem.pl',
    role: 'UX Designer',
    period: 'SEP 2019 \u2013 JUL 2020',
  },
  {
    logo: '/logos/inventive.jpg',
    company: 'Inventive Software',
    url: 'https://inventivesoftware.pl',
    role: 'Junior UX/UI Designer',
    period: 'JAN 2019 \u2013 JUN 2019',
  },
]

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        {/* Hero */}
        <section className="mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 mb-4">
            Olaf Otrzasek
          </p>
          <h1 className="font-display text-[clamp(28px,6vw,44px)] leading-[1.2] text-foreground mb-6 text-pretty">
            Product designer focused on growth, conversion, and systems that work.
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-2 max-w-xl text-pretty">
            5 years at edrone building SaaS for e-commerce. I work at the intersection of design, data, and product — from 0-to-1 features to conversion optimisation.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="mailto:olaf.otrzasek@gmail.com"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 hover:text-accent-orange transition-colors duration-200"
            >
              Email
            </a>
            <span className="text-ink-3">·</span>
            <a
              href="https://linkedin.com/in/olafotrzasek"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 hover:text-accent-orange transition-colors duration-200"
            >
              LinkedIn
            </a>
            <span className="text-ink-3">·</span>
            <a
              href="/olaf-otrzasek-resume.html"
              target="_blank"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 hover:text-accent-orange transition-colors duration-200"
            >
              Resume
            </a>
          </div>
        </section>

        {/* Selected Projects */}
        <section className="mb-20">
          <div className="mb-8">
            <SectionBadge>Selected Projects</SectionBadge>
          </div>
          <div className="flex flex-col gap-4">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <div className="mb-8">
            <SectionBadge>Experience</SectionBadge>
          </div>
          <div className="flex flex-col">
            {EXPERIENCE.map((job) => (
              <div key={job.company} className="flex items-center justify-between py-4 border-b border-[var(--color-100)] gap-4">
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
            ))}
            <div className="pt-6">
              <a
                href="/olaf-otrzasek-resume.html"
                target="_blank"
                className="group flex items-center justify-between py-2 border-b border-[var(--color-100)] text-[11px] font-mono uppercase tracking-wide text-ink-2 hover:text-accent-orange transition-colors duration-200"
              >
                <span>Full Resume</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity duration-200">{'→'}</span>
              </a>
            </div>
          </div>
        </section>

      </div>
      <ScrollToTop />
    </main>
  )
}
