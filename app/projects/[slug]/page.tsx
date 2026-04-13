'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProject, getProjectNavigation } from '@/lib/projects'
import type { ProcessBlock } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Slideshow } from '@/components/slideshow'
import { useScramble } from '@/lib/use-scramble'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 pb-8 sm:p-8 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-full">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-9 right-0 min-h-[2.75rem] px-2 flex items-center text-eyebrow text-[var(--color-300)] hover:text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out focus:outline-none focus-visible:text-[var(--color-500)]"
        >
          Close ✕
        </button>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          unoptimized={src.endsWith('.gif')}
          sizes="(max-width: 768px) 100vw, 1200px"
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
        unoptimized={src.endsWith('.gif')}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 680px"
        className={`${className} cursor-zoom-in transition-opacity duration-[400ms] ease-in-out hover:opacity-80`}
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
      style={{ minHeight: '13.75rem' }}
    >
      <span className="text-eyebrow text-[var(--color-200)]">Image placeholder</span>
    </div>
  )
}

// ─── Image caption ───────────────────────────────────────────────────────────

function Caption({ text }: { text: string }) {
  return (
    <p className="text-body-2 text-[var(--color-300)] mt-3 text-pretty text-center">
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPosition(p => Math.max(p - 5, 0))
    if (e.key === 'ArrowRight') setSliderPosition(p => Math.min(p + 5, 100))
  }, [])

  // Always listen for mouseup/touchend to stop dragging
  useEffect(() => {
    const stop = () => setIsDragging(false)
    document.addEventListener('mouseup', stop)
    document.addEventListener('touchend', stop, { passive: true })
    return () => {
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('touchend', stop)
    }
  }, [])

  // Only attach move listeners while dragging
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX) }
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
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
      className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] select-none cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ aspectRatio: '4/3' }}
      role="slider"
      aria-label="Before / After comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onKeyDown={handleKeyDown}
    >
      {/* After images — stacked, crossfading */}
      {afterImages.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{ opacity: i === activeIndex ? 1 : 0, transition: 'opacity 600ms ease-in-out' }}
        >
          <Image src={img.src} alt={img.label} fill sizes="(max-width: 768px) 100vw, 680px" className="object-cover" />
        </div>
      ))}

      {/* Before image — clipped to left side */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeImage} alt="Before" fill sizes="(max-width: 768px) 100vw, 680px" className="object-cover" />
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
      <div className="absolute top-4 left-4 text-eyebrow text-[var(--color-300)] bg-[var(--color-step-bg)] px-2 py-1 rounded-[0.125rem] shadow-sm z-20 border border-[var(--color-150)]">Before</div>
      <div className="absolute top-4 right-4 text-eyebrow text-white bg-[var(--accent)] px-2 py-1 rounded-[0.125rem] shadow-sm z-20" style={{ transition: 'opacity 400ms ease-in-out' }}>{afterImages[activeIndex].label}</div>
    </div>
  )
}

// ─── Before / After Flow Diagram ─────────────────────────────────────────────

function FlowStep({ label }: { label: string }) {
  return (
    <div
      className="px-4 py-2.5 rounded-[0.125rem] border border-[var(--color-100)] text-body-2 text-[var(--color-400)] text-center"
      style={{ backgroundColor: 'var(--color-step-bg)', minWidth: '8rem' }}
    >
      {label}
    </div>
  )
}

function FlowArrow({ id }: { id: string }) {
  return (
    <div className="flex justify-center py-3">
      <svg width="12" height="20" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <line x1="6" y1="0" x2="6" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd={`url(#${id})`} />
      </svg>
    </div>
  )
}

