'use client'

import type { ProcessBlock } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableImage } from '@/components/clickable-image'
import { CompareSlider } from '@/components/compare-slider'
import { ContactFlowDiagram, VerticalFlow } from '@/components/process-diagrams'
import { Slideshow } from '@/components/slideshow'

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
                  <p key={j} className="text-body-1 text-[var(--color-300)] text-pretty">
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
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]"
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
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]"
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
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm transition-colors duration-[400ms] ease-in-out"
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

          case 'contact-flow':
            return <ContactFlowDiagram key={i} caption={block.caption} />

          case 'decisions': {
            const count = block.items.length
            return (
              <div key={i} className="sm:-mx-8 grid grid-cols-1 sm:grid-cols-2 rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
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
                        <p className="text-body-1 text-[var(--color-500)] text-pretty" style={{ fontWeight: 600 }}>{item.title}</p>
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
