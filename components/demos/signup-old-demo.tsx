'use client'

import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import {
  C, Divider, Field, Heading, Label, Legal, OAuthRow, Screen, Subtitle, Underlined, YellowButton,
} from '@/components/demos/edrone-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * The signup as it was before the redesign: four fields in one pass, with the
 * SSO buttons sitting below the form they would have filled in. Rebuilt from
 * sf-signupold.png, which now lives only in git history (commit c96c901).
 */

const SCRIPT: Step[] = [
  { kind: 'wait',  ms: 700 },
  { kind: 'move',  target: 'name' },
  { kind: 'click', target: 'name' },
  { kind: 'type',  field: 'name',  text: 'Anna Kowalska', cps: 21 },
  { kind: 'click', target: 'email' },
  { kind: 'type',  field: 'email', text: 'anna@mystore.com', cps: 21 },
  { kind: 'click', target: 'phone' },
  { kind: 'type',  field: 'phone', text: '600 123 456', cps: 21 },
  { kind: 'click', target: 'url' },
  { kind: 'type',  field: 'url',   text: 'mystore.com', cps: 21 },
  { kind: 'wait',  ms: 450 },
  { kind: 'click', target: 'continue' },
  { kind: 'wait',  ms: 1400 },
]

/** The poster: the form filled in, because the point of this screen is how much
 *  it asked for. Shown at rest, off screen, and under reduced motion. */
const REST: Partial<DemoState> = {
  values: { name: 'Anna Kowalska', email: 'anna@mystore.com', phone: '600 123 456', url: 'mystore.com' },
}

export function SignupOldDemo(props: DemoProps) {
  return (
    // `variant` is pinned: this form is 883px tall, more than the compact stage
    // (834), so a compact or card caller would clip it top and bottom with no
    // error. Ignoring the request is the safe failure.
    <DemoFrame script={SCRIPT} restState={REST} {...props} variant="inline">
      {(state, m) => (
        <div
          className="flex h-full w-full items-center justify-center bg-white"
          style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
        >
          <div style={{ width: m.column }}>
            <Screen>
              <Heading size={m.headingOld}>Create an account</Heading>
              <Subtitle m={m}>We need a few details to set up your marketing automation.</Subtitle>

              <Label m={m} style={{ marginTop: m.gapFirstLabel }}>Name</Label>
              <Field name="name" placeholder="John Doe" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

              <Label m={m} style={{ marginTop: m.gapFieldLabel }}>Email</Label>
              <Field name="email" placeholder="user@email.com" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

              <Label m={m} style={{ marginTop: m.gapFieldLabel }}>Phone</Label>
              <Field name="phone" placeholder="123 456 789" state={state} m={m} style={{ marginTop: m.gapLabelField }} />

              <Label m={m} style={{ marginTop: m.gapFieldLabel }}>Shop URL</Label>
              <Field
                name="url"
                placeholder="www.yourstore.com"
                prefix="https://"
                prefixWidth={m.prefixWOld}
                state={state}
                m={m}
                style={{ marginTop: m.gapLabelField }}
              />

              <YellowButton
                target="continue"
                state={state}
                m={m}
                height={m.buttonHOld}
                style={{ marginTop: m.gapFieldButton }}
              >
                Continue
              </YellowButton>

              <Divider m={m} style={{ marginTop: m.gapButtonDivider }}>or continue with</Divider>
              <OAuthRow m={m} style={{ marginTop: m.gapDividerOAuth }} />

              <Legal m={m} style={{ marginTop: m.gapOAuthLegal }}>
                By creating an account, you agree to the <Underlined>Terms of Service</Underlined> and{' '}
                <Underlined>Privacy Policy</Underlined>.
                {m.mobile ? ' ' : <br />}
                We&apos;ll occasionally send you account-related emails.
              </Legal>
            </Screen>
          </div>
        </div>
      )}
    </DemoFrame>
  )
}
