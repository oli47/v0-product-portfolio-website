'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProject, getProjectNavigation } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { useScramble } from '@/lib/use-scramble'
import { useState, useEffect, useRef, useCallback } from 'react'

// Lightbox Component
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white font-mono text-[12px] uppercase tracking-wide transition-colors"
        >
          Close ✕
        </button>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          className="w-full h-auto rounded-sm"
        />
      </div>
    </div>
  )
}

// Clickable image wrapper
function ClickableImage({ src, alt, width, height, className, priority }: {
  src: string; alt: string; width: number; height: number; className?: string; priority?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} cursor-zoom-in`}
        priority={priority}
        onClick={() => setOpen(true)}
      />
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

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
    const handleMouseMove = (e: MouseEvent) => { if (isDragging) handleMove(e.clientX) }
    const handleTouchMove = (e: TouchEvent) => { if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX) }

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
      className="relative w-full rounded-sm overflow-hidden border border-border select-none cursor-ew-resize"
      style={{ aspectRatio: '16/10' }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <Image src={afterImage} alt="After" fill className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeImage} alt="Before" fill className="object-cover" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-foreground z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-background rounded-sm shadow-md flex items-center justify-center border border-border">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
            <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute top-4 left-4 text-[11px] font-mono uppercase tracking-wide text-foreground bg-background px-2 py-1 rounded-sm shadow-sm z-20 border border-border">Before</div>
      <div className="absolute top-4 right-4 text-[11px] font-mono uppercase tracking-wide text-foreground bg-background px-2 py-1 rounded-sm shadow-sm z-20 border border-border">After</div>
    </div>
  )
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const backLabel = useScramble('Back')
  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  // metrics grid: 3-col if exactly 3 metrics and no northStar, else 2-col
  const metricsGridCols = project.results.metrics.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[45rem] mx-auto px-5 pt-[7.5rem] pb-16">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-eyebrow text-[var(--color-300)] hover:text-[var(--accent)] transition-colors duration-150 mb-10"
          onMouseEnter={backLabel.scramble}
          onMouseLeave={backLabel.reset}
        >
          <span>←</span>
          <span ref={backLabel.spanRef}>Back</span>
        </Link>
        {/* Header */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-0 mb-8">
            <h1 className="font-display text-[clamp(24px,7vw,42px)] leading-[1.1]">
              {project.title.split(' ').map((word, i) => (
                <span key={i}>{word}<br /></span>
              ))}
            </h1>
            <p className="text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75] md:self-end text-balance">
              {project.tagline}
            </p>
          </div>

          {/* Hero image */}
          <div className="relative w-full rounded-sm overflow-hidden border border-border mb-8" style={{ backgroundColor: 'var(--color-000)' }}>
            <ClickableImage
              src={project.coverImage}
              alt={project.title}
              width={680}
              height={425}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-border">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-300)] mb-1">Role</p>
              <p className="text-[12px] md:text-[14px]">{project.meta.role}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-300)] mb-1">Team</p>
              <p className="text-[12px] md:text-[14px]">{project.meta.team}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-300)] mb-1">Duration</p>
              <p className="text-[12px] md:text-[14px]">{project.meta.duration}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-300)] mb-1">Date</p>
              <p className="text-[12px] md:text-[14px]">{project.meta.date}</p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="mb-12 pb-12 border-b border-border">
          <SectionBadge>Overview</SectionBadge>
          <p className="text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75] text-pretty">
            {project.overview}
          </p>

          {project.overviewDiagram && (
            <div className="mt-8 p-4 md:p-6 bg-card rounded-sm border border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-border rounded-sm flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-[var(--color-300)] whitespace-pre-line">{project.overviewDiagram.before}</p>
                </div>
                <div className="flex-1 w-full md:flex md:items-center md:gap-2">
                  <div className="h-px md:flex-1 bg-border border-dashed mb-2 md:mb-0" />
                  <div className="px-3 py-1.5 bg-blue-600 text-white text-[12px] rounded-sm flex items-center gap-2 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {project.overviewDiagram.action}
                  </div>
                  <div className="h-px md:flex-1 bg-border border-dashed mt-2 md:mt-0" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-sm flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-foreground font-medium whitespace-pre-line">{project.overviewDiagram.after}</p>
                </div>
              </div>
              <p className="text-[12px] text-[var(--color-300)] text-center italic">
                {project.overviewDiagram.caption}
              </p>
            </div>
          )}
        </section>

        {/* Opportunity */}
        <section className="mb-12 pb-12 border-b border-border">
          <SectionBadge>Opportunity</SectionBadge>

          {project.opportunityHeadline && (
            <h2 className="font-display text-[clamp(20px,5vw,28px)] text-foreground leading-[1.25] mb-4 text-pretty">
              {project.opportunityHeadline}
            </h2>
          )}

          <ul className="space-y-2 mb-4">
            {project.opportunity.map((item, index) => (
              <li key={index} className="flex gap-3 text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75]">
                <span className="text-[var(--color-300)] shrink-0">•</span>
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>

          {project.opportunityFooter && (
            <p className="text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75] italic text-pretty">
              {project.opportunityFooter}
            </p>
          )}
        </section>

        {/* Solution */}
        <section className="mb-12 pb-12 border-b border-border">
          <SectionBadge>Solution</SectionBadge>

          {project.solutionHeadline && (
            <h2 className="font-display text-[clamp(20px,5vw,28px)] text-foreground leading-[1.25] mb-6 text-pretty">
              {project.solutionHeadline}
            </h2>
          )}

          <div className="space-y-4 mb-8">
            {project.solution.map((paragraph, index) => (
              <p key={index} className="text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75] text-pretty">
                {paragraph}
              </p>
            ))}
          </div>

          {project.hasCompareSlider && project.compareSliderImages && (
            <CompareSlider
              beforeImage={project.compareSliderImages.before}
              afterImage={project.compareSliderImages.after}
            />
          )}

          {project.solutionImages && project.solutionImages.map((img, index) => (
            <div key={index} className="relative w-full rounded-sm overflow-hidden border border-border mt-6" style={{ backgroundColor: 'var(--color-000)' }}>
              <ClickableImage
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
          <SectionBadge>Results</SectionBadge>

          <h2 className="font-display text-[clamp(20px,5vw,28px)] text-foreground leading-[1.25] text-pretty">
            {project.results.headline}
          </h2>
          {project.results.subheadline && (
            <p className="font-display text-[clamp(20px,5vw,28px)] leading-[1.25] text-[var(--color-300)] mb-8 text-pretty">
              {project.results.subheadline}
            </p>
          )}
          {!project.results.subheadline && <div className="mb-8" />}

          {project.results.northStar && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-5 rounded-sm mb-3" style={{ backgroundColor: 'var(--color-000)' }}>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-300)]">
                  {project.results.northStar.label}
                </div>
                {project.results.northStar.tag && (
                  <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent)]">
                    {project.results.northStar.tag}
                  </div>
                )}
              </div>
              <div className="md:text-right">
                <div className="font-display text-[clamp(28px,7vw,48px)] text-[var(--accent)] leading-none">
                  {project.results.northStar.value}
                </div>
                {project.results.northStar.sublabel && (
                  <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-300)] mt-1">
                    {project.results.northStar.sublabel}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`grid gap-3 ${metricsGridCols}`}>
            {project.results.metrics.map((metric, index) => (
              <div key={index} className="p-5 rounded-sm" style={{ backgroundColor: 'var(--color-000)' }}>
                <div className={`font-display text-[clamp(28px,7vw,48px)] leading-none mb-1 ${metric.color === 'accent' ? 'text-[var(--accent)]' : 'text-foreground'}`}>
                  {metric.value}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-300)]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <section className="mb-12 pb-12 border-b border-border">
            <SectionBadge>Next Steps</SectionBadge>
            <div className="space-y-6">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-[12px] md:text-[14px] font-mono text-[var(--accent)] shrink-0 min-w-fit">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-[14px] md:text-[16px] font-medium mb-1 text-pretty">{step.title}</h4>
                    <p className="text-[12px] md:text-[14px] text-[var(--color-300)] leading-[1.75] text-pretty">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project navigation */}
        <div className="flex items-center justify-between gap-8 mb-12">
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex items-center gap-2 min-w-0"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <span className="text-eyebrow text-[var(--color-200)] shrink-0">←</span>
            <span ref={prevLabel.spanRef} className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-150 truncate">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center gap-2 min-w-0"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <span ref={nextLabel.spanRef} className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-150 truncate text-right">
              {next.title}
            </span>
            <span className="text-eyebrow text-[var(--color-200)] shrink-0">→</span>
          </Link>
        </div>

      </div>
    </main>
  )
}
