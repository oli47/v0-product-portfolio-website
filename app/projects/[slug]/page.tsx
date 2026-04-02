'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProject, getProjectNavigation } from '@/lib/projects'
import { useState, useEffect, useRef, useCallback } from 'react'

// Compare Slider Component
function CompareSlider({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleTouchEnd = () => setIsDragging(false)

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleTouchMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging, handleMove])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-md overflow-hidden border border-border select-none cursor-ew-resize"
      style={{ aspectRatio: '16/10' }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After image (full) */}
      <Image src={afterImage} alt="After" fill className="object-cover" />

      {/* Before image (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeImage} alt="Before" fill className="object-cover" />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-foreground z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-background rounded-full shadow-md flex items-center justify-center border border-border">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
            <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 text-[11px] font-mono uppercase tracking-wide text-foreground bg-background px-2 py-1 rounded shadow-sm z-20 border border-border">
        Before
      </div>
      <div className="absolute top-4 right-4 text-[11px] font-mono uppercase tracking-wide text-foreground bg-background px-2 py-1 rounded shadow-sm z-20 border border-border">
        After
      </div>
    </div>
  )
}

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
      {/* Dark mode toggle - hidden for now */}
      {/* <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 h-8 w-8 flex items-center justify-center border border-border rounded-sm bg-background hover:bg-card transition-colors"
      >
        {darkMode ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button> */}

      {/* Back link */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[680px] mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground transition-colors">
            <span>←</span>
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <section className="mb-12">
          {/* Title row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 mb-8">
            <h1 className="font-display text-[42px] leading-[1.1]">
              {project.title.split(' ').map((word, i) => (
                <span key={i}>{word}<br /></span>
              ))}
            </h1>
            <p className="text-[16px] text-text-body leading-[1.75] self-end">
              {project.tagline}
            </p>
          </div>

          {/* Hero image */}
          <div className="relative w-full rounded-md overflow-hidden border border-border mb-8">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={680}
              height={425}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-border">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Role</p>
              <p className="text-[14px]">{project.meta.role}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Team</p>
              <p className="text-[14px]">{project.meta.team}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Duration</p>
              <p className="text-[14px]">{project.meta.duration}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-text-caption mb-1">Date</p>
              <p className="text-[14px]">{project.meta.date}</p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Overview
          </div>
          <p className="text-[16px] text-text-body leading-[1.75]">
            {project.overview}
          </p>

          {/* Overview Diagram */}
          {project.overviewDiagram && (
            <div className="mt-8 p-6 bg-card rounded-md border border-border">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-border rounded-md flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-text-caption">{project.overviewDiagram.before}</p>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-px bg-border border-dashed" />
                  <div className="px-3 py-1.5 bg-blue-600 text-white text-[12px] rounded flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {project.overviewDiagram.action}
                  </div>
                  <div className="flex-1 h-px bg-border border-dashed" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent-orange/10 rounded-md flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-orange">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-foreground font-medium whitespace-pre-line">{project.overviewDiagram.after}</p>
                </div>
              </div>
              <p className="text-[12px] text-text-caption text-center italic">
                {project.overviewDiagram.caption}
              </p>
            </div>
          )}
        </section>

        {/* Opportunity */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Opportunity
          </div>
          
          {project.opportunityHeadline && (
            <h3 className="font-display text-[24px] leading-[1.3] mb-4">
              {project.opportunityHeadline}
            </h3>
          )}

          <ul className="space-y-2 mb-4">
            {project.opportunity.map((item, index) => (
              <li key={index} className="flex gap-3 text-[16px] text-text-body leading-[1.75]">
                <span className="text-text-caption">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {project.opportunityFooter && (
            <p className="text-[16px] text-text-body leading-[1.75] italic">
              {project.opportunityFooter}
            </p>
          )}
        </section>

        {/* Solution */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
            Solution
          </div>
          
          {project.solutionHeadline && (
            <h3 className="font-display text-[24px] leading-[1.3] mb-6">
              {project.solutionHeadline}
            </h3>
          )}

          <div className="space-y-4 mb-8">
            {project.solution.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-text-body leading-[1.75]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Compare Slider for Signup Redesign */}
          {project.hasCompareSlider && project.compareSliderImages && (
            <CompareSlider 
              beforeImage={project.compareSliderImages.before} 
              afterImage={project.compareSliderImages.after} 
            />
          )}

          {/* Solution Images */}
          {project.solutionImages && project.solutionImages.map((img, index) => (
            <div key={index} className="relative w-full rounded-md overflow-hidden border border-border mt-6">
              <Image
                src={img}
                alt={`Solution ${index + 1}`}
                width={680}
                height={425}
                className="w-full h-auto"
              />
            </div>
          ))}
        </section>

        {/* Results */}
        <section className="mb-12 pb-12 border-b border-border">
          <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-4">
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
                  <span className="inline-block px-2 py-0.5 bg-accent-orange text-white text-[10px] font-mono uppercase rounded-sm">
                    {project.results.northStar.tag}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-display text-[36px] text-accent-orange leading-none">
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
          <div className={`grid gap-4 ${project.results.metrics.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {project.results.metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-card rounded-md border border-border">
                <div className={`font-display text-[28px] leading-none mb-2 ${metric.color === 'accent' ? 'text-accent-orange' : 'text-foreground'}`}>
                  {metric.value}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wide text-text-caption">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <section className="mb-12 pb-12 border-b border-border">
            <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-6">
              Next Steps
            </div>
            <div className="space-y-6">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-[14px] font-mono text-accent-orange shrink-0">
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
        <div className="flex items-center justify-between mb-12">
          <Link 
            href={`/projects/${prev.slug}`}
            className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground transition-colors"
          >
            <span>←</span>
            <span>Previous / {prev.title}</span>
          </Link>
          <Link 
            href={`/projects/${next.slug}`}
            className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground transition-colors"
          >
            <span>{next.title} / Next</span>
            <span>→</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-center gap-8 pt-8 border-t border-border text-[11px] font-mono text-text-caption">
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
