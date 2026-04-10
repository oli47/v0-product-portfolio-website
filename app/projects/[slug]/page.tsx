'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProject, getProjectNavigation } from '@/lib/projects'
import type { ProcessBlock } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { useScramble } from '@/lib/use-scramble'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Lightbox ────────────────────────────────────────────────────────────────

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

// ─── Clickable image ─────────────────────────────────────────────────────────

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

// ─── Placeholder image ───────────────────────────────────────────────────────

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={`w-full flex items-center justify-center border border-dashed border-[var(--color-100)] rounded-sm bg-[var(--color-000)] ${className ?? ''}`}
      style={{ minHeight: '220px' }}
    >
      <span className="text-eyebrow text-[var(--color-200)]">Image placeholder</span>
    </div>
  )
}

// ─── Image caption ───────────────────────────────────────────────────────────

function Caption({ text, center }: { text: string; center?: boolean }) {
  return (
    <p className={`text-body-2 text-[var(--color-300)] mt-3 text-pretty${center ? ' text-center' : ''}`}>
      {text}
    </p>
  )
}

// ─── Compare Slider ──────────────────────────────────────────────────────────

function CompareSlider({
  beforeImage,
  afterImages,
}: {
  beforeImage: string
  afterImages: { src: string; label: string }[]
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
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

  // Cycle through after images every 2 s
  useEffect(() => {
    if (afterImages.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % afterImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [afterImages.length])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] select-none cursor-ew-resize"
      style={{ aspectRatio: '4/3' }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After images — stacked, crossfading */}
      {afterImages.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{ opacity: i === activeIndex ? 1 : 0, transition: 'opacity 600ms ease' }}
        >
          <Image src={img.src} alt={img.label} fill className="object-cover" />
        </div>
      ))}

      {/* Before image — clipped to left side */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeImage} alt="Before" fill className="object-cover" />
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[var(--color-500)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--background)] rounded-sm shadow-md flex items-center justify-center border border-[var(--color-100)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-400)]">
            <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 text-[11px] font-mono uppercase tracking-wide text-[var(--color-400)] bg-[var(--background)] px-2 py-1 rounded-sm shadow-sm z-20 border border-[var(--color-100)]">Before</div>
      <div className="absolute top-4 right-4 text-[11px] font-mono uppercase tracking-wide text-[var(--color-400)] bg-[var(--background)] px-2 py-1 rounded-sm shadow-sm z-20 border border-[var(--color-100)]" style={{ transition: 'opacity 300ms ease' }}>{afterImages[activeIndex].label}</div>
    </div>
  )
}

// ─── Process block renderer ───────────────────────────────────────────────────

