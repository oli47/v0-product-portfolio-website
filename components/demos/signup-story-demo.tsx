'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTarget } from '@/components/demos/demo-cursor'
import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import { C, Screen, TYPEFACE } from '@/components/demos/edrone-tokens'
import {
  arriveOf, CollapsibleField, Confetti, DustBurst, LandingScreen, leaveOf, metricsForStory, type StoryMetrics,
  StepDots, SuccessScreen,
} from '@/components/demos/signup-story-ui'
import {
  Divider, Field, GoogleMark, Heading, Label, Legal, OAuthRow, Subtitle, Underlined, YellowButton,
} from '@/components/demos/signup-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

// `useLayoutEffect` is a no-op warning on the server — same guard
// `demo-frame.tsx`/`compare-slider.tsx`/`dashboard-ui.tsx` already use.
const useMeasure = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * The signup redesign, told as one continuous story rather than a before/after
 * pair: a visitor lands on the site, meets the old four-field form, watches it
 * lose the phone number and split into steps, signs in with Google — a real
 * account picker, not a cut — and lands on the account it just created. Mobile
 * only — the simplest shape to read a story like this in.
 *
 * The old form and the new flow are not rebuilt from scratch: `signup-ui.tsx`'s
 * `Field`/`Heading`/`YellowButton`/etc are the same shared primitives every
 * signup screen on this page reads from, because the point of this demo is
 * that the product on both ends of the story is the same one. And the old form and
 * step 1 of the new flow are not two screens either: they are one screen that
 * loses fields under the visitor rather than being swapped for another —
 * screen changes here are reserved for scenes that are genuinely different.
 *
 * The screens and the screen-index constants are exported so the three
 * shorter demos below (`SignupPhoneRemoveDemo`, `SignupGoogleSignupDemo`,
 * `SignupSplitDemo`) can drive the same screens with their own, much shorter
 * script — one beat of this same story each, for the case study's Solution
 * section, which tells the three changes as three separate cards rather than
 * one long one. Their scripts are lifted straight out of `SCRIPT` below.
 */

export const LANDING = 0
export const FORM = 1
export const STEP2 = 2
export const SUCCESS = 3

const SCRIPT: Step[] = [
  // Beat 1 — a visitor lands on the site, and clicks through.
  { kind: 'wait',   ms: 1200 },
  { kind: 'move',   target: 'cta' },
  { kind: 'click',  target: 'cta' },
  { kind: 'screen', index: FORM },

  // Beat 2 — the old form, empty: the point of this screen is how many
  // fields it asks for, which reads on its own with nothing typed into them.
  { kind: 'wait', ms: 2200 },

  // Beat 3 — the phone number comes out: it dims to flag it, then closes.
  { kind: 'set',  field: 'phonePhase', text: 'fading' },
  { kind: 'wait', ms: 450 },
  { kind: 'set',  field: 'phonePhase', text: 'gone' },
  { kind: 'wait', ms: 1000 },

  // Beat 4 — the form splits into steps: Name and Shop URL leave together —
  // one field, `nameUrlLeave`, both read from (see FormScreen) — the copy
  // relabels itself, and the step indicator appears.
  { kind: 'set',  field: 'nameUrlLeave', text: 'fading' },
  { kind: 'wait', ms: 700 },
  { kind: 'set',  field: 'nameUrlLeave', text: 'gone' },
  { kind: 'wait', ms: 700 },
  { kind: 'set',  field: 'splitDone', text: '1' },
  { kind: 'wait', ms: 1100 },

  // Beat 5 — SSO, working this time: an actual account picker opens, shows
  // the right account, and hands control back on its own click, rather than
  // the screen just cutting to the next thing.
  { kind: 'move',  target: 'google' },
  { kind: 'click', target: 'google' },
  { kind: 'set',   field: 'chooserOpen', text: '1' },
  { kind: 'wait',  ms: 1800 },   // sheet slides up, then holds so the account reads
  { kind: 'move',  target: 'chooser-continue' },
  { kind: 'click', target: 'chooser-continue' },
  { kind: 'set',   field: 'chooserOpen', text: '0' },
  { kind: 'wait',  ms: 550 },

  // Beat 6 — step 2. The account already exists; this collects what the
  // product still needs.
  { kind: 'screen', index: STEP2 },
  { kind: 'wait',   ms: 500 },
  { kind: 'move',   target: 'name' },
  { kind: 'click',  target: 'name' },
  { kind: 'type',   field: 'name', text: 'My Store', cps: 13 },
  { kind: 'wait',   ms: 350 },
  { kind: 'click',  target: 'url' },
  { kind: 'type',   field: 'url',  text: 'mystore.com', cps: 15 },
  { kind: 'wait',   ms: 650 },

  // Beat 7 — submit. Beat 8 — success.
  { kind: 'click',  target: 'create' },
  { kind: 'screen', index: SUCCESS },
  { kind: 'wait',   ms: 2400 },
]

