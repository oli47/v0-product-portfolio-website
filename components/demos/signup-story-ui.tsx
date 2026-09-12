'use client'

import { C, Screen } from '@/components/demos/edrone-tokens'
import {
  Field, Heading, Label, MOBILE, type Metrics, Subtitle, YellowButton,
} from '@/components/demos/signup-ui'
import type { DemoState } from '@/components/demos/use-demo-script'

/**
 * Pieces unique to the signup story: the fake landing page it opens on, the
 * field that visibly leaves the old form, the step indicator the split form
 * gains, and the success beat it ends on. Everything else — the old form's
 * remaining fields, the new flow's two steps — is `signup-ui.tsx` unchanged,
 * because the point of this demo is that it is the same product throughout.
 */

export interface StoryMetrics extends Metrics {
  /** Landing screen. An original composition, not a screenshot — unlike the
   *  rest of this file's numbers, these are chosen rather than measured. */
  navH: number
  landingMark: number
  landingHeroH: number
  gapHeadlineSub: number
  gapSubHero: number
  gapHeroCta: number
  gapCtaFeatures: number

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
  navH: 52, landingMark: 20, landingHeroH: 168,
  gapHeadlineSub: 10, gapSubHero: 24, gapHeroCta: 24, gapCtaFeatures: 20,
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
 * A generic landing draft — deliberately not a copy of edrone's real
 * marketing site, down to the invented product name. The point of this beat
 * is "a visitor lands on a website and clicks sign up", so it is built like a
 * page — a nav bar pinned to the top, a scrollable-feeling hero under it —
 * rather than like one more centred app dialog.
 */
export function LandingScreen({ state, m }: { state: DemoState; m: StoryMetrics }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="flex shrink-0 items-center justify-between"
        style={{ height: m.navH, padding: `0 ${m.mobile ? 20 : 32}px`, borderBottom: `1px solid ${C.border}` }}
      >
        <span className="flex items-center" style={{ gap: 8 }}>
          <span
            aria-hidden
            style={{ width: m.landingMark, height: m.landingMark, borderRadius: 5, background: C.yellow, border: `1px solid ${C.ink}` }}
          />
          <span style={{ fontSize: m.mobile ? 15 : 18, fontWeight: 700, letterSpacing: '-0.01em' }}>looply</span>
        </span>
        <BurgerMark />
      </div>

      {/* Anchored under the nav with its own padding, not centred in whatever
          height the frame around this demo happens to give it: a real hero
          sits right under the header, and centring it in a tall "inline"
          frame left a gap under the nav no real page would have. */}
      <div
        className="flex flex-1 flex-col items-center"
        style={{ padding: `${Math.round(m.stageH * 0.08)}px ${m.mobile ? 24 : 0}px 0` }}
      >
        <div className="demo-screen-in flex flex-col items-center" style={{ width: m.mobile ? '100%' : m.column }}>
          <Heading size={m.heading}>Marketing on autopilot</Heading>
          <div style={{ marginTop: m.gapHeadlineSub, width: '100%' }}>
            <Subtitle m={m}>Automated emails that bring shoppers back to buy again.</Subtitle>
          </div>

          <div
            className="relative overflow-hidden"
            style={{
              marginTop: m.gapSubHero, width: '100%', height: m.landingHeroH, borderRadius: 8,
              background: 'linear-gradient(146deg, #FFE37A 0%, #F2B33C 100%)',
            }}
          >
            <span
              style={{
                position: 'absolute', left: 12, top: 12, padding: '4px 8px', borderRadius: 4,
                background: 'rgba(5, 5, 5, 0.1)', fontSize: 11, fontWeight: 600, color: C.ink,
              }}
            >
              New · Freemium
            </span>
          </div>

          <div style={{ marginTop: m.gapHeroCta, width: '100%' }}>
            <YellowButton target="cta" state={state} m={m}>Try now for free</YellowButton>
          </div>

          <div
            className="flex items-center justify-center text-center"
            style={{ marginTop: m.gapCtaFeatures, gap: 12, fontSize: 11, color: C.body }}
          >
            <span>No credit card</span>
            <Dot />
            <span>Free forever</span>
            <Dot />
            <span>2 min setup</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const BurgerMark = () => (
  <svg width={18} height={13} viewBox="0 0 18 13" fill="none" aria-hidden>
    <path d="M1 1h16M1 6.5h16M1 12h16" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Dot = () => (
  <span aria-hidden style={{ width: 3, height: 3, borderRadius: '50%', background: C.muted }} />
)

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

/** A field's own place in the "this is leaving" beat: shown, then dimmed to
 *  flag it as the one about to go, then collapsed. */
export type FieldPhase = 'visible' | 'fading' | 'gone'

export const phaseOf = (v: string | undefined): FieldPhase =>
  v === 'fading' || v === 'gone' ? v : 'visible'

/**
 * A field that visibly leaves the form. Two different departures, because two
 * different things are happening to the product:
 *
 * `remove` — the phone number. It dims in place, flagging it as the one about
 * to go, then its height collapses to exactly zero. Nothing about it survives.
 *
 * `relocate` — Name and Shop URL. They are not deleted; the form splits and
 * they reappear on step 2. So instead of dimming in place they slide toward
 * where step 2 lives — right, the direction the step dots read — and fade as
 * they go, then the gap closes behind them. Sent onward, not deleted.
 *
 * Either way the open height is computed from the same metrics that place
 * every other field, not eyeballed, so the row above and the row below meet
 * exactly where the field used to be.
 */
export function CollapsibleField({ phase, mode = 'remove', label, name, placeholder, prefix, prefixWidth, state, m, topGap }: {
  phase: FieldPhase
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
  const collapsed = phase === 'gone'
  const leaving = phase === 'fading'
  const relocating = mode === 'relocate'
  const leaveMs = relocating ? 340 : 260

  return (
    <div
      style={{
        height: collapsed ? 0 : openH,
        opacity: collapsed ? 0 : leaving ? (relocating ? 0 : 0.25) : 1,
        transform: relocating && (leaving || collapsed) ? 'translateX(28px)' : 'none',
        overflow: 'hidden',
        // The height holds for a beat after the field starts leaving, so the
        // dim (or the slide) gets a moment to read before "gone" closes the gap.
        transition: collapsed
          ? `height 640ms cubic-bezier(.4, 0, .2, 1) 140ms, opacity ${leaveMs}ms ease-out, transform ${leaveMs}ms ease-out`
          : `opacity ${leaveMs}ms ease-out, transform ${leaveMs}ms ease-out`,
      }}
    >
      <Label m={m} style={{ marginTop: gap }}>{label}</Label>
      <Field
        name={name} placeholder={placeholder} prefix={prefix} prefixWidth={prefixWidth}
        state={state} m={m} style={{ marginTop: m.gapLabelField }}
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
