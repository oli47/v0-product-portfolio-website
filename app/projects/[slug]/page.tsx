'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProject, getProjectNavigation, type Project } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'
import { CohortChart } from '@/components/cohort-chart'
import { Collapse } from '@/components/collapse'
import { FadeUp } from '@/components/fade-up'
import { ImpactSummaryCard, OutcomeCard } from '@/components/metric-card'
import { CardSentence } from '@/components/card-sentence'
import { BLEED_VISUAL, FRAME_PAD, ProcessBlocks } from '@/components/process-blocks'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SectionBadge, sectionId } from '@/components/section-badge'
import { useScramble } from '@/lib/use-scramble'

// ─── Page ────────────────────────────────────────────────────────────────────
//
// Every case study reads Problem, Research, Solution, Outcome. The first
// section in the data is Context: it folds into a closed box at Problem's foot
// rather than standing as a section of its own. Reflections read under the
// Outcome card.

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  const [context, ...sections] = project.sections
  // Every section after Context, plus Outcome: the count the step marks fill.
  const steps = sections.length + 1

  return (
    <main id="main-content" className="min-h-screen bg-background overflow-x-clip">
      <div className="max-w-[var(--measure)] mx-auto px-5 pt-[10rem] pb-16 flex flex-col gap-24">

        {/* Header. It takes back 32px of the 96px section gap under it, so the
            sentence sits 64px from the hero and 64px from Problem. */}
        <section className="-mb-8">

          {/* Hero: a coded demo where the project has one, the cover PNG
              otherwise. Both enlarge on click and stand on the mat's foot. */}
          {project.demo ? (
            <div className={BLEED_VISUAL}>
              <div
                className={`w-full rounded-sm ${FRAME_PAD} pb-0 sm:pb-0`}
                style={{ backgroundColor: 'var(--color-000)' }}
              >
                <ClickableDemo id={project.demo} label={project.title} variant="compact" />
              </div>
            </div>
          ) : (
            <div className={`group ${BLEED_VISUAL}`}>
              {/* Same mat, with the sides or the foot dropped where the cover
                  is meant to run off the edge rather than sit inside it. */}
              <div
                className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)] ${FRAME_PAD} ${
                  project.coverImagePosition === 'bottom-right' ? 'px-0 sm:px-0 pb-0 sm:pb-0'
                  : project.coverImagePosition === 'center-bottom' ? 'pb-0 sm:pb-0'
                  : ''
                }`}
                style={{ backgroundColor: 'var(--color-000)' }}
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

          {/* The card sentence the home rows roll on, under the hero: the
              screen first, the sentence that sums it up. */}
          <div className="flex flex-col gap-3 mt-16">
            <h1 className="text-headline text-pretty">
              <CardSentence text={project.card.text} />
            </h1>
          </div>

        </section>

        {sections.map((section, index) => (
          <FadeUp key={section.badge} scrollLinked>
            <section id={sectionId(section.badge)}>
              <SectionBadge step={{ index: index + 1, total: steps }}>{section.badge}</SectionBadge>
              <ProcessBlocks blocks={section.blocks} />
              {/* Context folds into Problem's foot, part of that section rather
                  than a block of its own between two. */}
              {index === 0 && context && (
                <div className="mt-6">
                  <Collapse label={context.badge} id={sectionId(context.badge)}>
                    <ProcessBlocks blocks={context.blocks} />
                  </Collapse>
                </div>
              )}
            </section>
          </FadeUp>
        ))}

        <FadeUp scrollLinked>
          <section id={sectionId('Outcome')}>
            <SectionBadge step={{ index: steps, total: steps }}>Outcome</SectionBadge>

            <Outcome results={project.results} />

            {/* Reflections stay short and read under the card they qualify,
                not as a section of their own. */}
            {project.reflections.length > 0 && (
              <div className="flex flex-col gap-4 mt-10">
                {project.reflections.map((text, index) => (
                  <p key={index} className="text-body-2 text-[var(--color-500)] text-pretty">
                    <Bold text={text} />
                  </p>
                ))}
              </div>
            )}
          </section>
        </FadeUp>

        {/* Project navigation: two whole-box buttons in one bordered bar, the
            whole box the hover target. */}
        <nav aria-label="More case studies" className={`${BLEED_VISUAL} mt-12 grid grid-cols-2 rounded-sm border border-[var(--border)]`}>
          <Link
            href={`/projects/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="group flex items-center gap-2 px-4 py-5 sm:px-7 sm:py-6 transition-colors duration-[400ms] ease-in-out hover:bg-[var(--color-000)]"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <Arrow direction="left" />
            <span className="text-eyebrow text-pretty">
              <span className="text-[var(--color-300)]">Previous /</span>{' '}
              <span ref={prevLabel.spanRef} className="text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]">{prev.title}</span>
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="group flex items-center justify-end gap-2 border-l border-[var(--border)] px-4 py-5 text-right sm:px-7 sm:py-6 transition-colors duration-[400ms] ease-in-out hover:bg-[var(--color-000)]"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <span className="text-eyebrow text-pretty">
              <span ref={nextLabel.spanRef} className="text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]">{next.title}</span>
              {' '}<span className="text-[var(--color-300)]">{'\\'} Next</span>
            </span>
            <Arrow direction="right" />
          </Link>
        </nav>

      </div>
      <ScrollToTop />
    </main>
  )
}

/**
 * One paragraph and one card. With a channel breakdown (signup) the card
 * carries that chart; with a cohort-charted metric (freemium) that metric leads
 * with its chart and the rest sit under it; otherwise every metric stands side
 * by side as an equal.
 */
function Outcome({ results }: { results: Project['results'] }) {
  const { summary, northStar, breakdownChart, metrics } = results

  if (breakdownChart) {
    return <ImpactSummaryCard summary={summary} northStar={northStar} breakdownChart={breakdownChart} />
  }

  const charted = metrics.find((m) => m.chart)
  if (charted?.chart) {
    const rest = [northStar, ...metrics.filter((m) => m !== charted)]
    return (
      <OutcomeCard
        summary={summary}
        label={charted.label}
        value={charted.value}
        badge={charted.badge}
        chart={<CohortChart data={charted.chart.data} seriesLabel={charted.chart.seriesLabel} />}
        columns={rest.map((m) => ({ label: m.label, value: m.value, badge: m.badge }))}
      />
    )
  }

  return (
    <OutcomeCard
      summary={summary}
      columns={[northStar, ...metrics].map((m) => ({ label: m.label, value: m.value, badge: m.badge }))}
    />
  )
}

const Arrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
    className="shrink-0 text-[var(--color-200)] transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]"
    style={{ stroke: 'currentColor' }}
  >
    <path d={direction === 'left' ? 'M14 8H2M7 3L2 8l5 5' : 'M2 8h12M9 3l5 5-5 5'} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
)
