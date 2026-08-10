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
 * Stage width the phone toggle pins the demo to.
 *
 * The demos already switch layout on the width they are handed — that is the
 * same path a real narrow viewport takes — so the toggle needs no new API and
 * cannot drift from what a phone actually gets. It only has to land below
 * MOBILE_BREAKPOINT, which is 520 in both UI modules.
 */
const PHONE_W = 390

export function ClickableDemo({ id, label, pinnedScreen, variant = 'inline' }: {
  id: DemoId
  /** Names the demo for the button's accessible label. */
  label: string
  /** Hold the demo on one screen instead of playing it. The enlarged copy
   *  ignores it and plays the whole thing, which is what the click is for: a
   *  still that opens into the same still would be a dead control. */
  pinnedScreen?: number
  variant?: DemoVariant
}) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState(false)
  const Demo = DEMOS[id]

  return (
    <>
      <button
        type="button"
        onClick={() => { setPhone(false); setOpen(true) }}
        // `text-left` is load-bearing: a button centres its text by default, and
        // the screens inside set alignment only where they mean to differ from
        // the page's, so without it a whole dashboard silently centres.
        className="block w-full cursor-zoom-in text-left"
        aria-label={`Enlarge demo: ${label}`}
      >
        {/* The demo takes no pointer events of its own, so the whole surface is
            the button however the reproduction is built. */}
        <div className="pointer-events-none">
          <Demo variant={variant} pinnedScreen={pinnedScreen} />
        </div>
      </button>

      {open && (
        <Lightbox alt={label} onClose={() => setOpen(false)}>
          <div className="flex flex-col items-center gap-4">
            {/* Desktop only: on a phone the viewport is already the answer, and
                a control offering to shrink it further would be noise. */}
            <div
              role="group"
              aria-label="Demo layout"
              className="hidden items-center gap-1 rounded-[0.125rem] p-1 sm:flex"
              style={{ background: 'rgba(250, 247, 242, 0.14)' }}
            >
              <LayoutTab active={!phone} onSelect={() => setPhone(false)}>Desktop</LayoutTab>
              <LayoutTab active={phone} onSelect={() => setPhone(true)}>Mobile</LayoutTab>
            </div>

            {/* A cross-fade, not a morph. Easing the width looked right on
                paper, but the two layouts are different shapes — 1.8:1 against
                0.45:1 — so the box has to get narrower and much taller at the
                same time, and the content snaps to the other layout partway
                through. Fading between two finished states is the honest move:
                nothing is mid-anything. Keyed so each swap replays it. */}
            <div
              key={phone ? 'phone' : 'desktop'}
              className="demo-viewport"
              style={{ width: phone ? PHONE_W : '100%' }}
            >
              <Demo variant="inline" />
            </div>
          </div>
        </Lightbox>
      )}
    </>
  )
}

const LayoutTab = ({ active, onSelect, children }: {
  active: boolean
  onSelect: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={active}
    className="text-eyebrow rounded-[0.125rem] px-3 py-1.5 transition-colors duration-200"
    style={{
      background: active ? 'var(--on-overlay)' : 'transparent',
      color: active ? '#1A1714' : 'var(--on-overlay-muted)',
    }}
  >
    {children}
  </button>
)
