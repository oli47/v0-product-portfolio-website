'use client'

import { useTarget } from '@/components/demos/demo-cursor'
import { C, Screen } from '@/components/demos/edrone-tokens'
import {
  Field, Heading, Label, MOBILE, type Metrics, Subtitle,
} from '@/components/demos/signup-ui'
import type { DemoState } from '@/components/demos/use-demo-script'

/**
 * Pieces unique to the signup story: the real landing page it opens on, the
 * field that visibly leaves the old form, the step indicator the split form
 * gains, and the success beat it ends on. Everything else — the old form's
 * remaining fields, the new flow's two steps — is `signup-ui.tsx` unchanged,
 * because the point of this demo is that it is the same product throughout.
 */

export interface StoryMetrics extends Metrics {
  /** The step-dot pair STEP1/STEP2 gain, that the old form never had. */
  gapDotsHeading: number

  /** Success screen, modelled on freemium's `ConnectedScreen`. */
  ring: number
  gapRingHeading: number
  gapHeadingSub: number

  /** One confetti piece's own size, as `freemium-ui.tsx` sizes its burst. */
  confetti: number
}

/**
 * One fixed stage, not a responsive table: the whole point of this demo is
 * that it is a phone, always, whatever width the column hands it. `MOBILE`
 * from `signup-ui.tsx` is the base, so the old-form and new-flow screens land
 * on the exact fields the shipped signup demos use.
 */
export const STORY: StoryMetrics = {
  ...MOBILE,
  gapDotsHeading: 14,
  ring: 40, gapRingHeading: 22, gapHeadingSub: 6,
  confetti: 8,
}

/** Ignores both arguments: this demo never switches away from its own phone
 *  shape, whatever column width or variant a caller hands it. */
export function metricsForStory(): StoryMetrics {
  return STORY
}

// ─── Landing ─────────────────────────────────────────────────────────────────

/**
 * edrone's real marketing site, not a coded reproduction — the one screen in
 * this whole story that is a screenshot rather than a rebuild. Every other
 * screen here is the product itself, reproduced in code because the point is
 * to show exactly what changed in it; this one only has to read as "a
 * website", and a hand-drawn stand-in for that read as a stand-in. The real
 * thing is one image and free.
 *
 * The tap target is an invisible box over the real "Try now for free" button.
 * Its source position was measured by scanning the file for the button's own
 * dark pixels, not eyeballed: x 22.1-77.8%, y 44.9-51.4% of the 918×1806 PNG.
 * `object-fit: cover` with `object-position: top` only ever crops the
 * image's own bottom edge (the stage is slightly wider, relatively, than the
 * screenshot), never its sides, so the x fraction carries over unchanged —
 * but the y fraction does not: cover scales the image up until it fills the
 * stage's width, which stretches it past the stage's height too, so a y
 * fraction measured against the *uncropped* source has to be rescaled by
 * that same zoom factor to land on the right pixel of the *cropped* stage.
 * The box below is that rescaled result, not the raw source fraction.
 */
export function LandingScreen({ state }: { state: DemoState; m: StoryMetrics }) {
  const ref = useTarget('cta')
  const pressed = state.pressed === 'cta'

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size
          stage inside a scaled, transformed demo frame; next/image's own
          responsive sizing has nothing to measure against here. */}
      <img
        src="/images/sf-landing.png"
        alt=""
        aria-hidden
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
      />
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        aria-hidden
        className="absolute rounded-md"
        style={{
          left: '22%', top: '49%', width: '56%', height: '7%',
          background: pressed ? 'rgba(255, 255, 255, 0.28)' : 'transparent',
          transition: 'background 120ms ease-out',
        }}
      />
    </div>
  )
}

// ─── Step indicator ──────────────────────────────────────────────────────────

/** The "step 1 of 2" pair the split form gains — absent from the old
 *  single-pass form on purpose, since having none is the point about it. */
export function StepDots({ active }: { active: 0 | 1 }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 6 }}>
      {[0, 1].map((i) => (
        <span
          key={i}
          style={{
            width: i === active ? 16 : 6,
            height: 6,
            borderRadius: 3,
            background: i === active ? C.ink : C.border,
            transition: 'width 220ms ease-out, background-color 220ms ease-out',
          }}
        />
      ))}
    </div>
  )
}

// ─── The fields that leave ───────────────────────────────────────────────────

/**
 * Reads a field's "how far has it left" as a plain 0-1 number: `'fading'` is
 * partway, `'gone'` is all the way, undefined (never touched) is fully
 * present.
 */
export const leaveOf = (v: string | undefined): number => {
  if (v === undefined) return 0
  const n = Number(v)
  if (!Number.isNaN(n)) return Math.min(1, Math.max(0, n))
  return v === 'gone' ? 1 : v === 'fading' ? 0.6 : 0
}