/**
 * The poster is the landing screen. The old form's fields stay empty even
 * pinned — the script never fills them either, so a frame pinned to `FORM`
 * correctly shows the untouched, four-field original with nothing typed in.
 */
const REST: Partial<DemoState> = {
  screen: LANDING,
  values: { name: 'My Store', url: 'mystore.com' },
}

export function SignupStoryDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={SCRIPT} restState={REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE} holdLastFrame
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

// Beats 5-8 of `SCRIPT`, verbatim — SSO through to success — behind a form
// that starts already in its shipped shape, rather than the story's own
// opening beats (landing page, old four-field form, the removal/split
// animation). The home card is a preview of the product, not a trailer for
// its own redesign history; that history is what the case study is for.
const FIXED_SCRIPT: Step[] = [
  { kind: 'wait', ms: 1400 },

  { kind: 'move',  target: 'google' },
  { kind: 'click', target: 'google' },
  { kind: 'set',   field: 'chooserOpen', text: '1' },
  { kind: 'wait',  ms: 1800 },
  { kind: 'move',  target: 'chooser-continue' },
  { kind: 'click', target: 'chooser-continue' },
  { kind: 'set',   field: 'chooserOpen', text: '0' },
  { kind: 'wait',  ms: 550 },

  { kind: 'screen', index: STEP2 },
  { kind: 'wait',   ms: 500 },
  { kind: 'move',   target: 'name' },
  { kind: 'click',  target: 'name' },
  { kind: 'type',   field: 'name', text: 'My Store', cps: 13 },
  { kind: 'wait',   ms: 350 },
  { kind: 'click',  target: 'url' },
  { kind: 'type',   field: 'url',  text: 'mystore.com', cps: 15 },
  { kind: 'wait',   ms: 650 },

  { kind: 'click',  target: 'create' },
  { kind: 'screen', index: SUCCESS },
  { kind: 'wait',   ms: 2400 },
]
/** Phone already gone, already split — the fields the redesign actually
 *  shipped with, not the four-field original this card never shows. */
const FIXED_REST: Partial<DemoState> = {
  screen: FORM,
  values: { phonePhase: 'gone', nameUrlLeave: 'gone', splitDone: '1' },
}

/** The home card's own cut: the shipped form straight through SSO to
 *  success, no earlier beat of the story it links to. */
export function SignupStoryFixedDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={FIXED_SCRIPT} restState={FIXED_REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE} holdLastFrame
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

// ─── The three changes, told as three short demos ───────────────────────────
//
// The Solution section shows each change as its own card, so each gets its
// own small, ordinary looping demo — the same `play ?? inView` every other
// demo on this site uses, not the story's own scroll-driven telling. Each
// script below is lifted verbatim out of `SCRIPT` above, just shorter: no
// `holdLastFrame`, because each one ends back where its own poster begins,
// so the loop resets cleanly rather than needing to hold a different frame.

const PHONE_REMOVE_SCRIPT: Step[] = [
  { kind: 'wait', ms: 900 },
  { kind: 'set',  field: 'phonePhase', text: 'fading' },
  { kind: 'wait', ms: 450 },
  { kind: 'set',  field: 'phonePhase', text: 'gone' },
  { kind: 'wait', ms: 1700 },
]
const PHONE_REMOVE_REST: Partial<DemoState> = { screen: FORM }

/** Change 1 — the phone number field dissolves out of the old form. */
export function SignupPhoneRemoveDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={PHONE_REMOVE_SCRIPT} restState={PHONE_REMOVE_REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE}
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

