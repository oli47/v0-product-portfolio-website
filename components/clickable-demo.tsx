'use client'

import { useState } from 'react'
import { DEMOS } from '@/components/demos/registry'
import type { DemoVariant } from '@/components/demos/demo-frame'
import { Lightbox } from '@/components/lightbox'
import type { DemoId } from '@/lib/projects'

/**
 * A coded demo that enlarges on click, the way the screenshots it replaced did.
 *
 * The button wraps the demo from outside its own aria-hidden frame, so nothing
 * inside the reproduction becomes focusable — the rule every demo is built on
 * stays intact, and the walkthrough itself is still a video with nothing to
 * press. Enlarged, the demo takes the `inline` stage and keeps playing.
 *
 * The home page card deliberately does not use this: that demo already sits
 * inside the project's link, and a button inside a link is invalid markup with
 * no accessible way to offer both.
 */

/**
 * Width-to-height of a demo's stage when enlarged, so it can be capped to fit
 * the window's height as well as its width. A dashboard is landscape, and
 * switches to its own phone layout below the demos' 520px breakpoint, which is
 * roughly what a phone viewport hands it.
 */
const DESKTOP_RATIO = 1846 / 1002
const DASHBOARD_PHONE_RATIO = 390 / 858

export function ClickableDemo({ id, label, pinnedScreen, pinnedValues, variant = 'inline' }: {
  id: DemoId
  /** Names the demo for the button's accessible label. */
  label: string
  /** Hold the demo on one screen instead of playing it. The enlarged copy
   *  ignores it and plays the whole thing, which is what the click is for: a
   *  still that opens into the same still would be a dead control. */
  pinnedScreen?: number
  /** Extra frozen values alongside `pinnedScreen` — see `DemoFrame`. Also
   *  ignored by the enlarged copy, for the same reason `pinnedScreen` is. */
  pinnedValues?: Record<string, string>
  variant?: DemoVariant
}) {
  const [open, setOpen] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const Demo = DEMOS[id]

  return (
    <>
      <button
        type="button"
        onClick={() => { setNarrow(window.matchMedia('(max-width: 639px)').matches); setOpen(true) }}
        // `text-left` is load-bearing: a button centres its text by default, and
        // the screens inside set alignment only where they mean to differ from
        // the page's, so without it a whole dashboard silently centres.
        className="block w-full cursor-zoom-in text-left"
        aria-label={`Enlarge demo: ${label}`}
      >
        {/* The demo takes no pointer events of its own, so the whole surface is
            the button however the reproduction is built. */}
        <div className="pointer-events-none">
          <Demo variant={variant} pinnedScreen={pinnedScreen} pinnedValues={pinnedValues} />
        </div>
      </button>

      {open && (
        <Lightbox alt={label} onClose={() => setOpen(false)}>
          {/* As wide as the window allows, but never taller than it: the
              width is capped by the height the stage's ratio would need. */}
          <div
            className="demo-viewport mx-auto"
            style={{ width: `min(100%, calc((100dvh - 140px) * ${narrow ? DASHBOARD_PHONE_RATIO : DESKTOP_RATIO}))` }}
          >
            <Demo variant="inline" />
          </div>
        </Lightbox>
      )}
    </>
  )
}
