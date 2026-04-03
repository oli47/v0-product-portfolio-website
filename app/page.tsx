'use client'

import Image from 'next/image'
import Link from 'next/link'
import { projects, type Project } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'

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

          <div className="flex flex-wrap gap-y-1 gap-x-10">
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
            <div className="flex items-start justify-between py-4 border-b border-[var(--color-100)]">
              <div>
                <p className="text-[15px] text-foreground font-normal">edrone</p>
                <p className="text-[13px] text-ink-2 mt-0.5">Product Designer</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 mt-0.5">
                2020 — 2025
              </p>
            </div>
            <div className="flex items-start justify-between py-4 border-b border-[var(--color-100)]">
              <div>
                <p className="text-[15px] text-foreground font-normal">Freelance</p>
                <p className="text-[13px] text-ink-2 mt-0.5">Product Design</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 mt-0.5">
                2018 — 2020
              </p>
            </div>
            <div className="pt-6">
              <a
                href="/olaf-otrzasek-resume.html"
                target="_blank"
                className="group flex items-center justify-between py-2 border-b border-[var(--color-100)] text-[11px] font-mono uppercase tracking-wide text-ink-2 hover:text-accent-orange transition-colors duration-200"
              >
                <span>Full Resume</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity duration-200">→</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
