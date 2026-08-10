'use client'

import Image from 'next/image'
import type { CompareSide, ProcessBlock } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'
import { CompareSlider } from '@/components/compare-slider'
import { DEMOS } from '@/components/demos/registry'
import { ContactFlowDiagram, VerticalFlow } from '@/components/process-diagrams'
import { Slideshow } from '@/components/slideshow'

/**
 * How far a visual block breaks out of the text column.
 *
 * The column is `--measure` (36rem) less its 5-unit padding, so 536px of text.
 * `-mx-8` put a frame at 600px; this takes it to 720px, which is not a taste
 * call: `section-nav.tsx` pins its rail at `calc(50% + 22.5rem + 2rem)`, so the
 * layout was already built expecting content up to 45rem with a 2rem gutter
 * beside it. A frame at 720px lands exactly on that gutter.
 *
 * It buys legibility, which is the actual point. A demo is a fixed-size scene
 * scaled to whatever width the frame hands it, and the scenes differ: 1920 for
 * freemium, 1846 for the dashboard, 1340 for signup. At the old 600px frame the
 * freemium demo ran at scale 0.296, so a 14px label in the reproduced product
 * rendered at four pixels and the demo could only ever read as a decorative
 * screenshot. A 720px frame less `FRAME_PAD` leaves a 640px host, which is
 * 0.333 there and 0.347 on the dashboard. Every stage stays far above the 520px
 * floor where the demos switch to their phone layout.
 *
 * Those two numbers move whenever `FRAME_PAD` does. They are recorded because
 * the reason for this value is legibility, and a legibility argument with no
 * measurement in it is a preference.
 *
 * Only at `lg` and up. At the 768px `sm` breakpoint a 720px frame would leave
 * 4px of margin either side.
 *
 * Text-bearing blocks — `decisions`, and the Impact metric cards — deliberately
 * do not take this. Widening them widens the measure of the prose inside them,
 * which is the one thing `--measure` exists to hold.
 */
export const BLEED_VISUAL = 'sm:-mx-8 lg:-mx-[5.75rem]'

/**
 * The mat every framed block sits in.
 *
 * One value across previews, problem cards and Impact metrics, because three
 * frames stacked down one page at three different insets read as three
 * different components. It is the figure the process diagrams already used, so
 * this is the rest of the page catching up to them rather than a new number.
 *
 * On a preview it is not free: the frame is a fixed 720px, so every pixel of
 * mat is a pixel off the demo stage inside it. That trade is deliberate and it
 * is the only lever here — the frame itself cannot grow, because the section
 * rail is pinned just past its edge.
 */
export const FRAME_PAD = 'p-6 sm:p-10'

/** One half of a comparison: a coded demo, or a screenshot filling the slider. */
function compareSide(side: CompareSide) {
  if ('demo' in side) {
    const Demo = DEMOS[side.demo]
    return <Demo />
  }
  return (
    <Image
      src={side.src}
      alt={side.label}
      fill
      quality={95}
      sizes="(max-width: 768px) 100vw, 680px"
      className="object-cover"
    />
  )
}

export function ProcessBlocks({ blocks }: { blocks: ProcessBlock[] }) {
  // Group consecutive text/heading blocks so they share gap-4,
  // while all other blocks are separated by gap-16.
  type TextBlock = Extract<ProcessBlock, { kind: 'text' | 'heading' }>
  type NonTextBlock = Exclude<ProcessBlock, { kind: 'text' | 'heading' }>
  type GroupedItem = TextBlock[] | NonTextBlock

  const grouped: GroupedItem[] = []
  let run: TextBlock[] = []
  for (const block of blocks) {
    if (block.kind === 'text' || block.kind === 'heading') {
      run.push(block as TextBlock)
    } else {
      if (run.length) { grouped.push(run); run = [] }
      grouped.push(block as NonTextBlock)
    }
  }
  if (run.length) grouped.push(run)

  return (
    <div className="flex flex-col gap-16">
      {grouped.map((item, i) => {
        if (Array.isArray(item)) {
          return (
            <div key={i} className="flex flex-col gap-4">
              {item.map((block, j) =>
                block.kind === 'text' ? (
                  <p key={j} className="text-body-1 text-[var(--color-500)] text-pretty">
                    <Bold text={block.content} />
                  </p>
                ) : (
                  <p key={j} className="text-body-1 text-[var(--color-500)] font-medium text-pretty">
                    <Bold text={block.content} />
                  </p>
                )
              )}
            </div>
          )
        }
        const block = item
        switch (block.kind) {
          case 'image':
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)] ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
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
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)] ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
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

          case 'demo': {
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
                >
                  <ClickableDemo
                    id={block.demo}
                    label={block.caption ?? 'Product walkthrough'}
                    pinnedScreen={block.step}
                  />
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-4">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )
          }

          case 'compare': {
            // Screenshots need the slider to impose a box; demos bring their own.
            const framed = 'src' in block.after
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
                >
                  <div className="rounded-[0.125rem] overflow-hidden mb-4">
                    <CompareSlider
                      before={compareSide(block.before)}
                      after={compareSide(block.after)}
                      beforeLabel={block.before.label}
                      afterLabel={block.after.label}
                      aspectRatio={framed ? '4/3' : undefined}
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
          }

          case 'vertical-flow':
            return <VerticalFlow key={i} steps={block.steps} arc={block.arc} caption={block.caption} />

          case 'contact-flow':
            return <ContactFlowDiagram key={i} caption={block.caption} />

          case 'decisions': {
            const count = block.items.length
            return (
              <div key={i} className="sm:-mx-8 flex flex-col rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
                {block.items.map((item, j) => (
                  <div
                    key={j}
                    className={`${FRAME_PAD} flex flex-col gap-3${j < count - 1 ? ' border-b border-[var(--color-100)]' : ''}`}
                  >
                    <span className="text-eyebrow text-[var(--accent)]">{item.num}</span>
                    <div className="flex flex-col gap-2">
                      {item.title && (
                        <p className="text-body-1 text-[var(--color-500)] text-pretty" style={{ fontWeight: 600 }}>{item.title}</p>
                      )}
                      <p className="text-body-1 text-[var(--color-500)] text-pretty"><Bold text={item.description} /></p>
                    </div>
                  </div>
                ))}
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
