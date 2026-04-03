// v2
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { useEffect } from 'react'

const experience = [
  { years: '2022 – 2026', company: 'edrone', role: 'Senior Product Designer & Team Lead', logo: '/images/logo-edrone.png' },
  { years: '2021 – 2022', company: 'Deepsolver', role: 'Product Designer', logo: '/images/logo-deepsolver.png' },
  { years: '2019 – 2020', company: 'eq system', role: 'UX Designer', logo: '/images/logo-eqsystem.png' },
  { years: '2018', company: 'Inventive Software', role: 'Junior UX/UI Designer', logo: '/images/logo-inventive.png' },
]

export default function HomePage() {
  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') document.documentElement.classList.add('dark')
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1040px] mx-auto px-6 pt-16 md:pt-24 pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">

          {/* Sidebar */}
          <aside className="w-full md:w-[180px] md:shrink-0 md:sticky md:top-24 md:self-start md:hidden lg:block">
            <div className="hidden lg:block">
              <div className="w-[100px] h-[100px] rounded-lg overflow-hidden mb-4 grayscale-[50%]">
                <Image src="/images/avatar.jpg" alt="Olaf Otrząsek" width={100} height={100} className="w-full h-full object-cover" priority />
              </div>
              <h2 className="font-display text-[20px] leading-tight mb-1">Olaf Otrząsek</h2>
              <p className="text-[14px] text-text-body mb-6">Senior Product Designer</p>
            </div>

            <div className="space-y-0">
              <a href="mailto:olafotrzasek@gmail.com" className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all">
                <span className="truncate">olafotrzasek@gmail.com</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity shrink-0">↗</span>
              </a>
              <a href="/olaf-otrzasek-resume.pdf" target="_blank" className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all">
                <span>Resume</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/olafotrzasek/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all">
                <span>LinkedIn</span>
                <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity">↗</span>
              </a>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <span className="w-2 h-2 bg-accent-green rounded-sm animate-pulse-slow" />
              <span className="text-[11px] font-mono uppercase tracking-wide text-accent-green">Open to opportunities</span>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Hero */}
            <section className="mb-12 md:mb-16">
              <h1 className="font-display text-[clamp(24px,7vw,52px)] leading-[1.1] mb-4 md:mb-6">
                I let the data find the <span className="text-accent-orange">opportunity.</span>
                <br />
                Then I design the experience.
              </h1>
              <p className="text-[14px] md:text-[16px] text-text-body leading-[1.75] max-w-[600px]">
                Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed. Previously led design at{' '}
                <a href="https://edrone.me" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-accent-orange transition-colors">edrone</a>
                {' '}— rebuilt the platform from sales-gated to self-serve freemium. Before that, sole designer at{' '}
                <a href="https://deepsolver.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-accent-orange transition-colors">Deepsolver</a>
                {' '}— two products from zero to launch.
              </p>
            </section>

            {/* P→C→O */}
            <section className="mb-12 md:mb-16 border-l-[3px] border-accent-orange pl-4 md:pl-6">
              <h2 className="font-display text-[clamp(18px,5vw,28px)] leading-tight mb-4">
                <span className="line-through text-text-caption">Problem</span>{' '}
                <span className="line-through text-text-caption">Challenge</span>{' '}
                <span>Opportunity</span>
              </h2>
              <p className="text-[14px] md:text-[16px] text-text-body leading-[1.75]">
                Drop-offs, low usage, churn — not problems to fix. Signals showing where the product has room to grow. I&apos;ve stopped framing design as problem-solving. I frame it as opportunity capture.
              </p>
            </section>

            {/* Selected Projects */}
            <section className="mb-12 md:mb-16">
              <SectionBadge>Selected Projects</SectionBadge>
              <ProjectList />
            </section>

            {/* Experience */}
            <section className="mb-12 md:mb-16">
              <SectionBadge>Experience</SectionBadge>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                    <span className="text-[12px] font-mono text-text-caption w-[60px] md:w-[90px] shrink-0">{exp.years}</span>
                    <div className="w-[22px] h-[22px] rounded-sm bg-border flex items-center justify-center shrink-0 overflow-hidden">
                      {exp.logo
                        ? <Image src={exp.logo} alt={exp.company} width={22} height={22} className="w-full h-full object-contain" />
                        : <span className="text-[10px] font-mono">{exp.company[0]}</span>
                      }
                    </div>
                    <span className="text-[12px] md:text-[14px] text-text-caption">{exp.company}</span>
                    <span className="text-[12px] md:text-[14px] text-text-caption hidden md:inline">/</span>
                    <span className="text-[12px] md:text-[14px] font-medium text-foreground">{exp.role}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-border text-[11px] font-mono text-text-caption">
              <span>© 2026 Olaf Otrząsek</span>
              <span>
                ✦ Built with{' '}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Claude</a>
                {' & '}
                <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">v0.dev</a>
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}

function ProjectList() {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const handleArticleEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-150)'
  }
  const handleArticleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-100)'
  }
  const handleContentEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--color-000)'
    e.currentTarget.style.borderColor = 'var(--color-150)'
  }
  const handleContentLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--background)'
    e.currentTarget.style.borderColor = 'var(--color-100)'
  }

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article
        className="flex overflow-hidden rounded-sm border transition-colors duration-200"
        style={{ borderColor: 'var(--color-100)', height: '280px' }}
        onMouseEnter={handleArticleEnter}
        onMouseLeave={handleArticleLeave}
      >
        {/* Left - thumbnail 55% */}
        <div className="w-[55%] relative shrink-0" style={{ backgroundColor: 'var(--color-000)' }}>
          <Image
            src={project.thumbnailImage}
            alt={project.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>

        {/* Right - content 45% */}
        <div
          className="w-[45%] flex flex-col justify-center p-5 gap-8 border-l transition-colors duration-200"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--color-100)' }}
          onMouseEnter={handleContentEnter}
          onMouseLeave={handleContentLeave}
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-[20px] font-normal leading-[1.6] text-foreground">
              {project.title}
            </h3>
            <p className="text-[14px] font-normal leading-[1.71] text-ink-2">
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
            <span className="opacity-0 group-hover:opacity-100 text-accent-orange transition-opacity duration-200">→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