function BeforeAfterFlow({ before, after, caption }: { before: string[]; after: string[]; caption?: string }) {
  return (
    <div className="my-8">
      <div className="rounded-sm border border-[var(--color-100)] overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-100)]">

          {/* BEFORE */}
          <div className="px-5 pt-5 pb-10 flex flex-col">
            <div className="mb-5">
              <span className="text-eyebrow text-[var(--color-300)] px-2 py-1 rounded-[0.125rem] border border-[var(--color-150)]" style={{ backgroundColor: 'var(--color-step-bg)' }}>
                BEFORE
              </span>
            </div>
            <div className="flex flex-col items-center">
              {before.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <FlowStep label={step} />
                  {i < before.length - 1 && <FlowArrow id={`ba-b-${i}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div className="p-5 flex flex-col">
            <div className="mb-5 flex sm:justify-end">
              <span className="text-eyebrow text-white px-2 py-1 rounded-[0.125rem]" style={{ backgroundColor: 'var(--accent)' }}>
                AFTER
              </span>
            </div>
            <div className="flex flex-col items-center">
              {after.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <FlowStep label={step} />
                  {i < after.length - 1 && <FlowArrow id={`ba-a-${i}`} />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {caption && <Caption text={caption} />}
    </div>
  )
}

// ─── Vertical Flow Diagram ───────────────────────────────────────────────────

function VerticalFlow({ steps, arc, caption }: {
  steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]
  arc?: { fromStep: number; toStep: number; label: string }
  caption?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [arcGeo, setArcGeo] = useState<{ x: number; y1: number; y2: number; midX: number; midY: number } | null>(null)

  useEffect(() => {
    if (!arc) return
    const measure = () => {
      const container = containerRef.current
      const fromEl = stepRefs.current[arc.fromStep]
      const toEl   = stepRefs.current[arc.toStep]
      const prevEl = arc.fromStep > 0 ? stepRefs.current[arc.fromStep - 1] : null
      if (!container || !fromEl || !toEl) return
      const cr = container.getBoundingClientRect()
      const fr = fromEl.getBoundingClientRect()
      const tr = toEl.getBoundingClientRect()
      const x  = fr.right - cr.left + 12
      // y1 = midpoint of the gap/arrow between Signup (step before fromStep) and AI content
      const y1 = prevEl
        ? (prevEl.getBoundingClientRect().bottom + fr.top) / 2 - cr.top
        : fr.top - cr.top
      // y2 = center of Integration
      const y2 = (tr.top + tr.bottom) / 2 - cr.top
      setArcGeo({
        x,
        y1,
        y2,
        midX: x + 48,
        midY: (y1 + y2) / 2,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [arc])

  return (
    <div className="my-8">
      <div
        ref={containerRef}
        className="relative rounded-sm border border-[var(--color-100)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--color-000)' }}
      >
        <div className="flex flex-col items-center max-w-xs mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              {/* Step box */}
              <div
                ref={el => { stepRefs.current[i] = el }}
                className="w-full rounded-[0.125rem] border border-[var(--color-100)] overflow-hidden text-center"
                style={{ backgroundColor: 'var(--color-step-bg)' }}
              >
                <div className="px-5 pt-3">
                  <p className="text-body-1 font-semibold text-[var(--color-500)] text-balance">{step.title}</p>
                </div>
                {step.subtitle && (
                  <div className="px-5 pb-3">
                    <p className="text-body-2 text-[var(--color-300)] text-pretty">{step.subtitle}</p>
                  </div>
                )}
                {/* Mobile annotation — replaces arc on small screens */}
                {step.mobileAnnotation && (
                  <div className="sm:hidden px-5 pb-3">
                    <span className="text-eyebrow text-[var(--accent)]">{step.mobileAnnotation}</span>
                  </div>
                )}
              </div>

              {i < steps.length - 1 && (
                step.labelAfter ? (
                  <div className="flex flex-col items-center py-2 gap-1">
                    <span className="text-eyebrow text-[var(--accent)]">{step.labelAfter}</span>
                    <svg width="12" height="20" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <marker id={`vf-l-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      <line x1="6" y1="0" x2="6" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd={`url(#vf-l-${i})`} />
                    </svg>
                  </div>
                ) : (
                  <FlowArrow id={`vf-${i}`} />
                )
              )}
            </div>
          ))}
        </div>

        {/* Arc annotation — desktop only, measured via refs */}
        {arc && arcGeo && (
          <svg
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none hidden sm:block"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <marker id="vf-arc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            {/* Path from toStep bottom → curves right → fromStep top (arrowhead at top) */}
            <path
              d={`M ${arcGeo.x},${arcGeo.y2} C ${arcGeo.x + 64},${arcGeo.y2} ${arcGeo.x + 64},${arcGeo.y1} ${arcGeo.x},${arcGeo.y1}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              markerEnd="url(#vf-arc-arr)"
            />
          </svg>
        )}
        {/* Arc label — HTML div with background so it sits on top of the arc line */}
        {arc && arcGeo && (
          <div
            aria-hidden="true"
            className="absolute hidden sm:flex items-center pointer-events-none px-1.5 py-0.5 rounded-[0.125rem]"
            style={{
              left: arcGeo.midX,
              top: arcGeo.midY,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-000)',
              fontSize: '0.625rem',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {arc.label}
          </div>
        )}
      </div>
      {caption && <Caption text={caption} />}
    </div>
  )
}

// ─── Contact Flow Diagram ─────────────────────────────────────────────────────

function ContactFlowDiagram({ caption }: { caption?: string }) {
  return (
    <div className="my-8">
      <div
        className="rounded-sm border border-[var(--color-100)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--color-000)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Card: Unidentified contact */}
          <div
            className="flex flex-col items-center gap-3 p-5 rounded-sm border border-[var(--color-100)] w-full sm:w-36 shrink-0"
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-300)]">
              <circle cx="10" cy="7" r="3.5" stroke="currentColor" />
              <path d="M3 20v-1.5C3 15.5 5.5 13.5 10 13.5H12" stroke="currentColor" />
              <circle cx="19" cy="17" r="3.5" stroke="currentColor" />
              <line x1="16.5" y1="19.5" x2="21.5" y2="14.5" stroke="currentColor" />
            </svg>
            <div className="text-center">
              <p className="text-body-2 text-[var(--color-400)] font-medium">Unidentified</p>
              <p className="text-body-2 text-[var(--color-400)] font-medium">contact</p>
            </div>
          </div>

          {/* Connector: dashed → email icon → dashed */}
          <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto gap-3">

            {/* Dashed line with arrowhead — horizontal desktop */}
            <div className="hidden sm:flex flex-1 min-w-0">
              <svg width="100%" height="12" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-1)"/>
              </svg>
            </div>
            {/* Dashed line with arrowhead — vertical mobile */}
            <div className="flex sm:hidden">
              <svg width="12" height="30" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-v1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="6" y1="0" x2="6" y2="30" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-v1)"/>
              </svg>
            </div>

            {/* Email action label */}
            <div className="flex items-center gap-2 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="2" y="5" width="20" height="15" rx="2" fill="var(--accent)" />
                <path d="M2 9l10 6 10-6" stroke="var(--color-000)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-body-2 text-[var(--color-400)] font-medium whitespace-nowrap">Opens an email</span>
            </div>

            {/* Dashed line with arrowhead — horizontal desktop */}
            <div className="hidden sm:flex flex-1 min-w-0">
              <svg width="100%" height="12" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-2)"/>
              </svg>
            </div>
            {/* Dashed line with arrowhead — vertical mobile */}
            <div className="flex sm:hidden">
              <svg width="12" height="30" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-v2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="6" y1="0" x2="6" y2="30" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-v2)"/>
              </svg>
            </div>

          </div>

          {/* Card: Identified contact */}
          <div
            className="flex flex-col items-center gap-3 p-5 rounded-sm border border-[var(--color-100)] w-full sm:w-36 shrink-0"
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="7" r="3.5" stroke="var(--accent-green)" />
              <path d="M3 20v-1.5C3 15.5 5.5 13.5 10 13.5H12" stroke="var(--accent-green)" />
              <path d="M15 17l2 2 4.5-4.5" stroke="var(--accent-green)" />
            </svg>
            <div className="text-center">
              <p className="text-body-2 text-[var(--color-400)] font-medium">Anna Kowalska</p>
              <p className="text-body-2 text-[var(--color-300)]">anna@shop.com</p>
            </div>
          </div>

        </div>
        {caption && (
          <p className="text-body-2 text-[var(--color-300)] text-center mt-6">
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Bold renderer ────────────────────────────────────────────────────────────

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 'var(--font-weight-bold)' }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
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
              <p key={i} className="text-body-1 text-[var(--color-300)] text-pretty mb-5 sm:px-8">
                <Bold text={block.content} />
              </p>
            )

          case 'heading':
            return (
              <p key={i} className="text-body-1 text-[var(--color-500)] font-medium text-pretty mt-8 mb-5 sm:px-8">
                <Bold text={block.content} />
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
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <div className="rounded-[0.125rem] overflow-hidden mb-4">
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

          case 'slideshow':
            return (
              <div key={i} className="group my-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <Slideshow images={block.images} />
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-4">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )

          case 'compare':
            return (
              <div key={i} className="group my-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <div className="rounded-[0.125rem] overflow-hidden mb-4">
                    <CompareSlider
                      beforeImage={block.images[0].src}
                      afterImages={block.images.slice(1)}
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

          case 'vertical-flow':
            return <VerticalFlow key={i} steps={block.steps} arc={block.arc} caption={block.caption} />

          case 'before-after-flow':
            return <BeforeAfterFlow key={i} before={block.before} after={block.after} caption={block.caption} />

          case 'contact-flow':
            return <ContactFlowDiagram key={i} caption={block.caption} />

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
                      <p className="text-body-1 font-medium text-[var(--color-500)]">{step.title}</p>
                      <p className="text-body-2 text-[var(--color-300)] text-pretty">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )

          case 'decisions': {
            const count = block.items.length
            return (
              <div key={i} className="my-8 grid grid-cols-1 sm:grid-cols-2 rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
                {block.items.map((item, j) => {
                  const isLeftCol   = j % 2 === 0
                  const isLastRow   = j >= count - 2  // bottom row on desktop
                  const isLast      = j === count - 1
                  return (
                    <div
                      key={j}
                      className={[
                        'p-5 flex flex-col gap-3',
                        isLeftCol ? 'sm:border-r border-[var(--color-100)]' : '',
                        !isLast ? 'border-b border-[var(--color-100)]' : '',
                        isLastRow && !isLast ? 'sm:border-b-0' : '',
                      ].join(' ')}
                    >
                      <span className="text-eyebrow text-[var(--accent)]">{item.num}</span>
                      <div className="flex flex-col gap-2">
                        <p className="text-body-1 font-bold text-[var(--color-500)] text-pretty">{item.title}</p>
                        <p className="text-body-2 text-[var(--color-300)] text-pretty"><Bold text={item.description} /></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

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
    <main id="main-content" className="min-h-screen bg-background">
      <div className="max-w-[45rem] mx-auto px-5 pt-[10rem] pb-16">

        {/* Header */}
        <section className="mb-16">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="font-display text-[clamp(1.5rem,7vw,2.625rem)] leading-[1.2] text-balance">
              {project.title}
            </h1>
            <p className="text-body-1 text-[var(--color-300)] text-balance">
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
              priority={true}
            />
          </div>

        </section>

        {/* Opportunity */}
        <section className="mb-16">
          <SectionBadge className="sm:ml-8">Opportunity</SectionBadge>

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
                  <p className="text-body-2 text-[var(--color-300)] whitespace-pre-line">{project.overviewDiagram.before}</p>
                </div>
                <div className="flex-1 w-full md:flex md:items-center md:gap-2">
                  <div className="h-px md:flex-1 bg-[var(--color-100)] mb-2 md:mb-0" />
                  <div className="px-3 py-1.5 bg-[var(--accent)] text-[var(--background)] text-eyebrow rounded-[0.125rem] flex items-center gap-2 shrink-0">
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
                  <p className="text-body-2 text-[var(--color-500)] font-medium whitespace-pre-line">{project.overviewDiagram.after}</p>
                </div>
              </div>
              <p className="text-body-2 text-[var(--color-300)] text-center italic">
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
        <section className="mb-16">
          <SectionBadge className="sm:ml-8">Approach</SectionBadge>

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
        <section className="mb-16">
          <SectionBadge className="sm:ml-8">Impact</SectionBadge>

          {project.results.northStar && project.results.note ? (
            /* Layout: left = northStar (label top, value middle, note bottom), right = stacked metrics */
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left — large north star cell */}
              <div
                className="p-5 rounded-sm flex flex-col justify-between"
                style={{ backgroundColor: 'var(--color-000)', minHeight: '13.75rem' }}
              >
                <div className="flex flex-col gap-4">
                  <div className="text-eyebrow text-[var(--color-300)]">
                    {project.results.northStar.label}
                  </div>
                  <div className="font-display text-[var(--accent)] leading-none"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)' }}>
                    {project.results.northStar.value}
                  </div>
                </div>
                <p className="text-body-1 text-[var(--color-300)] text-pretty mt-6">
                  <Bold text={project.results.note!} />
                </p>
              </div>
              {/* Right — stacked metric cells, stretch to match left height */}
              <div className="flex flex-col gap-3">
                {project.results.metrics.map((metric, index) => (
                  <div key={index} className="p-5 rounded-sm flex flex-col flex-1 justify-between" style={{ backgroundColor: 'var(--color-000)' }}>
                    <div className="flex flex-col gap-4">
                      <div className="text-eyebrow text-[var(--color-300)]">{metric.label}</div>
                      <div className={`font-display leading-none ${metric.color === 'accent' ? 'text-[var(--accent)]' : 'text-[var(--color-500)]'}`}
                        style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)' }}>
                        {metric.value}
                      </div>
                    </div>
                    {metric.description && (
                      <p className="text-body-1 text-[var(--color-300)] text-pretty mt-6"><Bold text={metric.description} /></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {project.results.subheadline && (
              <div className="mt-3 p-5 rounded-sm" style={{ backgroundColor: 'var(--color-000)' }}>
                <p className="text-body-1 text-[var(--color-300)] text-pretty"><Bold text={project.results.subheadline} /></p>
              </div>
            )}
            </>
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
                    <div className="font-display text-[clamp(1.75rem,7vw,3rem)] text-[var(--accent)] leading-none">
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
                    <div className={`font-display text-[clamp(1.75rem,7vw,3rem)] leading-none mb-1 ${metric.color === 'accent' ? 'text-[var(--accent)]' : 'text-[var(--color-500)]'}`}>
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
          <section className="mb-16">
            <SectionBadge className="sm:ml-8">{"What's Next"}</SectionBadge>
            <div className="space-y-6 sm:px-8">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-neubit text-[1.25rem] leading-none text-[var(--accent)] shrink-0">▨</span>
                    <p className="text-body-1 font-bold text-[var(--color-500)] text-pretty">{step.title}</p>
                  </div>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project navigation */}
        <div className="flex items-start justify-between gap-8 mb-12">

          {/* PREV */}
          <Link
            href={`/projects/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="group flex flex-col gap-1.5"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-neubit text-[1.25rem] leading-[1] text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out" aria-hidden="true">←</span>
              <span className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">PREV\</span>
            </div>
            <span ref={prevLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {prev.title}
            </span>
          </Link>

          {/* NEXT */}
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="group flex flex-col gap-1.5 items-end text-right"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">/NEXT</span>
              <span className="font-neubit text-[1.25rem] leading-[1] text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out" aria-hidden="true">→</span>
            </div>
            <span ref={nextLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {next.title}
            </span>
          </Link>

        </div>

      </div>
      <ScrollToTop />
    </main>
  )
}