const GOOGLE_SIGNUP_SCRIPT: Step[] = [
  { kind: 'wait',  ms: 700 },
  { kind: 'move',  target: 'google' },
  { kind: 'click', target: 'google' },
  { kind: 'set',   field: 'chooserOpen', text: '1' },
  { kind: 'wait',  ms: 1800 },
  { kind: 'move',  target: 'chooser-continue' },
  { kind: 'click', target: 'chooser-continue' },
  { kind: 'set',   field: 'chooserOpen', text: '0' },
  { kind: 'wait',  ms: 900 },
]
const GOOGLE_SIGNUP_REST: Partial<DemoState> = { screen: FORM }

/** Change 2 — SSO working correctly: a real account picker, not a cut. */
export function SignupGoogleSignupDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={GOOGLE_SIGNUP_SCRIPT} restState={GOOGLE_SIGNUP_REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE}
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

// No `splitDone` here, unlike `SCRIPT`'s own Beat 4 — that flip also swaps
// the heading down a size, the subtitle to different copy, and drops the
// step dots in, all in the same instant, none of it eased. Buried in the
// full story that one jump cut passes; as the entire content of its own
// short, looping card it read as the copy itself glitching. This card's
// job is Name and Shop URL relocating — the copy above it already says
// what they land on — so it holds on the emptied form instead of also
// re-litigating that in a jump cut.
// One `set` straight to 'gone', not the two-step 'fading' → wait → 'gone'
// `SCRIPT`'s own Beat 4 uses: that leaves the field sitting half-faded,
// half-slid for a full 700ms between the two `set`s, which read as the
// motion stalling partway rather than as a beat with room to read — a CSS
// transition already eases the whole 0→1 `leave` range in one continuous
// move, so there is nothing the pause was buying.
const SPLIT_SCRIPT: Step[] = [
  { kind: 'wait', ms: 700 },
  { kind: 'set',  field: 'nameUrlLeave', text: 'gone' },
  { kind: 'wait', ms: 3000 },
]
/** Starts with the phone number already gone — by this point in the story
 *  it already left, in the previous card. */
const SPLIT_REST: Partial<DemoState> = { screen: FORM, values: { phonePhase: 'gone' } }

/** Change 3 — Name and Shop URL relocate together to their own step. */
export function SignupSplitDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={SPLIT_SCRIPT} restState={SPLIT_REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE}
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

// Step 2's own half of the same motion — same beats, same durations as
// `SPLIT_SCRIPT`, just `arrive` instead of `nameUrlLeave`. The two demos are
// separate `DemoFrame`s (each card is its own stage) with no shared clock,
// so this is what keeps them reading as one relocation rather than two
// coincidentally similar animations: mounted side by side, both start on
// the same `inView` moment, and an identical timeline keeps them from
// drifting apart across loops the way two different-length scripts would.
// The whole screen builds itself, not just its fields: chrome first
// (dots/heading/subtitle), then Name and Shop URL landing at t=700ms —
// still the exact moment `SPLIT_SCRIPT` finishes losing them on the card
// beside it, so the two stay in lockstep — then the buttons close it out.
const SPLIT_ARRIVE_SCRIPT: Step[] = [
  { kind: 'wait', ms: 300 },
  { kind: 'set',  field: 'screenPhase', text: 'chrome' },
  { kind: 'wait', ms: 400 },
  { kind: 'set',  field: 'arrive', text: 'here' },
  { kind: 'wait', ms: 300 },
  { kind: 'set',  field: 'screenPhase', text: 'complete' },
  { kind: 'wait', ms: 2700 },
]
/** Starts with nothing built yet — no chrome, no fields — so the loop
 *  restarts on a blank stage rather than jumping backward from a finished
 *  screen. */
const SPLIT_ARRIVE_REST: Partial<DemoState> = {
  screen: STEP2,
  values: { arrive: 'hidden', screenPhase: 'hidden' },
}

/** Change 3, step 2's half: Name and Shop URL land here, in sync with
 *  `SignupSplitDemo` losing them on the card beside it. */
export function SignupSplitArriveDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={SPLIT_ARRIVE_SCRIPT} restState={SPLIT_ARRIVE_REST} metrics={metricsForStory}
      ink={C.ink} typeface={TYPEFACE}
      {...props}
    >
      {(state, m) => <SignupStoryScreens state={state} m={m} />}
    </DemoFrame>
  )
}

