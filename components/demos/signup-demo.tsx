'use client'

import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import { useTarget } from '@/components/demos/demo-cursor'
import { C, Screen, TYPEFACE } from '@/components/demos/edrone-tokens'
import {
  Divider, Field, Heading, Label, Legal, metricsFor, type Metrics, OAuthRow, Subtitle,
  Underlined, YellowButton,
} from '@/components/demos/signup-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * The shipped signup: step 1 creates the account from an email, step 2 collects
 * what the product needs. Rebuilt from sf-signup1.png / sf-signup2.png,
 * which now live only in git history (see commit c96c901).
 */

const SCRIPT: Step[] = [
  { kind: 'wait',   ms: 700 },
  { kind: 'move',   target: 'email' },
  { kind: 'click',  target: 'email' },
  { kind: 'type',   field: 'email', text: 'anna@mystore.com', cps: 19 },
  { kind: 'wait',   ms: 450 },
  { kind: 'click',  target: 'submit' },
  { kind: 'screen', index: 1 },
  { kind: 'wait',   ms: 350 },
  { kind: 'click',  target: 'name' },
  { kind: 'type',   field: 'name', text: 'My Store', cps: 16 },
  { kind: 'wait',   ms: 300 },
  { kind: 'click',  target: 'url' },
  { kind: 'type',   field: 'url', text: 'mystore.com', cps: 18 },
  { kind: 'wait',   ms: 500 },
  { kind: 'click',  target: 'create' },
  { kind: 'wait',   ms: 1400 },
]

/** The poster: step 1 untouched, which is exactly what a screenshot of this
 *  screen looks like. Shown at rest, off screen, and under reduced motion. */
const REST: Partial<DemoState> = { screen: 0 }

export function SignupDemo(props: DemoProps) {
  return (
    <DemoFrame script={SCRIPT} restState={REST} metrics={metricsFor} ink={C.ink} typeface={TYPEFACE} {...props}>
      {(state, m) => (
        <div
          className="flex h-full w-full items-center justify-center bg-white"
          style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
        >
          <div style={{ width: m.column }}>
            {state.screen === 0 ? <StepOne state={state} m={m} /> : <StepTwo state={state} m={m} />}
          </div>
        </div>
      )}
    </DemoFrame>
  )
}

interface StepProps {
  state: DemoState
  m: Metrics
}

function StepOne({ state, m }: StepProps) {
  return (
    <Screen>
      <Heading size={m.heading}>Create an account</Heading>
      <Subtitle m={m}>Sign up to get started in under a minute</Subtitle>

      <Label m={m} style={{ marginTop: m.gapFirstLabel }}>Email</Label>
      <Field name="email" placeholder="you@email.com" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

      <YellowButton target="submit" state={state} m={m} style={{ marginTop: m.gapFieldButton }}>
        Sign in with Email
      </YellowButton>

      <Divider m={m} style={{ marginTop: m.gapButtonDivider }}>Or continue with</Divider>
      <OAuthRow m={m} style={{ marginTop: m.gapDividerOAuth }} />

      <Legal m={m} style={{ marginTop: m.gapOAuthLegal }}>
        By clicking continue, you agree to our <Underlined>Terms of Service</Underlined>
        {m.mobile ? ' ' : <br />}
        and <Underlined>Privacy Policy</Underlined>.
      </Legal>

      <Legal m={m} style={{ marginTop: m.gapLegalFooter }}>
        Already have an account? <Underlined>Sign in</Underlined>
      </Legal>
    </Screen>
  )
}

function StepTwo({ state, m }: StepProps) {
  const backRef = useTarget('back')

  return (
    <Screen>
      <Heading size={m.heading}>Set up your shop</Heading>
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
          <svg width={m.mobile ? 19 : 22} height={m.mobile ? 19 : 22} viewBox="0 0 22 22" fill="none">
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