function ProcessBlocks({ blocks }: { blocks: ProcessBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'text':
            return (
              <p key={i} className="text-body-1 text-[var(--color-300)] text-pretty mb-5">
                {block.content}
              </p>
            )

          case 'heading':
            return (
              <p key={i} className="text-body-1 text-[var(--color-500)] font-medium text-pretty mt-8 mb-5">
                {block.content}
              </p>
            )

          case 'placeholder':
            return (
              <div key={i} className="my-8">
                <PlaceholderImage />
                {block.caption && <Caption text={block.caption} />}
              </div>
            )

          case 'image':
            return (
              <div key={i} className="group my-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-200 group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '16px 16px 20px' }}
                >
                  <div className="rounded-[2px] overflow-hidden mb-4">
                    <ClickableImage
                      src={block.src}
                      alt={block.caption ?? 'Process image'}
                      width={680}
                      height={425}
                      className="w-full h-auto"
                    />
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-0">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )

          case 'compare':
            return (
              <div key={i} className="my-8">
                <CompareSlider
                  beforeImage={block.images[0].src}
                  afterImages={block.images.slice(1)}
                />
                {block.caption && <Caption text={block.caption} center />}
              </div>
            )

          case 'steps':
            return (
              <div key={i} className="space-y-8 my-8">
                {block.items.map((step, j) => (
                  <div key={j} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image or placeholder — narrower on desktop */}
                    <div className="w-full sm:w-[44%] shrink-0">
                      {step.imageSrc ? (
                        <div className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)]" style={{ backgroundColor: 'var(--color-000)' }}>
                          <ClickableImage
                            src={step.imageSrc}
                            alt={step.title}
                            width={300}
                            height={200}
                            className="w-full h-auto"
                          />
                        </div>
                      ) : (
                        <PlaceholderImage className="h-full" />
                      )}
                    </div>

                    {/* Number + title + description */}
                    <div className="flex flex-col gap-1.5 justify-center">
                      <span className="text-eyebrow text-[var(--accent)]">{step.num}</span>
                      <h4 className="text-[15px] font-medium text-[var(--color-500)] leading-snug">{step.title}</h4>
                      <p className="text-[13px] text-[var(--color-300)] leading-[1.7] text-pretty">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  const metricsGridCols = project.results.metrics.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[45rem] mx-auto px-5 pt-[10rem] pb-16">

        {/* Header */}
        <section className="mb-12">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="font-display text-[clamp(24px,7vw,42px)] leading-[1.1]">
              {project.title}
            </h1>
            <p className="text-[14px] md:text-[16px] text-[var(--color-300)] leading-[1.75] text-balance">
              {project.tagline}
            </p>
          </div>

          {/* Hero image */}
          <div className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] mb-8" style={{ backgroundColor: 'var(--color-000)' }}>
            <ClickableImage
              src={project.coverImage}
              alt={project.title}
              width={680}
              height={425}
              className="w-full h-auto"
              priority
            />
          </div>

        </section>

        {/* Opportunity */}
        <section className="mb-12 pb-12 border-b border-[var(--color-100)]">
          <SectionBadge>Opportunity</SectionBadge>

          {project.opportunityBlocks ? (
            <ProcessBlocks blocks={project.opportunityBlocks} />
          ) : (
            <div className="space-y-4">
              {project.opportunity.map((paragraph, index) => (
                <p key={index} className="text-body-1 text-[var(--color-300)] text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {!project.opportunityBlocks && project.overviewDiagram && (
            <div className="mt-8 p-4 md:p-6 bg-[var(--color-000)] rounded-sm border border-[var(--color-100)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--color-100)] rounded-sm flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-[var(--color-300)] whitespace-pre-line">{project.overviewDiagram.before}</p>
                </div>
                <div className="flex-1 w-full md:flex md:items-center md:gap-2">
                  <div className="h-px md:flex-1 bg-[var(--color-100)] mb-2 md:mb-0" />
                  <div className="px-3 py-1.5 bg-blue-600 text-white text-[12px] rounded-sm flex items-center gap-2 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {project.overviewDiagram.action}
                  </div>
                  <div className="h-px md:flex-1 bg-[var(--color-100)] mt-2 md:mt-0" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-sm flex items-center justify-center mb-2 mx-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-[var(--color-500)] font-medium whitespace-pre-line">{project.overviewDiagram.after}</p>
                </div>
              </div>
              <p className="text-[12px] text-[var(--color-300)] text-center italic">
                {project.overviewDiagram.caption}
              </p>
            </div>
          )}

          {!project.opportunityBlocks && project.opportunityExtra && project.opportunityExtra.length > 0 && (
            <div className="space-y-4 mt-6">
              {project.opportunityExtra.map((paragraph, index) => (
                <p key={index} className="text-body-1 text-[var(--color-300)] text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* Process */}
        <section className="mb-12 pb-12 border-b border-[var(--color-100)]">
          <SectionBadge>Process</SectionBadge>

          {project.processContent ? (
            <ProcessBlocks blocks={project.processContent} />
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {project.solution.map((paragraph, index) => (
                  <p key={index} className="text-body-1 text-[var(--color-300)] text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>

              {project.hasCompareSlider && project.compareSliderImages && (
                <CompareSlider
                  beforeImage={project.compareSliderImages.before}
                  afterImages={[{ src: project.compareSliderImages.after, label: 'After' }]}
                />
              )}

              {project.solutionImages && project.solutionImages.map((img, index) => (
                <div key={index} className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] mt-6" style={{ backgroundColor: 'var(--color-000)' }}>
                  <ClickableImage
                    src={img}
                    alt={`Process image ${index + 1}`}
                    width={680}
                    height={425}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </>
          )}
        </section>

        {/* Impact */}
        <section className="mb-12 pb-12 border-b border-[var(--color-100)]">
          <SectionBadge>Impact</SectionBadge>

          {project.results.northStar && project.results.note ? (
            /* Special layout: left = stacked metrics, right = northStar + note */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-3">
                {project.results.metrics.map((metric, index) => (
                  <div key={index} className="p-5 rounded-sm" style={{ backgroundColor: 'var(--color-000)' }}>
                    <div className={`font-display text-[clamp(28px,7vw,48px)] leading-none mb-1 ${metric.color === 'accent' ? 'text-[var(--accent)]' : 'text-[var(--color-500)]'}`}>
                      {metric.value}
                    </div>
                    <div className="text-eyebrow text-[var(--color-300)]">{metric.label}</div>
                    {metric.sublabel && (
                      <div className="text-eyebrow text-[var(--color-200)] mt-0.5">{metric.sublabel}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div className="p-5 rounded-sm flex-1 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-000)' }}>
                  <div>
                    <div className="font-display text-[clamp(28px,7vw,48px)] text-[var(--accent)] leading-none mb-1">
                      {project.results.northStar.value}
                    </div>
                    <div className="text-eyebrow text-[var(--color-300)]">{project.results.northStar.label}</div>
                    {project.results.northStar.sublabel && (
                      <div className="text-eyebrow text-[var(--color-200)] mt-0.5">{project.results.northStar.sublabel}</div>
                    )}
                  </div>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty">{project.results.note}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Default layout */
            <>
              {project.results.northStar && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-5 rounded-sm mb-3" style={{ backgroundColor: 'var(--color-000)' }}>
                  <div className="flex flex-col gap-1">
                    <div className="text-eyebrow text-[var(--color-300)]">{project.results.northStar.label}</div>
                    {project.results.northStar.tag && (
                      <div className="text-eyebrow text-[var(--accent)]">{project.results.northStar.tag}</div>
                    )}
                  </div>
                  <div className="md:text-right">
                    <div className="font-display text-[clamp(28px,7vw,48px)] text-[var(--accent)] leading-none">
                      {project.results.northStar.value}
                    </div>
                    {project.results.northStar.sublabel && (
                      <div className="text-eyebrow text-[var(--color-300)] mt-1">{project.results.northStar.sublabel}</div>
                    )}
                  </div>
                </div>
              )}
              <div className={`grid gap-3 ${metricsGridCols}`}>
                {project.results.metrics.map((metric, index) => (
                  <div key={index} className="p-5 rounded-sm" style={{ backgroundColor: 'var(--color-000)' }}>
                    <div className={`font-display text-[clamp(28px,7vw,48px)] leading-none mb-1 ${metric.color === 'accent' ? 'text-[var(--accent)]' : 'text-[var(--color-500)]'}`}>
                      {metric.value}
                    </div>
                    <div className="text-eyebrow text-[var(--color-300)]">{metric.label}</div>
                    {metric.sublabel && (
                      <div className="text-eyebrow text-[var(--color-200)] mt-0.5">{metric.sublabel}</div>
                    )}
                  </div>
                ))}
              </div>
              {project.results.note && (
                <div className="mt-3 p-5 rounded-sm" style={{ backgroundColor: 'var(--color-000)' }}>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty">{project.results.note}</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* What's Next */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <section className="mb-12 pb-12 border-b border-[var(--color-100)]">
            <SectionBadge>{"What's Next"}</SectionBadge>
            <div className="space-y-6">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-eyebrow text-[var(--accent)] shrink-0 min-w-fit">
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
