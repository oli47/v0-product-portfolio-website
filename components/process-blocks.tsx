'use client'

import type { DemoRowItem, ProcessBlock } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { Collapse } from '@/components/collapse'
import { CustomerQuote } from '@/components/customer-quote'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'

/**
 * How far a visual block breaks out of the text column.
 *
 * Set to exactly `FRAME_PAD`'s own padding (`sm:p-10` → `sm:-mx-10`), not a
 * larger figure: the two have to cancel, or a framed block's content sits at a
 * different left edge than a paragraph does.
 */
export const BLEED_VISUAL = 'sm:-mx-10'

/** The mat every framed block sits in: the hero and the Outcome card. */
export const FRAME_PAD = 'p-6 sm:p-10'

type CopyBlock = Exclude<ProcessBlock, { kind: 'demo-row' }>
type RowBlock = Extract<ProcessBlock, { kind: 'demo-row' }>

export function ProcessBlocks({ blocks }: { blocks: ProcessBlock[] }) {
  // Consecutive copy (text, lists, a collapse) shares a 16px rhythm; a demo
  // row sits 64px away from the copy around it.
  const grouped: (CopyBlock[] | RowBlock)[] = []
  let run: CopyBlock[] = []
  for (const block of blocks) {
    if (block.kind === 'demo-row') {
      if (run.length) { grouped.push(run); run = [] }
      grouped.push(block)
    } else {
      run.push(block)
    }
  }
  if (run.length) grouped.push(run)

  return (
    <div className="flex flex-col gap-16">
      {grouped.map((item, i) =>
        Array.isArray(item) ? (
          <div key={i} className="flex flex-col gap-4">
            {item.map((block, j) => <CopyItem key={j} block={block} />)}
          </div>
        ) : (
          <DemoRow key={i} demos={item.demos} />
        )
      )}
    </div>
  )
}

function CopyItem({ block }: { block: CopyBlock }) {
  switch (block.kind) {
    case 'collapse':
      return (
        <Collapse label={block.label}>
          <ProcessBlocks blocks={block.blocks} />
        </Collapse>
      )
    case 'list':
      return (
        <ul className="flex flex-col gap-2 list-disc pl-5 marker:text-[var(--accent)]">
          {block.items.map((text, k) => (
            <li key={k} className="text-body-2 text-[var(--color-500)] text-pretty">
              <Bold text={text} />
            </li>
          ))}
        </ul>
      )
    case 'text':
      return (
        <p className="text-body-2 text-[var(--color-500)] text-pretty">
          <Bold text={block.content} />
        </p>
      )
  }
}

/**
 * Out of the text measure to the full width of the window, every tile holding
 * a 16:9 frame, so every row on every case study is the same height at the
 * same width. A screenshot fits the frame (`crop` covers it around a point
 * instead); a demo fits its width; a quote takes the row's height.
 *
 * One column on a phone, two on a tablet, three from lg. On a tablet a quote
 * spans both columns, and when the slots come out odd the first tile does too,
 * so the grid never ends on an orphan. From lg every tile is one column.
 */
function DemoRow({ demos }: { demos: DemoRowItem[] }) {
  const tile = 'rounded-sm overflow-hidden'
  const tileStyle = { backgroundColor: 'var(--color-000)' }
  const frame = 'aspect-video w-full overflow-hidden rounded-[0.125rem] flex items-center justify-center'
  const slots = demos.length + demos.filter((d) => typeof d !== 'string' && 'quote' in d).length

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-5 sm:px-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((item, j) => {
          const lead = j === 0 && slots % 2 === 1 ? 'sm:col-span-2 lg:col-span-1' : ''

          if (typeof item !== 'string' && 'quote' in item) {
            return (
              <div key={j} className={`${tile} sm:col-span-2 lg:col-span-1 sm:flex sm:items-center`} style={tileStyle}>
                <CustomerQuote text={item.quote} author={item.author} href={item.href} />
              </div>
            )
          }

          if (typeof item !== 'string' && 'src' in item) {
            return (
              // `bleed: 'top-left'`: a crop of the app's corner runs off the
              // tile's top and left edges, matted only right and below.
              <div key={j} className={`${tile} ${lead} ${item.bleed ? 'pr-3 pb-3 sm:pr-4 sm:pb-4' : 'p-3 sm:p-4'}`} style={tileStyle}>
                <div className={frame}>
                  <ClickableImage
                    src={item.src}
                    alt={item.alt}
                    width={item.width ?? 1340}
                    height={item.height ?? 821}
                    className={`w-full h-full ${item.crop || item.bleed ? 'object-cover' : 'object-contain'}`}
                    objectPosition={item.crop ?? (item.bleed ? 'left top' : undefined)}
                  />
                </div>
              </div>
            )
          }

          const { demo, step } = typeof item === 'string' ? { demo: item, step: undefined } : item
          return (
            <div key={j} className={`${tile} ${lead} p-3 sm:p-4`} style={tileStyle}>
              <div className={frame}>
                <div className="w-full">
                  <ClickableDemo id={demo} label="Product walkthrough" pinnedScreen={step} variant="card" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