/**
 * The screen-index switch, shared by `SignupStoryDemo` (the full story, on
 * loop) and the three shorter demos below (each one beat, on their own loop)
 * — one place that turns a `DemoState.screen` into a component, so they never
 * quietly drift into showing different things for the same screen index.
 */
export function SignupStoryScreens({ state, m }: { state: DemoState; m: StoryMetrics }) {
  return (
    <>
      <div
        className="relative flex h-full w-full items-center justify-center bg-white"
        style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
      >
        <div
          key={state.screen}
          style={{
            width: state.screen === LANDING ? '100%' : m.column,
            height: state.screen === LANDING ? '100%' : undefined,
          }}
        >
          {state.screen === LANDING && <LandingScreen state={state} m={m} />}
          {state.screen === FORM && <FormScreen state={state} m={m} />}
          {state.screen === STEP2 && <StepTwo state={state} m={m} />}
          {state.screen === SUCCESS && <SuccessScreen m={m} />}
        </div>
        {state.screen === FORM && (
          <GoogleChooser open={state.values.chooserOpen === '1'} state={state} m={m} />
        )}
      </div>
      {state.screen === SUCCESS && <Confetti m={m} />}
    </>
  )
}

interface ScreenProps {
  state: DemoState
  m: StoryMetrics
}

/**
 * The old form and step 1 of the new flow, as one persistently-mounted
 * screen: `phonePhase` collapses the phone field out of it, `nameUrlLeave`
 * moves Name and Shop URL out **together** — one shared value, not two
 * independently-timed ones, so the two fields travel to step 2 as a single
 * motion rather than one trailing the other — and once they're gone,
 * `splitDone` swaps the remaining copy over to the new flow's: the same "one
 * thing, transforming" the field removals already are, not a cut to a
 * different component.
 *
 * Field order is Name, Email, Shop URL, **Phone last** — not the product's
 * own order. The phone number is the one field that is deleted outright
 * (Name/Shop URL only relocate to step 2), and putting the thing that
 * disappears at the very end of the list means removing it never requires
 * anything below it to reflow past where it used to be — it just goes,
 * cleanly, off the bottom.
 */