/**
 * `leaveOf`'s mirror, for the field's own other end: how far it has
 * *arrived* (0 = not yet here, 1 = fully settled). Undefined reads as fully
 * arrived, not fully absent — the inverse of `leaveOf`'s default — because
 * every demo except the one this exists for (`SignupSplitArriveDemo`, step
 * 2's own half of Name/Shop URL relocating) never touches `arrive` at all,
 * and those fields have always simply been there.
 */
export const arriveOf = (v: string | undefined): number => {
  if (v === undefined) return 1
  const n = Number(v)
  if (!Number.isNaN(n)) return Math.min(1, Math.max(0, n))
  return v === 'here' ? 1 : v === 'entering' ? 0.6 : 0
}

/**
 * A field that visibly leaves the form, continuously in `leave` (0 = fully
 * present, 1 = fully gone) rather than a handful of named poses — `leaveOf`
 * still only ever writes two discrete values (`'fading'`, `'gone'`) as a
 * script plays, but reading them as one continuous number rather than a
 * three-way switch keeps the CSS transition below the only thing animating
 * the field, instead of also branching its own logic per pose.
 *
 * Two different departures, because two different things are happening to
 * the product:
 *
 * `remove` — the phone number. It fades and shrinks in place. Nothing about
 * it survives (`FormScreen` throws dust at it while `leave` is in between).
 *
 * `relocate` — Name and Shop URL. They are not deleted; the form splits and
 * they reappear on step 2. So instead of just dimming in place they also
 * slide toward where step 2 lives — right, the direction the step dots read.
 * Sent onward, not deleted.
 *
 * The open height is computed from the same metrics that place every other
 * field, not eyeballed, so the row above and the row below meet exactly
 * where the field used to be. It holds until `leave` is most of the way
 * there, so the fade (or the slide) gets to read before the gap starts
 * closing behind it, then collapses over the rest of `leave`'s own range —
 * a real height, driven by scroll, rather than a fixed-duration collapse a
 * CSS transition would have to guess the timing of.
 */
export function CollapsibleField({ leave, mode = 'remove', label, name, placeholder, prefix, prefixWidth, state, m, topGap }: {
  leave: number
  mode?: 'remove' | 'relocate'
  label: string
  name: string
  placeholder: string
  prefix?: string
  prefixWidth?: number
  state: DemoState
  m: Metrics
  /** The gap before this field's label. Defaults to the field-to-field gap;
   *  the first field in a form passes its own, larger one instead. */
  topGap?: number
}) {
  const gap = topGap ?? m.gapFieldLabel
  // Matches `Label`'s own explicit `lineHeight: 1.2` exactly.
  const labelH = Math.round(m.label * 1.2)
  const openH = gap + labelH + m.gapLabelField + m.fieldH
  const clamped = Math.min(1, Math.max(0, leave))
  const relocating = mode === 'relocate'

  const collapseFrom = 0.7
  const collapseT = Math.min(1, Math.max(0, (clamped - collapseFrom) / (1 - collapseFrom)))

  return (
    <div
      // `flex flex-col`, not the block default: `Label` renders a `<span>`
      // (inline), and margin-top has no effect at all on an inline box (CSS
      // 2.1 §8.3) — flex blockifies it, the same way `Screen`'s own
      // `flex flex-col` already makes Email's identical `Label` behave
      // correctly. Without this, `openH` below reserves the right amount of
      // space but the label renders flush against the top of it, leaving the
      // difference as dead space at the *bottom* — a gap that looks bigger
      // than its neighbours', by exactly this field's own `topGap`.
      className="flex flex-col"
      style={{
        height: openH * (1 - collapseT),
        opacity: 1 - clamped,
        transform: relocating ? `translateX(${clamped * 64}px)` : 'none',
        overflow: 'hidden',
        // All three the same 300ms: they used to run height at 420ms, so
        // once opacity and transform had already finished fading and
        // sliding the field away, the row below it kept sliding up for
        // another 120ms on its own — a lagging tail that read as a hiccup,
        // most visible once there was a second card's motion right beside
        // it to compare against.
        transition: 'height 300ms cubic-bezier(.4, 0, .2, 1), opacity 300ms ease-out, transform 300ms ease-out',
      }}
    >
      <Label m={m} style={{ marginTop: gap, flexShrink: 0 }}>{label}</Label>
      <Field
        name={name} placeholder={placeholder} prefix={prefix} prefixWidth={prefixWidth}
        state={state} m={m} style={{ marginTop: m.gapLabelField, flexShrink: 0 }}
      />
    </div>
  )
}

// ─── Success ─────────────────────────────────────────────────────────────────

/** Modelled on `freemium-ui.tsx`'s `ConnectedScreen` — the same celebratory
 *  beat, redrawn locally since the original is private to that file. */
