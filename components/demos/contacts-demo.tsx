'use client'

import { useRef } from 'react'
import {
  Chip, Connector, CrossMark, Dashboard, Drawer, type EmailPreview, FlowStep,
  IDENTIFICATION_STEPS, IDENTIFICATION_TILES, IdentificationPanel, MailMark,
  metricsFor, PersonMark, RepeatMark, SectionTitle, SequencePanel, StepCard, TileRow, Title,
} from '@/components/demos/dashboard-ui'
import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * The contacts-activation screen, in the two beats a screenshot cannot carry.
 *
 * The sequence sends seven different emails rather than the same one seven
 * times, and each card holds its own subject, so the row states that standing
 * still — the mockup the screenshot came from repeated one subject across all
 * five, which is exactly the objection the design answers.
 *
 * Then the content itself, which is written by AI against the store's own
 * branding and only means anything once you see the mail. The cursor opens the
 * first two cards in turn, moves onto each preview and reads it down to the
 * footer. Two, not one: one drawer shows an email, two show that the emails
 * differ while the branding around them does not.
 *
 * Rebuilt from ci-dashboard.png and ci-email.png, which now live only in git
 * history (see commit 3cead12).
 */

/**
 * The two sends the cursor opens, by their index in `IDENTIFICATION_STEPS`.
 *
 * The sequence itself — five cards, five subjects — is shared with the freemium
 * walkthrough, which shows the same screen as step 3 of its onboarding. Only the
 * newsletters live here, because only this demo opens them.
 */
const EMAILS: (EmailPreview | undefined)[] = [
  {
    subject: 'Safe shopping — how we protect your data',
    preheader: 'No offers, no discount codes. Just what happens to your details when y…',
    when: '20 Dec at 2:48 PM',
    due: 'Sent',
    heroLines: ['SAFE', 'SHOPPING', 'AT ANIA'],
    heading: 'What happens to your details when you buy',
    body: 'Your card never touches our servers, your address is stored only for as long as an order needs it, and the whole thing is checked twice a year by an outside auditor. No offers in this one — we just thought you should know.',
    footer: {
      note: 'You are getting this because you have an account at ania.store.',
      address: 'ANIA, ul. Krupnicza 12, 31-123 Kraków, Poland',
    },
  },
  {
    subject: 'How we keep your account safe',
    preheader: 'The three things we do behind the scenes so you never have to think abo…',
    when: '16 Jan at 2:48 PM',
    due: 'In 27 days',
    heroLines: ['ACCOUNT', 'SECURITY', 'EXPLAINED'],
    heading: 'Three things we do so you don’t have to',
    body: 'Every order you place is encrypted end to end, every payment runs through our provider rather than our own servers, and nobody at ANIA can see your card details. We check the whole thing twice a year with an outside auditor, and we publish what they find.',
    footer: {
      note: 'You are getting this because you have an account at ania.store.',
      address: 'ANIA, ul. Krupnicza 12, 31-123 Kraków, Poland',
    },
  },
]

/** The cards that open, in flow order. A card's drawer is `screen` index n + 1,
 *  because index 0 is the dashboard with nothing open. */
const OPENS = IDENTIFICATION_STEPS.flatMap((_, i) => {
  const email = EMAILS[i]
  return email ? [{ card: `card${i + 1}`, email }] : []
})

/** Where the cursor rests over the preview. The email scrolls while it is there
 *  and only while it is there — reading happens under the pointer, so sending
 *  the page past a cursor parked on a card two hundred pixels away would read as
 *  the screen scrolling itself. */
const EMAIL = 'emailBody'

/** The point on the dimmed screen behind the drawer that dismisses it. */
const AWAY = 'awayFromDrawer'

