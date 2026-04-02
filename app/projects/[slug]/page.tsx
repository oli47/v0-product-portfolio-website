'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects, getProject, getProjectNavigation } from '@/lib/projects'
import { useState, useEffect } from 'react'

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  if (!project) {
    notFound()
  }

  const { prev, next } = getProjectNavigation(slug)

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1040px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[14px] font-medium text-text-caption hover:text-foreground transition-colors">
            <span>←</span>
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="h-7 px-2 text-[12px] font-mono border border-border rounded-sm hover:bg-border/50 transition-colors">
              EN / PL
            </button>
            <button 
              onClick={toggleDarkMode}
              className="h-7 w-7 flex items-center justify-center border border-border rounded-sm hover:bg-border/50 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[680px] mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <section className="mb-12">
          {/* Eyebrow */}
          <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Case Study · edrone · {project.meta.timeline}
          </div>

          {/* Title */}
          <h1 className="font-display text-[42px] leading-[1.1] mb-4">
            {project.title}
          </h1>

          {/* Tagline */}
          <p className="text-[16px] text-text-body leading-[1.75] mb-8">
            {project.tagline}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-8 py-4 border-t border-b border-border mb-8">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Role</p>
              <p className="text-[14px] font-medium">{project.meta.role}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Team</p>
              <p className="text-[14px] font-medium">{project.meta.team}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Duration</p>
              <p className="text-[14px] font-medium">{project.meta.timeline}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Date</p>
              <p className="text-[14px] font-medium">2025-2026</p>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative w-full rounded-md overflow-hidden border border-border">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={680}
              height={425}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        {/* Overview */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Overview
          </div>
          <p className="text-[16px] text-text-body leading-[1.75]">
            {project.overview}
          </p>
        </section>

        {/* Opportunity */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Opportunity
          </div>
          <ul className="space-y-2">
            {project.opportunity.map((item, index) => (
              <li key={index} className="flex gap-3 text-[16px] text-text-body leading-[1.75]">
                <span className="text-text-caption">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Solution */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Solution
          </div>
          
          {project.solutionCallout && (
            <div className="border-l-[3px] border-[#C8440A] pl-6 mb-6">
              <p className="text-[18px] font-display leading-[1.5]">
                {project.solutionCallout}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {project.solution.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-text-body leading-[1.75]">
                {paragraph}
              </p>
            ))}
          </div>

          {project.solutionImage && (
            <div className="relative w-full rounded-md overflow-hidden border border-border mt-8">
              <Image
                src={project.solutionImage}
                alt="Solution"
                width={680}
                height={425}
                className="w-full h-auto"
              />
            </div>
          )}
        </section>

        {/* Results */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Results
          </div>
          
          <h3 className="font-display text-[28px] leading-[1.2] mb-2">
            {project.results.headline}
          </h3>
          {project.results.subheadline && (
            <p className="font-display text-[28px] leading-[1.2] text-text-body mb-8">
              {project.results.subheadline}
            </p>
          )}

          {/* North Star metric */}
          {project.results.northStar && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-card rounded-md border border-border mb-6">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">
                  {project.results.northStar.label}
                </div>
                {project.results.northStar.tag && (
                  <span className="inline-block px-2 py-0.5 bg-[#C8440A] text-white text-[10px] font-mono uppercase rounded-sm">
                    {project.results.northStar.tag}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-display text-[36px] text-[#C8440A] leading-none">
                  {project.results.northStar.value}
                </div>
                {project.results.northStar.sublabel && (
                  <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mt-1">
                    {project.results.northStar.sublabel}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-4">
            {project.results.metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-card rounded-md border border-border">
                <div className={`font-display text-[28px] leading-none mb-2 ${metric.color === 'accent' ? 'text-[#C8440A]' : 'text-foreground'}`}>
                  {metric.value}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption">
                  {metric.label}
                </div>
                {metric.sublabel && (
                  <div className="text-[10px] font-mono text-text-caption mt-1">
                    {metric.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <section className="mb-12 pb-12 border-b border-border">
            <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-6">
              Next Steps
            </div>
            <div className="space-y-6">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-[14px] font-mono text-[#C8440A] shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-[16px] font-medium mb-1">{step.title}</h4>
                    <p className="text-[14px] text-text-body leading-[1.75]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project navigation */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <Link 
            href={`/projects/${prev.slug}`}
            className="p-4 border border-border rounded-md hover:border-[#C8440A] transition-colors"
          >
            <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">
              ← Previous
            </div>
            <div className="text-[14px] font-medium">{prev.title}</div>
          </Link>
          <Link 
            href={`/projects/${next.slug}`}
            className="p-4 border border-border rounded-md hover:border-[#C8440A] transition-colors text-right"
          >
            <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">
              Next →
            </div>
            <div className="text-[14px] font-medium">{next.title}</div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-8 border-t border-border text-[11px] font-mono text-text-caption">
          <span>© 2026 Olaf Otrząsek</span>
          <span>
            ✦ Built with{' '}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Claude</a>
            {' & '}
            <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">v0.dev</a>
          </span>
        </footer>
      </div>
    </main>
  )
}