export function FormScreen({ state, m }: ScreenProps) {
  const phoneLeave = leaveOf(state.values.phonePhase)
  const nameUrlLeave = leaveOf(state.values.nameUrlLeave)
  const split = state.values.splitDone === '1'

  // The phone field's own box, measured the instant it starts leaving — not
  // computed from the metrics that place it, because that formula would have
  // to re-derive exactly how tall a wrapped two-line subtitle rendered above
  // it. A measurement is the whole point of "measure, never eyeball".
  //
  // Shown for as long as `phoneLeave` sits strictly between 0 and 1 — a plain
  // function of state, not a timer: the old version cleared itself after a
  // fixed 900ms regardless of where the reader had actually scrolled to, so
  // scrubbing slowly through the fade left the dust vanishing mid-scroll,
  // and scrubbing back over it never brought it back at all.
  const phoneRef = useRef<HTMLDivElement>(null)
  const dissolving = phoneLeave > 0 && phoneLeave < 1
  const [dustBox, setDustBox] = useState<{ top: number; height: number } | null>(null)

  useMeasure(() => {
    if (!dissolving) { setDustBox(null); return }
    // `top` is local to `phoneRef` itself, not the page: `phoneRef` wraps
    // nothing but this field, and `DustBurst` is positioned inside it, so
    // the field's own top edge is 0, not `phoneRef.offsetTop` (which is the
    // field's distance from the *screen's* top) — that mistake put the burst
    // roughly one field-position too far down, in the empty space below the
    // legal text rather than over the phone number it was supposed to be.
    setDustBox((prev) => prev ?? (phoneRef.current && { top: 0, height: phoneRef.current.offsetHeight }) ?? null)
  }, [dissolving])

  return (
    <Screen>
      {split && <StepDots active={0} />}
      <div style={{ marginTop: split ? m.gapDotsHeading : 0, width: '100%' }}>
        <Heading size={split ? m.heading : m.headingOld}>Create an account</Heading>
      </div>
      <Subtitle m={m}>
        {split
          ? 'Sign up to get started in under a minute'
          : 'We need a few details to set up your marketing automation.'}
      </Subtitle>

      <CollapsibleField
        leave={nameUrlLeave} mode="relocate" label="Name" name="old-name" placeholder="John Doe"
        state={state} m={m} topGap={m.gapFirstLabel}
      />

      {/* Once Name (and Shop URL beside it) have fully left, Email becomes
          the form's lead field and takes the larger "first field" gap instead
          of the field-to-field one — animated, so the gap widens rather than
          jumping. */}
      <Label
        m={m}
        style={{
          marginTop: m.gapFieldLabel + (m.gapFirstLabel - m.gapFieldLabel) * nameUrlLeave,
          transition: 'margin-top 300ms ease-out',
        }}
      >
        Email
      </Label>
      <Field
        name="old-email" placeholder={split ? 'you@email.com' : 'user@email.com'}
        state={state} m={m} style={{ marginTop: m.gapLabelField }}
      />

      <CollapsibleField
        leave={nameUrlLeave} mode="relocate" label="Shop URL" name="old-url" placeholder="www.yourstore.com"
        prefix="https://" prefixWidth={m.prefixWOld} state={state} m={m}
      />

      <div ref={phoneRef} className="relative">
        <CollapsibleField leave={phoneLeave} label="Phone" name="old-phone" placeholder="123 456 789" state={state} m={m} />
        {dustBox && <DustBurst top={dustBox.top} height={dustBox.height} m={m} />}
      </div>

      <YellowButton
        target={split ? 'submit' : 'continue'} state={state} m={m}
        height={split ? m.buttonH : m.buttonHOld} style={{ marginTop: m.gapFieldButton }}
      >
        {split ? 'Sign in with Email' : 'Continue'}
      </YellowButton>

      <Divider m={m} style={{ marginTop: m.gapButtonDivider }}>Or continue with</Divider>
      <OAuthRow m={m} state={state} style={{ marginTop: m.gapDividerOAuth }} />

      <Legal m={m} style={{ marginTop: m.gapOAuthLegal }}>
        {split ? (
          <>By clicking continue, you agree to our <Underlined>Terms of Service</Underlined> and{' '}
            <Underlined>Privacy Policy</Underlined>.</>
        ) : (
          <>By creating an account, you agree to the <Underlined>Terms of Service</Underlined> and{' '}
            <Underlined>Privacy Policy</Underlined>.</>
        )}
      </Legal>
    </Screen>
  )
}

/**
 * The account picker a real Google sign-in opens — the thing the old SSO
 * button never actually did. Docked to the bottom of the stage, not the
 * narrow form column, the way a native picker sheets over the whole screen;
 * stays mounted and slides on `open`, the same idiom `dashboard-ui.tsx`'s
 * newsletter drawer uses for the same reason: a panel that unmounts on close
 * can only ever animate one way.
 */
export function GoogleChooser({ open, state, m }: { open: boolean; state: DemoState; m: StoryMetrics }) {
  return (
    <>
      <div className="demo-scrim pointer-events-none absolute inset-0 z-10" style={{ background: 'rgba(5, 5, 5, 0.32)', opacity: open ? 1 : 0 }} />
      <div
        className="demo-drawer absolute inset-x-0 bottom-0 z-20"
        style={{
          transform: open ? 'none' : 'translateY(calc(100% + 24px))',
          background: '#FFFFFF',
          borderRadius: '14px 14px 0 0',
          boxShadow: '0 -8px 30px rgba(5, 5, 5, 0.18)',
          padding: '22px 20px 26px',
        }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <GoogleMark size={18} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Choose an account</span>
        </div>

        {/* Two saved accounts, not one — a real Google picker is a list to
            choose from, not a single confirmation. The first is the one the
            script actually taps Continue for, flagged with a tinted row
            rather than a new interactive target. */}
        <div className="flex flex-col" style={{ marginTop: 16, gap: 2 }}>
          <div
            className="flex items-center rounded-lg"
            style={{ gap: 10, padding: 8, margin: '0 -8px', background: C.surface }}
          >
            <span
              aria-hidden
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#E9D9A0', color: '#5B4A1F', fontSize: 13, fontWeight: 700 }}
              className="flex shrink-0 items-center justify-center"
            >
              A
            </span>
            <span className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600 }}>Anna Kowalska</span>
              <span style={{ fontSize: 12, color: C.body }}>anna@mystore.com</span>
            </span>
          </div>
          <div className="flex items-center rounded-lg" style={{ gap: 10, padding: 8, margin: '0 -8px' }}>
            <span
              aria-hidden
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#CFE0F5', color: '#2B547E', fontSize: 13, fontWeight: 700 }}
              className="flex shrink-0 items-center justify-center"
            >
              M
            </span>
            <span className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600 }}>Marta Nowak</span>
              <span style={{ fontSize: 12, color: C.body }}>marta.nowak@gmail.com</span>
            </span>
          </div>
        </div>

        <p style={{ marginTop: 14, fontSize: 11, lineHeight: '15px', color: C.body }}>to continue to My Store</p>

        <div style={{ marginTop: 18 }}>
          <YellowButton target="chooser-continue" state={state} m={m} height={38}>Continue</YellowButton>
        </div>
      </div>
    </>
  )
}