const SCRIPT: Step[] = [
  { kind: 'wait', ms: 900 },

  ...OPENS.flatMap((open, i): Step[] => [
    { kind: 'click',  target: open.card },
    { kind: 'screen', index: i + 1 },
    // Let the drawer land before the pointer sets off after it.
    { kind: 'wait',   ms: 500 },
    { kind: 'move',   target: EMAIL },
    { kind: 'wait',   ms: 2400 },
    // Dismissed by clicking the screen behind it, not by hunting for the ×.
    { kind: 'click',  target: AWAY },
    { kind: 'screen', index: 0 },
    // A longer beat after the last one, so the loop does not snap round.
    { kind: 'wait',   ms: i === OPENS.length - 1 ? 1600 : 800 },
  ]),
]

/**
 * The poster: the dashboard with nothing open.
 *
 * A dashboard makes a better still than a form does — at card scale the tiles,
 * chips and connectors read as shape long before any of the text does — and the
 * five distinct subjects mean the still already carries the argument the script
 * goes on to spell out. Shown at rest, off screen, and under reduced motion.
 */
const REST: Partial<DemoState> = { screen: 0 }

/** The reactivation sequence, which the script never touches: it is there so the
 *  identification one reads as one sequence among several. */
const REACTIVATION = [
  { name: 'r1', tone: 'amber'  as const, eyebrow: 'Re-engagement', subject: 'We miss you!',         status: 'Send after 30 days' },
  { name: 'r2', tone: 'amber'  as const, eyebrow: 'Re-engagement', subject: 'We miss you!',         status: 'Send after 35 days' },
  { name: 'r3', tone: 'orange' as const, eyebrow: 'Reactivation',  subject: 'Special offer inside', status: 'Send after 40 days' },
  { name: 'r4', tone: 'orange' as const, eyebrow: 'Reactivation',  subject: 'Special offer inside', status: 'Send after 50 days' },
  { name: 'r5', tone: 'red'    as const, eyebrow: 'Sunset',        subject: 'Special offer inside', status: 'Send after 60 days' },
]

export function ContactsDemo(props: DemoProps) {
  // The drawer keeps rendering while it slides back out, by which time `screen`
  // has already returned to 0 — so which email it was showing has to survive
  // that, or it would blank halfway through the exit.
  const lastOpened = useRef(0)

  return (
    <DemoFrame script={SCRIPT} restState={REST} metrics={metricsFor} {...props}>
      {(state, m) => {
        if (state.screen > 0) lastOpened.current = state.screen - 1

        return (
          <Dashboard
            m={m}
            // Always mounted, parked off the edge it docks to until a card opens
            // it, which is what lets it slide both ways rather than only in.
            overlay={
              <Drawer
                open={state.screen > 0}
                scrolling={state.cursor === EMAIL}
                target={EMAIL}
                dismiss={AWAY}
                email={OPENS[lastOpened.current].email}
                m={m}
              />
            }
          >
            <Title m={m}>Contacts activation</Title>
            <TileRow tiles={IDENTIFICATION_TILES} run={state.run} m={m} style={{ marginTop: m.gapTitleTiles }} />

            <SectionTitle m={m} style={{ marginTop: m.gapTilesSection }}>Sequences</SectionTitle>

            <IdentificationPanel state={state} m={m} style={{ marginTop: m.gapSectionPanel }} />

            {m.sequences > 1 && (
              <SequencePanel
                m={m}
                style={{ marginTop: m.panelGap }}
                title="Reactivation sequence"
                body="Activates when contact didn't open any email or visited website for 60 days."
              >
                <Chip tone="grey" m={m} icon={<PersonMark size={Math.round(m.chipFont * 1.05)} />}>
                  Contact inactive 60 days
                </Chip>
                <Connector m={m} />
                {REACTIVATION.map((step, i) => (
                  <FlowStep key={step.name} last={i === REACTIVATION.length - 1} m={m}>
                    <StepCard
                      {...step}
                      icon={<MailMark size={Math.round(m.iconTile * 0.62)} />}
                      statusTone="blue"
                      state={state}
                      m={m}
                    />
                  </FlowStep>
                ))}
                <Connector m={m} />
                <Chip tone="red" m={m} icon={<CrossMark size={Math.round(m.chipFont * 1.05)} />}>
                  Contact archived
                </Chip>
              </SequencePanel>
            )}

          </Dashboard>
        )
      }}
    </DemoFrame>
  )
}
