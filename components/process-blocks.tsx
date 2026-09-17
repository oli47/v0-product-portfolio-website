'use client'

import Image from 'next/image'
import type { DemoId, ProcessBlock } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'
import { CompareSlider } from '@/components/compare-slider'
import { DEMOS } from '@/components/demos/registry'
import { ContactFlowDiagram } from '@/components/process-diagrams'
import { Slideshow } from '@/components/slideshow'

/**
 * How far a visual block breaks out of the text column.
 *
 * Set to exactly `FRAME_PAD`'s own padding (`sm:p-10` → `sm:-mx-10`), not a
 * larger figure: the two have to cancel, or the block's own prose sits at a
 * different left edge than a plain `text` block does. A card that bleeds
 * `n` and pads `n` is wider than the column by `2n` on the outside, but its
 * content starts exactly where an un-bled paragraph's does — bigger, without
 * the two reading as different columns.
 *
 * No `lg:` step: `FRAME_PAD` does not add one either, so there is nothing
 * past `sm` to match.
 *
 * Text-bearing blocks — `decisions`, and the Impact metric cards — deliberately
 * do not take this. Widening them widens the measure of the prose inside them,
 * which is the one thing `--measure` exists to hold.
 */
export const BLEED_VISUAL = 'sm:-mx-10'

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

/** A phone-shaped demo's own footprint wherever it renders alone rather than
 *  in a grid column that halves the card width for it (the `split` block's
 *  single-side layout does that for free) — the `demo-pair` block, and the
 *  case-study hero when the project's own demo is phone-shaped. Wide enough
 *  to read as a phone, narrow enough not to blow up into something that
 *  looks like a stretched mobile screenshot filling a desktop-width card. */
export const PHONE_MAX_W = 300

/** One half of a comparison: a coded demo, or a screenshot filling the slider.
 *  `label` is optional here (unlike on `CompareSide` itself) so the same
 *  helper renders a `demo-pair` side too, which has no label of its own. */
function compareSide(side: { step?: number; pinnedValues?: Record<string, string>; label?: string } & ({ src: string } | { demo: DemoId })) {
  if ('demo' in side) {
    const Demo = DEMOS[side.demo]
    return <Demo pinnedScreen={side.step} pinnedValues={side.pinnedValues} />
  }
  return (
    <Image
      src={side.src}
      alt={side.label ?? 'Process image'}
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
                  <p key={j} className="text-body-2 text-[var(--color-500)] text-pretty">
                    <Bold text={block.content} />
                  </p>
                ) : (
                  <p key={j} className="text-body-2 text-[var(--color-500)] font-medium text-pretty">
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
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-0">
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
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-4">
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
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-4">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )
          }

          case 'split': {
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
                >
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 items-start">
                    <div className="flex flex-col gap-4">
                      {block.text.map((text, j) => (
                        <p key={j} className="text-body-2 text-[var(--color-500)] text-pretty">
                          <Bold text={text} />
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-col gap-10">
                      {block.sides.map((side, j) => (
                        <div key={j} className={'demo' in side ? 'mx-auto flex w-full flex-col sm:w-[calc((100%-1.5rem)/2)] lg:mx-0 lg:-ml-3 lg:w-[calc(100%+0.75rem)]' : 'flex flex-col'} style={'demo' in side ? { maxWidth: PHONE_MAX_W } : undefined}>
                          {side.label && <p className="text-eyebrow text-[var(--accent)] mb-2">{side.label}</p>}
                          {side.text && <p className="text-body-2 text-[var(--color-500)] text-pretty mb-4">{side.text}</p>}
                          <div className="rounded-[0.125rem] overflow-hidden">{compareSide(side)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-6">{block.caption}</p>
                  )}
                </div>
              </div>
            )
          }

          case 'demo-pair': {
            // Two phones side by side, `text` (if given) inside the same
            // card above them, rather than as its own block before it — one
            // visual unit. Each side is capped at 300px — wide enough to
            // read as a phone, narrow enough that two sit comfortably in the
            // 640px frame.
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
                >
                  {block.text && (
                    <div className="flex flex-col gap-4 mb-8">
                      {block.text.map((text, j) => (
                        <p key={j} className="text-body-2 text-[var(--color-500)] text-pretty">
                          <Bold text={text} />
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                    {[block.left, block.right].map((side, j) => (
                      <div key={j} className="w-full overflow-hidden rounded-[0.125rem]" style={{ maxWidth: PHONE_MAX_W }}>
                        {compareSide(side)}
                      </div>
                    ))}
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-6">{block.caption}</p>
                  )}
                </div>
              </div>
            )
          }

          case 'image-pair': {
            // Two plain screenshots, one row — a third-party tool's own UI
            // (an analytics dashboard, a session recorder), which is the one
            // kind of evidence a coded demo can't stand in for. No responsive
            // stack to a single column: the pair reads as one comparison, so
            // it stays a row at every width.
            return (
              <div key={i} className={`group ${BLEED_VISUAL}`}>
                <div
                  className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)] ${FRAME_PAD}`}
                  style={{ backgroundColor: 'var(--color-000)' }}
                >
                  {/* Plain `Image`, not `ClickableImage`: these screenshots
                      are only 323×184 natively, so the click-to-enlarge
                      Lightbox (plus its own 2.5x zoom) would blow a source
                      that small up to fill most of the viewport — visibly
                      pixelated, not a closer look. */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[block.left, block.right].map((side, j) => (
                      <div key={j} className="rounded-[0.125rem] overflow-hidden">
                        <Image
                          src={side.src}
                          alt={side.alt ?? 'Process image'}
                          width={323}
                          height={184}
                          quality={95}
                          sizes="(max-width: 640px) 50vw, 320px"
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-4">{block.caption}</p>
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
                    <p className="text-body-2 text-[var(--color-500)] text-center mt-0">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )
          }

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
                        <p className="text-body-2 text-[var(--color-500)] text-pretty" style={{ fontWeight: 600 }}>{item.title}</p>
                      )}
                      <p className="text-body-2 text-[var(--color-500)] text-pretty"><Bold text={item.description} /></p>
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