/** Step 2 — the account already exists by the time a visitor lands here
 *  through SSO, so the copy asks for the rest as a formality, not a signup. */
export function StepTwo({ state, m }: ScreenProps) {
  const backRef = useTarget('back')

  // `screenPhase` stages the whole screen assembling itself, not just its
  // fields arriving — `SignupSplitArriveDemo` is the only demo that ever
  // sets it (starting on 'hidden'), so every other route through step 2
  // (the full story, the fixed hero/thumbnail demo, anywhere else this
  // screen is pinned) never touches it and both read as fully built,
  // same as before this existed.
  const phase = state.values.screenPhase
  const showChrome = phase !== 'hidden'
  const showButtons = phase !== 'hidden' && phase !== 'chrome'

  return (
    <Screen>
      {/* The dots/heading/subtitle land first — the screen's own chrome
          appearing before anything it asks for does. */}
      <div
        style={{
          opacity: showChrome ? 1 : 0,
          transform: showChrome ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}
      >
        <StepDots active={1} />
        <div style={{ marginTop: m.gapDotsHeading, width: '100%' }}>
          <Heading size={m.heading}>You&apos;re almost there</Heading>
        </div>
        <Subtitle m={m}>Share a few details so we can personalize your experience.</Subtitle>
      </div>

      {/* Arrives from the left, not just present: `SignupSplitArriveDemo`
          plays this alongside `SignupSplitDemo`, timed so Name and Shop URL
          land here at the exact moment they finish leaving the old form —
          one motion crossing both cards, not two unrelated screens. Every
          other demo that reaches step 2 never touches `arrive`, so
          `arriveOf`'s own default (fully here) leaves them untouched. */}
      <div
        style={{
          opacity: arriveOf(state.values.arrive),
          transform: `translateX(${(1 - arriveOf(state.values.arrive)) * -64}px)`,
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}
      >
        <Label m={m} style={{ marginTop: m.gapFirstLabel - 5 }}>Name</Label>
        <Field name="name" placeholder="John Doe" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

        <Label m={m} style={{ marginTop: m.gapFieldLabel }}>Shop URL</Label>
        <Field
          name="url"
          placeholder="www.yourstore.com"
          prefix="https://"
          state={state}
          m={m}
          style={{ marginTop: m.gapLabelField }}
        />
      </div>

      {/* Buttons close the screen out last — nothing to submit until
          everything above it exists. */}
      <div
        style={{
          marginTop: m.gapFieldButton, gap: m.backGap,
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}
        className="flex"
      >
        <div
          ref={backRef as React.Ref<HTMLDivElement>}
          style={{ width: m.backW, height: m.buttonH, borderRadius: 6, border: `1px solid ${C.border}` }}
          className="flex shrink-0 items-center justify-center"
        >
          <svg width={19} height={19} viewBox="0 0 22 22" fill="none">
            <path d="M13 5l-6 6 6 6M6 11h11" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <YellowButton target="create" state={state} m={m} style={{ flex: 1 }}>
          Get started
        </YellowButton>
      </div>
    </Screen>
  )
}
