'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProject, getProjectNavigation } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'
import { CohortChart } from '@/components/cohort-chart'
import { MetricMain } from '@/components/metric-card'
import { ProcessBlocks } from '@/components/process-blocks'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SectionBadge } from '@/components/section-badge'
import { SectionNav, sectionId } from '@/components/section-nav'
import { useScramble } from '@/lib/use-scramble'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  // A metric carrying a chart takes the full width below the grid — the chart
  // belongs to its number, so the two are never separate blocks.
  const plainMetrics = project.results.metrics.filter((m) => !m.chart)
  const chartedMetrics = project.results.metrics.filter((m) => m.chart)

  const metricsGridCols = plainMetrics.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : plainMetrics.length === 1
      ? 'grid-cols-1'
      : 'grid-cols-1 md:grid-cols-2'

  const hasReflections = project.reflections && project.reflections.length > 0
  const navItems = [
    ...project.sections.map((section) => section.badge),
    'Impact',
    ...(hasReflections ? ['Reflections'] : []),
  ]

  return (
    // The rail hands back how much room the last section needs to be able to
    // reach the top of the window; without it the foot of the page is a set of
    // links that cannot be followed. Zero below 1200px, where there is no rail.
    <main id="main-content" className="min-h-screen bg-background" style={{ paddingBottom: 'var(--section-tail, 0px)' }}>
      <div className="max-w-[var(--measure)] mx-auto px-5 pt-[10rem] pb-16 flex flex-col gap-16">

        {/* Header */}
        <section>
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="font-display text-[clamp(1.5rem,7vw,2.625rem)] leading-[1.2] text-balance">
              {project.title}
            </h1>
            {/* Fills the line rather than balancing it. Balancing evened the two
                lines out and split "5,050" from "stores", which reads as a
                stumble every time. */}
            <p className="text-body-1 text-[var(--color-500)]">
              {project.tagline}
            </p>
          </div>

          {/* Hero — a coded demo where the project has one, the cover PNG otherwise.
              It enlarges on click like the screenshots do, but skips the hover
              tint, which coded demos do not take anywhere else either. It sits
              flush with the card's bottom edge, the way the `center-bottom` covers
              do, so the screen reads as standing on the card rather than floating.
              The compact stage: the tall one is only needed further down the page,
              where the old four-field form has to fit beside this one. */}
          {project.demo ? (
            <div className="sm:-mx-8">
              <div
                className="w-full rounded-sm"
                // Wider inset at the sides than above; flush with the bottom
                // edge, the way the `center-bottom` covers sit.
                // Side inset is capped by the demos, not by taste: they switch
                // to the phone layout below a 520px stage, and the narrowed page
                // column leaves only so much to give away. 2rem keeps the hero
                // on the desktop layout; 4rem pushed it under.
                style={{ backgroundColor: 'var(--color-000)', padding: '2rem 2rem 0' }}
              >
                <ClickableDemo id={project.demo} label={project.title} variant="compact" />
              </div>
            </div>
          ) : (
            <div className="group sm:-mx-8">
              <div
                className="w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]"
                style={{
                  backgroundColor: 'var(--color-000)',
                  padding: project.coverImagePosition === 'bottom-right'
                    ? '1rem 0 0 0'
                    : project.coverImagePosition === 'center-bottom'
                    ? '1rem 1rem 0'
                    : '1rem 1rem 1.25rem',
                }}
              >
                <div className="rounded-[0.125rem] overflow-hidden">
                  <ClickableImage
                    src={project.coverImage}
                    alt={project.title}
                    width={680}
                    height={425}
                    className="w-full h-auto"
                    priority={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Project meta — role, team, duration.
              Three columns above sm. Below it, one row each with the value
              pushed to the right edge: stacked label-over-value in a narrow
              two-column grid left a ragged third cell and a lot of empty space
              beside the short values, and a phone has the width for a list but
              not for a grid. */}
          <dl className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-x-12 sm:gap-y-4 mt-8 pb-6 border-b border-[var(--color-100)]">
            {([
              ['Role', project.meta.role],
              ['Team', project.meta.team],
              ['Duration', project.meta.duration],
            ] as const).map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 sm:flex-col sm:items-start sm:justify-start sm:gap-1.5"
              >
                <dt className="text-eyebrow text-[var(--color-400)] shrink-0">{label.toUpperCase()}</dt>
                {/* A comma-separated value gets one line per item. Left to wrap,
                    "1 Front-end dev, 1 Back-end dev" broke inside "Back-end"
                    instead of at the comma, which is the only place it should. */}
                <dd className="text-body-2 text-[var(--color-500)] text-pretty text-right sm:text-left">
                  {value.split(', ').map((part) => (
                    <span key={part} className="block">{part}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

        </section>

        {/* Narrative sections — badges and order come from the project data */}
        {project.sections.map((section) => (
          <section key={section.badge} id={sectionId(section.badge)}>
            <SectionBadge>{section.badge}</SectionBadge>
            <ProcessBlocks blocks={section.blocks} />
          </section>
        ))}

        {/* Impact */}
        <section id={sectionId('Impact')}>
          <SectionBadge>Impact</SectionBadge>

          {project.results.northStar && project.results.note && project.results.metrics.length > 0 ? (
            /* 2-col layout: the north star on the left, the rest stacked on
               the right. One card component throughout — a second, quieter one
               only ever meant the same numbers were set smaller on the page
               where they mattered most. */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:-mx-8">
              <MetricMain
                label={project.results.northStar.label}
                value={project.results.northStar.value}
                note={project.results.note}
              />
              <div className="flex flex-col gap-3">
                {project.results.metrics.map((metric, index) => (
                  <MetricMain key={index} label={metric.label} value={metric.value} note={metric.description} />
                ))}
              </div>
            </div>
          ) : project.results.northStar && project.results.note && project.results.metrics.length === 0 ? (
            /* Single-wide: one MetricMain full-width */
            <MetricMain
              label={project.results.northStar.label}
              value={project.results.northStar.value}
              note={project.results.note}
              className="sm:-mx-8"
            />
          ) : (
            /* Default layout: grid of MetricMain cards */
            <>
              {project.results.northStar && (
                <MetricMain
                  label={project.results.northStar.label}
                  value={project.results.northStar.value}
                  className="mb-3 sm:-mx-8"
                />
              )}
              {plainMetrics.length > 0 && (
                <div className={`grid gap-3 sm:-mx-8 ${metricsGridCols}`}>
                  {plainMetrics.map((metric, index) => (
                    <MetricMain
                      key={index}
                      label={metric.label}
                      value={metric.value}
                      note={metric.description}
                    />
                  ))}
                </div>
              )}
              {chartedMetrics.map((metric, index) => (
                <MetricMain
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  note={metric.description}
                  className="mt-3 sm:-mx-8"
                >
                  <CohortChart
                    data={metric.chart!.data}
                    seriesLabel={metric.chart!.seriesLabel}
                  />
                </MetricMain>
              ))}
              {project.results.note && (
                <div className="mt-3 p-5 rounded-sm sm:-mx-8" style={{ backgroundColor: 'var(--color-000)' }}>
                  <p className="text-body-1 text-[var(--color-500)] text-pretty"><Bold text={project.results.note} /></p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Reflections */}
        {hasReflections && (
          <section id={sectionId('Reflections')}>
            <SectionBadge>Reflections</SectionBadge>
            <div className="flex flex-col gap-4">
              {project.reflections.map((text, index) => (
                <p key={index} className="text-body-1 text-[var(--color-500)] text-pretty">
                  <Bold text={text} />
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Project navigation */}
        <div className="flex items-start justify-between gap-8 mt-12">

          {/* PREV */}
          <Link
            href={`/projects/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="group flex flex-col gap-1.5 p-3 -m-3"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M14 8H2M7 3L2 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
              <span className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">PREV\</span>
            </div>
            <span ref={prevLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {prev.title}
            </span>
          </Link>

          {/* NEXT */}
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="group flex flex-col gap-1.5 items-end text-right p-3 -m-3"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">/NEXT</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M2 8h12M9 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
            </div>
            <span ref={nextLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {next.title}
            </span>
          </Link>

        </div>

      </div>
      <SectionNav items={navItems} />
      <ScrollToTop />
    </main>
  )
}
