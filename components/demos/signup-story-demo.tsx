'use client'

import { useTarget } from '@/components/demos/demo-cursor'
import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import { C, Screen, TYPEFACE } from '@/components/demos/edrone-tokens'
import {
  CollapsibleField, Confetti, LandingScreen, metricsForStory, phaseOf, type StoryMetrics,
  StepDots, SuccessScreen,
} from '@/components/demos/signup-story-ui'
import {
  Divider, Field, GoogleMark, Heading, Label, Legal, OAuthRow, Subtitle, Underlined, YellowButton,
} from '@/components/demos/signup-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * The signup redesign, told as one continuous story rather than a before/after
 * pair: a visitor lands on the site, meets the old four-field form, watches it
 * lose the phone number and split into steps, signs in with Google — a real
 * account picker, not a cut — and lands on the account it just created. Mobile
 * only — the simplest shape to read a story like this in.
 *
 * The old form and the new flow are not rebuilt from scratch: `signup-ui.tsx`'s
 * `Field`/`Heading`/`YellowButton`/etc are the same pieces `signup-demo.tsx`
 * and `signup-old-demo.tsx` use, because the point of this demo is that the
 * product on both ends of the story is the same one. And the old form and
 * step 1 of the new flow are not two screens either: they are one screen that
 * loses fields under the visitor rather than being swapped for another —
 * screen changes here are reserved for scenes that are genuinely different.
 */

const LANDING = 0
const FORM = 1
const STEP2 = 2
const SUCCESS = 3

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

  // Beat 4 — the form splits into steps: Name and Shop URL leave in turn,
  // the copy relabels itself, and the step indicator appears.
  { kind: 'set',  field: 'namePhase', text: 'fading' },
  { kind: 'wait', ms: 400 },
  { kind: 'set',  field: 'namePhase', text: 'gone' },
  { kind: 'wait', ms: 650 },
  { kind: 'set',  field: 'urlPhase', text: 'fading' },
  { kind: 'wait', ms: 400 },
  { kind: 'set',  field: 'urlPhase', text: 'gone' },
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
      {(state, m) => (
        <>
          <div
            className="relative flex h-full w-full items-center justify-center bg-white"
            style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
          >
            <div key={state.screen} style={{ width: state.screen === LANDING ? '100%' : m.column, height: state.screen === LANDING ? '100%' : undefined }}>
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
      )}
    </DemoFrame>
  )
}

interface ScreenProps {
  state: DemoState
  m: StoryMetrics
}

/**
 * The old form and step 1 of the new flow, as one persistently-mounted
 * screen: `phonePhase`/`namePhase`/`urlPhase` collapse fields out of it in
 * turn, and once both `namePhase` and `urlPhase` finish, `splitDone` swaps the
 * remaining copy over to the new flow's — the same "one thing, transforming"
 * the field removals already are, not a cut to a different component.
 */
function FormScreen({ state, m }: ScreenProps) {
  const phonePhase = phaseOf(state.values.phonePhase)
  const namePhase = phaseOf(state.values.namePhase)
  const urlPhase = phaseOf(state.values.urlPhase)
  const split = state.values.splitDone === '1'

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
        phase={namePhase} mode="relocate" label="Name" name="old-name" placeholder="John Doe"
        state={state} m={m} topGap={m.gapFirstLabel}
      />

      {/* Once Name has fully collapsed, Email becomes the form's lead field
          and takes the larger "first field" gap instead of the field-to-field
          one — animated, so the gap widens rather than jumping. */}
      <Label
        m={m}
        style={{
          marginTop: namePhase === 'gone' ? m.gapFirstLabel : m.gapFieldLabel,
          transition: 'margin-top 300ms ease-out',
        }}
      >
        Email
      </Label>
      <Field
        name="old-email" placeholder={split ? 'you@email.com' : 'user@email.com'}
        state={state} m={m} style={{ marginTop: m.gapLabelField }}
      />

      <CollapsibleField phase={phonePhase} label="Phone" name="old-phone" placeholder="123 456 789" state={state} m={m} />

      <CollapsibleField
        phase={urlPhase} mode="relocate" label="Shop URL" name="old-url" placeholder="www.yourstore.com"
        prefix="https://" prefixWidth={m.prefixWOld} state={state} m={m}
      />

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
function GoogleChooser({ open, state, m }: { open: boolean; state: DemoState; m: StoryMetrics }) {
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

        <div className="flex items-center" style={{ marginTop: 18, gap: 10 }}>
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

        <p style={{ marginTop: 14, fontSize: 11, lineHeight: '15px', color: C.body }}>to continue to My Store</p>

        <div style={{ marginTop: 18 }}>
          <YellowButton target="chooser-continue" state={state} m={m} height={38}>Continue</YellowButton>
        </div>
      </div>
    </>
  )
}

/** Step 2 — `signup-demo.tsx`'s second screen, plus the same step indicator.
 *  The account already exists by the time a visitor lands here through SSO. */
function StepTwo({ state, m }: ScreenProps) {
  const backRef = useTarget('back')

  return (
    <Screen>
      <StepDots active={1} />
      <div style={{ marginTop: m.gapDotsHeading, width: '100%' }}>
        <Heading size={m.heading}>Set up your shop</Heading>
      </div>
      <Subtitle m={m}>We&apos;ll use this to personalize your emails and storefront.</Subtitle>

      <Label m={m} style={{ marginTop: m.gapFirstLabel - 5 }}>Name</Label>
      <Field name="name" placeholder="" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

      <Label m={m} style={{ marginTop: m.gapFieldLabel }}>Shop URL</Label>
      <Field
        name="url"
        placeholder="www.yourstore.com"
        prefix="https://"
        state={state}
        m={m}
        style={{ marginTop: m.gapLabelField }}
      />

      <div style={{ marginTop: m.gapFieldButton, gap: m.backGap }} className="flex">
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
          Create an account
        </YellowButton>
      </div>
    </Screen>
  )
}