export function SuccessScreen({ m }: { m: StoryMetrics }) {
  return (
    <Screen>
      <div className="flex flex-col items-center text-center">
        <span
          style={{ width: m.ring, height: m.ring, borderRadius: '50%', background: C.mint, color: C.mintMark }}
          className="flex shrink-0 items-center justify-center"
        >
          <TickMark size={Math.round(m.ring * 0.5)} />
        </span>
        <div style={{ marginTop: m.gapRingHeading, width: '100%' }}>
          <Heading size={m.heading}>Account created</Heading>
        </div>
        <div style={{ marginTop: m.gapHeadingSub, width: '100%' }}>
          <Subtitle m={m}>My Store is live on edrone. Automations start sending today.</Subtitle>
        </div>
      </div>
    </Screen>
  )
}

const TickMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="m3.4 8.4 3.1 3.1 6.1-6.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Confetti thrown out of the tick. Ported from `freemium-ui.tsx`'s burst —
 * same deterministic, index-seeded vectors, so server and client render the
 * same explosion — resized for this stage and centred on where the ring sits.
 */
export function Confetti({ m }: { m: StoryMetrics }) {
  const colours = [C.yellow, C.violet, C.mintMark, C.blueMark, C.amberMark, C.orangeMark]
  const count = 40

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + ((i * 7) % 11) * 0.09
        const reach = 0.5 + ((i * 31) % 50) / 100
        const dx = Math.cos(angle) * m.stageW * 0.52 * reach
        const dy = Math.sin(angle) * m.stageH * 0.42 * reach
        const drop = m.stageH * (0.10 + ((i * 19) % 22) / 100)
        const spin = 380 + ((i * 97) % 620)
        const fall = 1.5 + ((i * 29) % 70) / 100
        const delay = ((i * 13) % 22) / 100
        const tall = i % 3 === 0
        return (
          <span
            key={i}
            className="demo-confetti absolute block"
            style={{
              left: '50%',
              top: '46%',
              width: m.confetti,
              height: tall ? m.confetti * 2 : m.confetti * 0.62,
              marginLeft: -m.confetti / 2,
              background: colours[i % colours.length],
              borderRadius: tall ? 2 : '50%',
              ['--dx' as string]: `${Math.round(dx)}px`,
              ['--dy' as string]: `${Math.round(dy)}px`,
              ['--drop' as string]: `${Math.round(drop)}px`,
              ['--spin' as string]: `${spin}deg`,
              ['--fall' as string]: `${fall}s`,
              ['--delay' as string]: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * The phone number, breaking apart into dust rather than just fading — the
 * field being *removed* (as opposed to Name/Shop URL, which *relocate*) gets
 * a beat that reads as destruction, not a plain collapse. Reuses `Confetti`'s
 * own mechanism verbatim: the same `.demo-confetti` class and `--dx`/`--dy`/
 * `--drop`/`--spin`/`--fall`/`--delay` custom properties from `app/globals.css`,
 * the same deterministic index-seeded vectors — only the palette (muted greys,
 * not the product's status colours), the piece count, and the reach are
 * different, because dust drifting off a deleted field is a much quieter
 * event than a store connecting.
 *
 * `top`/`height` are the field's own measured box (from a ref in
 * `FormScreen`, taken the instant it starts leaving) — not a formula guessed
 * from the metrics that place it, because those would have to re-derive
 * exactly how tall a two-line subtitle rendered above it, and a measurement
 * is the whole point of "measure, never eyeball".
 */
export function DustBurst({ top, height, m }: { top: number; height: number; m: Metrics }) {
  const colours = [C.border, C.muted, C.body]
  const count = 22

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ top: top + height / 2, height: 0 }}
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + ((i * 7) % 11) * 0.12
        const reach = 0.35 + ((i * 31) % 50) / 100
        const dx = Math.cos(angle) * m.column * 0.32 * reach
        const dy = Math.sin(angle) * (height * 0.6) * reach
        const drop = 22 + ((i * 19) % 18)
        const spin = 90 + ((i * 97) % 200)
        const fall = 0.55 + ((i * 29) % 30) / 100
        const delay = ((i * 13) % 10) / 100
        const size = 2 + (i % 3)
        return (
          <span
            key={i}
            className="demo-confetti absolute block rounded-full"
            style={{
              left: '50%',
              top: 0,
              width: size,
              height: size,
              marginLeft: -size / 2,
              background: colours[i % colours.length],
              ['--dx' as string]: `${Math.round(dx)}px`,
              ['--dy' as string]: `${Math.round(dy)}px`,
              ['--drop' as string]: `${Math.round(drop)}px`,
              ['--spin' as string]: `${spin}deg`,
              ['--fall' as string]: `${fall}s`,
              ['--delay' as string]: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}
