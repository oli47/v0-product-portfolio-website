'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AniaWordmark } from '@/components/demos/ania-wordmark'
import { useTarget } from '@/components/demos/demo-cursor'
import type { DemoVariant, StageMetrics } from '@/components/demos/demo-frame'
import { C } from '@/components/demos/edrone-tokens'
import type { DemoState } from '@/components/demos/use-demo-script'

/**
 * The edrone contacts-activation dashboard: metric tiles over sequence cards,
 * plus the newsletter-preview drawer that opens off a card.
 *
 * Sampled from ci-dashboard.png and ci-email.png, which now live only in git
 * history (commit 3cead12). Unlike the signup exports those are 1x and 2x of the same 1920x1080
 * screen, so every desktop number below is a pixel measured off the 1x file with
 * nothing divided out. The stage is the content area alone — the icon rail and
 * the top bar are cropped, because a demo of a feature should not spend a third
 * of its width on app chrome the case study never mentions.
 *
 * The mobile set is not a scaled-down desktop. It is the same screen re-laid out
 * at phone proportions: tiles two across instead of four, and the sequence flow
 * stacked downwards instead of running off the side. It also shows one sequence
 * rather than two — five stacked cards already fill a phone, and the second
 * sequence is context the desktop layout already carries.
 */

export interface Metrics extends StageMetrics {
  /** How many sequence panels fit. Two on a desktop, one on a phone. */
  sequences: number

  /** The screen's own height, fixed while `stageH` varies with the variant. */
  screenH: number
  padX: number
  padTop: number
  padBottom: number

  title: number
  gapTitleTiles: number

  /** Tiles per row; the rest of the row is width divided by it. */
  tileCols: number
  tileH: number
  tileGap: number
  tilePad: number
  tileLabel: number
  tileHelp: number
  tileValue: number
  tilePillH: number
  tilePillFont: number
  tileMeta: number
  gapLabelValue: number
  gapValuePill: number

  gapTilesSection: number
  section: number
  gapSectionPanel: number

  /** Fixed panel height, which is what pins the Report button to the bottom of
   *  the description column. 0 lets the content size it, as the phone does. */
  panelH: number
  panelPad: number
  panelGap: number
  /** Width of the description column beside the flow. 0 stacks it above. */
  colW: number
  badgeH: number
  badgeFont: number
  badgePadX: number
  panelTitle: number
  panelBody: number
  panelBodyLH: number
  gapBadgeTitle: number
  gapTitleBody: number
  gapBodyReport: number
  reportH: number
  reportPadX: number
  reportFont: number
  reportIcon: number

  flowPad: number
  cardW: number
  cardH: number
  cardPad: number
  cardGap: number
  iconTile: number
  cardTitle: number
  cardTitleLH: number
  eyebrow: number
  chipH: number
  chipFont: number
  chipPadX: number
  /** Length of the rule between two steps, along the flow's own axis. */
  connLen: number

  drawerW: number
  /** How long the drawer takes to slide in or out, in ms. A sheet crosses more
   *  of the screen than a side panel, so the two are not the same number. */
  drawerMs: number
  drawerInset: number
  drawerPad: number
  drawerTitle: number
  drawerRowH: number
  drawerLabelW: number
  drawerLabel: number
  drawerValue: number
  heroH: number
  heroPad: number
  emailHeading: number
  emailBody: number
  emailBodyLH: number
  emailButtonH: number
  emailFooter: number
}

// Layout effects run before paint; on the server there is nothing to measure.
const useMeasure = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Radii, shared by both layouts because they never scaled with the screen. */
const R = { box: 6, chip: 4, icon: 6 }

export const DESKTOP: Metrics = {
  mobile: false, sequences: 2,
  stageW: 1846, stageH: 1002, screenH: 1002,
  padX: 23, padTop: 25, padBottom: 42,

  title: 34, gapTitleTiles: 18,

  tileCols: 4, tileH: 120, tileGap: 8, tilePad: 12,
  tileLabel: 16, tileHelp: 16, tileValue: 34,
  tilePillH: 24, tilePillFont: 13, tileMeta: 13,
  gapLabelValue: 5, gapValuePill: 10,

  gapTilesSection: 42, section: 26, gapSectionPanel: 19,

  panelH: 320, panelPad: 24, panelGap: 24, colW: 336,
  badgeH: 24, badgeFont: 12, badgePadX: 8,
  panelTitle: 22, panelBody: 15, panelBodyLH: 20,
  gapBadgeTitle: 20, gapTitleBody: 10, gapBodyReport: 20,
  reportH: 40, reportPadX: 16, reportFont: 16, reportIcon: 16,

  flowPad: 24, cardW: 160, cardH: 184, cardPad: 16, cardGap: 32,
  iconTile: 32, cardTitle: 15, cardTitleLH: 20, eyebrow: 13,
  chipH: 24, chipFont: 12, chipPadX: 8, connLen: 32,

  drawerW: 560, drawerMs: 380, drawerInset: 16, drawerPad: 24, drawerTitle: 20,
  drawerRowH: 40, drawerLabelW: 92, drawerLabel: 15, drawerValue: 15,
  heroH: 424, heroPad: 32,
  emailHeading: 18, emailBody: 15, emailBodyLH: 24, emailButtonH: 42, emailFooter: 12,
}

const MOBILE: Metrics = {
  mobile: true, sequences: 1,
  stageW: 390, stageH: 858, screenH: 858,
  padX: 16, padTop: 16, padBottom: 20,

  title: 22, gapTitleTiles: 14,

  tileCols: 2, tileH: 78, tileGap: 8, tilePad: 10,
  tileLabel: 11, tileHelp: 12, tileValue: 22,
  tilePillH: 18, tilePillFont: 10, tileMeta: 10,
  gapLabelValue: 4, gapValuePill: 6,

  gapTilesSection: 22, section: 17, gapSectionPanel: 10,

  panelH: 0, panelPad: 14, panelGap: 14, colW: 0,
  badgeH: 20, badgeFont: 10, badgePadX: 7,
  panelTitle: 16, panelBody: 11, panelBodyLH: 15,
  gapBadgeTitle: 10, gapTitleBody: 8, gapBodyReport: 12,
  reportH: 30, reportPadX: 12, reportFont: 12, reportIcon: 13,

  flowPad: 12, cardW: 0, cardH: 54, cardPad: 10, cardGap: 0,
  iconTile: 26, cardTitle: 11, cardTitleLH: 14, eyebrow: 10,
  chipH: 20, chipFont: 10, chipPadX: 8, connLen: 10,

  drawerW: 0, drawerMs: 300, drawerInset: 10, drawerPad: 14, drawerTitle: 15,
  drawerRowH: 28, drawerLabelW: 58, drawerLabel: 11, drawerValue: 11,
  heroH: 232, heroPad: 16,
  emailHeading: 13, emailBody: 11, emailBodyLH: 17, emailButtonH: 30, emailFooter: 9,
}

/** Below this column width the demo switches to the phone layout. Same value as
 *  the signup demos use, so the two switch together on the same page. */
export const MOBILE_BREAKPOINT = 520

/**
 * One stage everywhere.
 *
 * The three variants used to hand out three different heights, which meant the
 * home card and the case study hero were showing the same screen at different
 * shapes — the card padded with white above and below to match the card's own
 * ratio. That is a demo pretending to be two demos. The screen is 1846x1002 and
 * that is what every consumer gets; the card slot adapts to it instead, by
 * sizing the demo from its height (see components/project-row.tsx).
 *
 * `card` still means something: it pins the desktop layout, because a portrait
 * phone screen cannot fill a landscape slot however narrow the viewport gets.
 */
export function metricsFor(hostWidth: number, variant: DemoVariant = 'inline'): Metrics {
  if (variant === 'card') return DESKTOP

  if (hostWidth === 0 || hostWidth >= MOBILE_BREAKPOINT) return DESKTOP

  // The phone stage is a fixed 390 rather than one that tracks the column, which
  // is where this parts company with the signup demos. Their form floats in
  // white and can absorb a wider column by widening; this screen is sized to its
  // own content top to bottom, so a stage that grew sideways would only open a
  // gap underneath. Scaling a whole phone up by the 20% a wide column asks for
  // is the smaller distortion. `compact` gets the same stage for the same
  // reason: there is no white here to trim.
  return MOBILE
}

// ─── Status ramp ─────────────────────────────────────────────────────────────

/** Every state in this screen is one of six tints. */
export type Tone = 'mint' | 'blue' | 'amber' | 'orange' | 'red' | 'grey'

const TONES: Record<Tone, { fill: string; mark: string; ink: string }> = {
  mint:   { fill: C.mint,   mark: C.mintMark,   ink: C.mintInk },
  blue:   { fill: C.blue,   mark: C.blueMark,   ink: C.blueInk },
  amber:  { fill: C.amber,  mark: C.amberMark,  ink: C.amberInk },
  orange: { fill: C.orange, mark: C.orangeMark, ink: C.orangeInk },
  red:    { fill: C.red,    mark: C.redMark,    ink: C.redInk },
  grey:   { fill: C.grey,   mark: C.greyInk,    ink: C.greyInk },
}

// ─── Page furniture ──────────────────────────────────────────────────────────

/**
 * The stage.
 *
 * Two boxes, not one: the outer fills whatever stage the variant asked for, the
 * inner is the screen itself at its own fixed height. The compact and card
 * stages are taller than the screen, and that slack belongs outside it — around
 * the screen, not stretched through it, and not under the drawer, which docks to
 * the screen's edges rather than the stage's.
 *
 * A paragraph tree, not a heading tree: everything here sits inside an
 * aria-hidden frame, so real headings would pollute the page outline without
 * ever being announced.
 */
export const Dashboard = ({ children, overlay, m }: {
  children: React.ReactNode
  /** Drawn over the whole stage, slack included. The drawer and its scrim go
   *  here rather than inside the screen: a scrim that stopped at the screen's
   *  edge would leave the card variant's slack undimmed, which turns two bands
   *  of invisible white into two bands of visible padding. */
  overlay?: React.ReactNode
  m: Metrics
}) => (
  <div
    className="demo-screen-in relative flex h-full w-full flex-col justify-center overflow-hidden bg-white"
    style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
  >
    <div
      className="flex w-full flex-col"
      style={{ height: m.screenH, padding: `${m.padTop}px ${m.padX}px ${m.padBottom}px` }}
    >
      {children}
    </div>
    {overlay}
  </div>
)

export const Title = ({ children, m }: { children: React.ReactNode; m: Metrics }) => (
  <p style={{ fontSize: m.title, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
    {children}
  </p>
)

export const SectionTitle = ({ children, m, style }: { children: React.ReactNode; m: Metrics; style?: React.CSSProperties }) => (
  <p style={{ ...style, fontSize: m.section, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
    {children}
  </p>
)

// ─── Metric tiles ────────────────────────────────────────────────────────────

export interface TileData {
  label: string
  /** Held as a number so it can be counted up to. It is rendered split at the
   *  decimal point: the app sets the fraction back in grey, but keeps the unit
   *  that follows it at full strength. */
  value: number
  decimals: number
  prefix?: string
  suffix?: string
  delta: string
}

/** Count-up duration. Comfortably inside the beat before the cursor moves. */
const COUNT_MS = 1150

/**
 * Runs a value up from zero once per pass of the script.
 *
 * At rest `run` is 0 and the number simply is what it is: a poster should read
 * as a screenshot, and reduced motion never starts a pass, so it lands here too.
 */
function useCountUp(to: number, run: number) {
  const [shown, setShown] = useState(to)

  useEffect(() => {
    if (run === 0) { setShown(to); return }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS)
      // Cubic ease-out: fast enough to read as counting, slow enough at the end
      // to land on the number rather than snap to it.
      setShown(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, run])

  return shown
}

export const TileRow = ({ tiles, run, m, style }: {
  tiles: TileData[]
  run: number
  m: Metrics
  style?: React.CSSProperties
}) => (
  <div
    style={{ ...style, display: 'grid', gridTemplateColumns: `repeat(${m.tileCols}, 1fr)`, gap: m.tileGap }}
  >
    {tiles.map((t) => <Tile key={t.label} {...t} run={run} m={m} />)}
  </div>
)

function Tile({ label, value, decimals, prefix, suffix, delta, run, m }: TileData & {
  run: number
  m: Metrics
}) {
  const shown = useCountUp(value, run)
  const [whole, fraction] = shown.toFixed(decimals).split('.')
  // Space-grouped thousands, as the app writes them. The value never wraps, so
  // the space cannot break the number across two lines.
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return (
    <div
      style={{ height: m.tileH, padding: m.tilePad, background: C.surface, borderRadius: R.box }}
      className="flex min-w-0 flex-col"
    >
      <div className="flex min-w-0 items-center" style={{ gap: Math.round(m.tilePad * 0.6) }}>
        <span
          style={{ fontSize: m.tileLabel, color: C.body, lineHeight: 1.2 }}
          className="min-w-0 truncate"
        >
          {label}
        </span>
        <HelpMark size={m.tileHelp} />
      </div>

      <p
        style={{
          marginTop: m.gapLabelValue,
          fontSize: m.tileValue,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {prefix}{grouped}
        {fraction && <span style={{ color: C.muted }}>.{fraction}</span>}
        {suffix}
      </p>

      <div className="flex items-center" style={{ marginTop: 'auto', gap: 8 }}>
        <span
          style={{
            height: m.tilePillH,
            padding: `0 ${m.chipPadX}px`,
            gap: 4,
            background: C.mint,
            color: C.mintInk,
            borderRadius: R.chip,
            fontSize: m.tilePillFont,
            fontWeight: 500,
          }}
          className="flex shrink-0 items-center"
        >
          <TrendMark size={Math.round(m.tilePillFont * 0.9)} />
          {delta}
        </span>
        <span style={{ fontSize: m.tileMeta, color: C.body }} className="truncate">
          last 30 days
        </span>
      </div>
    </div>
  )
}

// ─── Sequence panel ──────────────────────────────────────────────────────────

interface SequencePanelProps {
  title: string
  body: string
  children: React.ReactNode
  m: Metrics
  style?: React.CSSProperties
}

/**
 * The sequence card: a description column beside the flow on a desktop, stacked
 * on a phone.
 *
 * The two are not the same layout with a different `flex-direction`. A phone
 * puts the overflow menu in the panel's top-right corner rather than beside the
 * button, and runs Report full width under the steps instead of tucking it into
 * a column that no longer exists — which is where a phone puts a card's primary
 * action, and it is the one control here worth a full-width tap target.
 */
export function SequencePanel({ title, body, children, m, style }: SequencePanelProps) {
  const report = (
    <div
      style={{
        height: m.reportH,
        padding: `0 ${m.reportPadX}px`,
        gap: Math.round(m.reportPadX * 0.85),
        background: '#FFFFFF',
        border: `1px solid ${C.border}`,
        borderRadius: R.box,
        fontSize: m.reportFont,
        fontWeight: 500,
      }}
      className="flex items-center justify-center"
    >
      <ChartMark size={m.reportIcon} />
      Report
    </div>
  )

  const badge = (
    <span
      style={{
        height: m.badgeH,
        padding: `0 ${m.badgePadX}px`,
        gap: 5,
        background: C.mintMark,
        color: '#FFFFFF',
        borderRadius: R.chip,
        fontSize: m.badgeFont,
        fontWeight: 500,
      }}
      className="flex w-fit shrink-0 items-center"
    >
      <PlayMark size={Math.round(m.badgeFont * 0.85)} />
      Active
    </span>
  )

  const header = (
    <div className="flex w-full items-center" style={{ gap: 10 }}>
      {badge}
      <span className="flex-1" />
      {m.mobile && <KebabMark size={Math.round(m.reportIcon * 1.1)} />}
    </div>
  )

  const text = (
    <>
      <p style={{ marginTop: m.gapBadgeTitle, fontSize: m.panelTitle, fontWeight: 600, lineHeight: 1.2 }}>
        {title}
      </p>
      <p
        style={{
          marginTop: m.gapTitleBody,
          fontSize: m.panelBody,
          lineHeight: `${m.panelBodyLH}px`,
          color: C.body,
        }}
        className="text-pretty"
      >
        {body}
      </p>
    </>
  )

  const flow = (
    <div
      style={{ background: C.panel, borderRadius: R.box, padding: m.flowPad }}
      className={m.mobile ? 'flex flex-col items-center' : 'flex flex-1 items-center justify-center'}
    >
      {children}
    </div>
  )

  return (
    <div
      style={{
        ...style,
        height: m.panelH || undefined,
        background: C.mint,
        borderRadius: R.box,
        padding: m.panelPad,
        gap: m.panelGap,
      }}
      className={m.mobile ? 'flex shrink-0 flex-col' : 'flex shrink-0'}
    >
      {m.mobile ? (
        <>
          {/* One block, not three: these are direct children of a flex column
              with a gap, so left loose the panel's gap would stack on top of
              the header-to-title and title-to-body margins and pull the copy
              apart. */}
          <div className="flex flex-col">
            {header}
            {text}
          </div>
          {flow}
          <div style={{ marginTop: -m.panelGap + m.gapBodyReport }}>{report}</div>
        </>
      ) : (
        <>
          <div style={{ width: m.colW }} className="flex shrink-0 flex-col">
            {header}
            {text}
            <div style={{ marginTop: 'auto', gap: 28 }} className="flex items-center">
              {report}
              <KebabMark size={Math.round(m.reportIcon * 1.1)} />
            </div>
          </div>
          {flow}
        </>
      )}
    </div>
  )
}

/** The rule joining one step of a sequence to the next: horizontal on a
 *  desktop, vertical on a phone, because the flow turns the corner with it. */
export const Connector = ({ m }: { m: Metrics }) => (
  <span
    aria-hidden
    style={{
      background: C.connector,
      flexShrink: 0,
      ...(m.mobile
        ? { width: 2, height: m.connLen, alignSelf: 'center' }
        : { height: 2, width: m.connLen }),
    }}
  />
)

export const Chip = ({ tone, icon, children, m }: {
  tone: Tone
  icon?: React.ReactNode
  children: React.ReactNode
  m: Metrics
}) => {
  const t = TONES[tone]
  return (
    <span
      style={{
        height: m.chipH,
        padding: `0 ${m.chipPadX}px`,
        gap: 5,
        background: t.fill,
        color: t.ink,
        borderRadius: R.chip,
        fontSize: m.chipFont,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
      className="flex w-fit shrink-0 items-center"
    >
      {icon}
      {children}
    </span>
  )
}

// ─── Step card ───────────────────────────────────────────────────────────────

interface StepCardProps {
  /** Target key the cursor aims at. */
  name: string
  tone: Tone
  icon: React.ReactNode
  /** Category line above the subject. Only the reactivation sequence has one. */
  eyebrow?: string
  subject: string
  status: string
  statusTone: Tone
  state: DemoState
  m: Metrics
}

export function StepCard({ name, tone, icon, eyebrow, subject, status, statusTone, state, m }: StepCardProps) {
  const ref = useTarget(name)
  const t = TONES[tone]
  const pressed = state.pressed === name

  const iconTile = (
    <span
      style={{ width: m.iconTile, height: m.iconTile, background: t.fill, borderRadius: R.icon, color: t.mark }}
      className="flex shrink-0 items-center justify-center"
    >
      {icon}
    </span>
  )

  const body = (
    <>
      {eyebrow && (
        <span style={{ fontSize: m.eyebrow, color: t.ink, lineHeight: `${m.cardTitleLH}px` }}>
          {eyebrow}
        </span>
      )}
      <span
        style={{ fontSize: m.cardTitle, lineHeight: `${m.cardTitleLH}px` }}
        className="text-pretty"
      >
        {subject}
      </span>
    </>
  )

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        width: m.cardW || '100%',
        height: m.cardH,
        padding: m.cardPad,
        background: '#FFFFFF',
        border: `1px solid ${C.border}`,
        borderRadius: R.box,
        transform: pressed ? 'scale(0.985)' : 'none',
        transition: 'transform 120ms ease-out',
      }}
      className={m.mobile ? 'flex shrink-0 items-center' : 'flex shrink-0 flex-col'}
    >
      {m.mobile ? (
        <>
          {iconTile}
          <span style={{ marginLeft: m.cardPad }} className="flex min-w-0 flex-1 flex-col">
            {body}
          </span>
          <Chip tone={statusTone} m={m}>{status}</Chip>
        </>
      ) : (
        <>
          {iconTile}
          <span style={{ marginTop: Math.round(m.cardPad * 1.4) }} className="flex flex-col">
            {body}
          </span>
          <span style={{ marginTop: 'auto' }}>
            <Chip tone={statusTone} m={m}>{status}</Chip>
          </span>
        </>
      )}
    </div>
  )
}

// ─── The identification screen's own content ─────────────────────────────────
// Two case studies show this screen: contacts-identification tells its story,
// and freemium-activation walks past it as step 3 of onboarding. They are the
// same screen of the same product, so the numbers and the subjects live here
// rather than in either demo, where they could only drift apart.

/** The numbers are the ones on the screenshot, including the two-tone split the
 *  app renders: the fraction is set back in grey, the unit is not. */
export const IDENTIFICATION_TILES: TileData[] = [
  { label: 'Identification',                  value: 16.7,     decimals: 1, suffix: ' %', delta: '9%' },
  { label: 'Reactivation',                    value: 88.4,     decimals: 1, suffix: ' %', delta: '14%' },
  { label: 'Revenue from activated contacts', value: 21773.63, decimals: 2, prefix: '$ ', delta: '4%' },
  { label: 'Savings from reactivation',       value: 50,       decimals: 2, prefix: '$ ', delta: '10%' },
]

/**
 * The identification sequence's first five sends.
 *
 * Every card carries its own subject, because that is the decision the Solution
 * section describes: seven different emails on a 30-day loop, none of them
 * marketing. The mockup the screenshot came from repeated one subject across all
 * five, which is exactly the objection the design answers.
 */
export interface IdentificationStep {
  status: string
  subject: string
}

export const IDENTIFICATION_STEPS: IdentificationStep[] = [
  { status: 'Sent',              subject: 'Safe shopping — how we protect your data' },
  { status: 'Send in 27 days',   subject: 'How we keep your account safe' },
  { status: 'Send in 57 days',   subject: 'A short note about your privacy' },
  { status: 'Send in 87 days',   subject: 'What we store, and what we never do' },
  { status: 'Send in 117 days',  subject: 'Two minutes on our privacy policy' },
]

export const IDENTIFICATION_BODY =
  'Sends 7 different emails to bring back inactive customers with personalized communication.'

/**
 * The whole identification panel: entry condition, five sends, repeat.
 *
 * Card `n` registers as target `card{n}` whether or not anything aims at it —
 * the contacts demo opens two of them and the freemium walkthrough opens none,
 * and a registry entry nothing points at costs nothing.
 */
export function IdentificationPanel({ steps = IDENTIFICATION_STEPS, state, m, style }: {
  /** Override the schedule. The subjects are the sequence and never change; the
   *  dates do, because an account that signed up this morning has not sent the
   *  first one yet. */
  steps?: IdentificationStep[]
  state: DemoState
  m: Metrics
  style?: React.CSSProperties
}) {
  return (
    <SequencePanel m={m} style={style} title="Identification" body={IDENTIFICATION_BODY}>
      <Chip tone="grey" m={m} icon={<PersonMark size={Math.round(m.chipFont * 1.05)} />}>
        No interaction for 30 days
      </Chip>
      <Connector m={m} />
      {steps.map((step, i) => (
        <FlowStep key={step.subject} last={i === steps.length - 1} m={m}>
          <StepCard
            name={`card${i + 1}`}
            tone={i === 0 ? 'mint' : 'blue'}
            icon={i === 0
              ? <ShieldMark size={Math.round(m.iconTile * 0.62)} />
              : <MailMark size={Math.round(m.iconTile * 0.62)} />}
            subject={step.subject}
            status={step.status}
            // Mint means gone, blue means booked. A schedule with nothing sent
            // yet is blue all the way across.
            statusTone={step.status === 'Sent' ? 'mint' : 'blue'}
            state={state}
            m={m}
          />
        </FlowStep>
      ))}
      <Connector m={m} />
      <Chip tone="blue" m={m} icon={<RepeatMark size={Math.round(m.chipFont * 1.05)} />}>
        Repeat sequence
      </Chip>
    </SequencePanel>
  )
}

/** A card plus the rule that joins it to the next one. */
export const FlowStep = ({ children, last, m }: {
  children: React.ReactNode
  last: boolean
  m: Metrics
}) => (
  <>
    {children}
    {!last && <Connector m={m} />}
  </>
)

// ─── Newsletter preview drawer ───────────────────────────────────────────────

/** One newsletter, as the preview drawer shows it. */
export interface EmailPreview {
  subject: string
  preheader: string
  /** When it goes out, and how far off that is. */
  when: string
  due: string
  /** The hero's own headline, one line per array entry. */
  heroLines: string[]
  heading: string
  body: string
  /** Everything under the call to action. A newsletter that ends at its button
   *  is a mockup; a real one carries who sent it and how to stop it, and this
   *  sequence's whole argument is that it is not marketing. */
  footer: { address: string; note: string }
}

interface DrawerProps {
  /** Slides in while true and back out while false, so it stays mounted: an
   *  element that unmounts on close can only ever animate one way. */
  open: boolean
  /** The preview reads itself down while true, which is while the cursor is
   *  resting on it. Scrolling a page the pointer is nowhere near reads as the
   *  screen doing it by itself. */
  scrolling: boolean
  /** Target key the cursor aims at to do that. */
  target: string
  /** Target key for the point outside the panel that dismisses it. */
  dismiss: string
  email: EmailPreview
  m: Metrics
}

/** Slides in from the right over a scrim. On a phone it is a full-width sheet
 *  rather than a panel, which is what the product does at that width. */
export function Drawer({ open, scrolling, target, dismiss, email, m }: DrawerProps) {
  const bodyRef = useTarget(target)
  const dismissRef = useTarget(dismiss)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // How far the preview has to travel to show its end. Measured rather than
  // stored as a metric: it depends on how this particular email's copy wraps at
  // this particular width, and a hardcoded distance would scroll a short one
  // into blank white.
  const [travel, setTravel] = useState(0)
  useMeasure(() => {
    const card = cardRef.current
    const scroller = scrollRef.current
    if (!card || !scroller) return
    const measure = () => setTravel(Math.max(0, scroller.scrollHeight - card.clientHeight))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [email, m])

  // The overlay covers the stage, which on the card variant is taller than the
  // screen; the panel still has to dock to the screen's edges, not the stage's.
  const slack = Math.round((m.stageH - m.screenH) / 2)

  // A phone gets a sheet up from the bottom edge, which is where a phone puts
  // this; a desktop gets a panel in from the right, which is where the product
  // puts it. Same component, same transition, different edge.
  const dock: React.CSSProperties = m.mobile
    ? {
        left: 0,
        right: 0,
        bottom: slack,
        // Not full height. A sheet has to leave the screen it covers visible
        // behind it, and stopping here also means the preview inside slightly
        // outgrows its box instead of ending in a band of blank white.
        top: slack + Math.round(m.screenH * 0.2),
        borderRadius: `${R.box * 2}px ${R.box * 2}px 0 0`,
        transform: open ? 'none' : 'translateY(calc(100% + 24px))',
      }
    : {
        top: slack + m.drawerInset,
        bottom: slack + m.drawerInset,
        right: m.drawerInset,
        width: m.drawerW,
        borderRadius: R.box,
        // Its own width plus the inset and the shadow's reach, so it parks
        // clear of the edge rather than peeking back in.
        transform: open ? 'none' : `translateX(calc(100% + ${m.drawerInset + 48}px))`,
      }

  return (
    <>
      <div
        className="demo-scrim absolute inset-0 z-10"
        style={{ background: 'rgba(5, 5, 5, 0.145)', opacity: open ? 1 : 0 }}
      >
        {/* Somewhere on the screen behind, clear of the panel: a side panel
            leaves the left free, a bottom sheet leaves the top. Clicking the
            scrim is how a drawer is really dismissed — reaching for the × is
            what you do when you cannot find anywhere else to click. */}
        <span
          ref={dismissRef as React.Ref<HTMLSpanElement>}
          className="absolute"
          style={m.mobile
            ? { left: '50%', top: '9%' }
            : { left: '26%', top: '50%' }}
        />
      </div>
      <div
        // Keyed on the dock so switching layouts remounts it. The two park in
        // different directions, and transitioning between an X and a Y offset
        // interpolates both at once, walking a parked drawer diagonally across
        // the screen. A remount has no previous value to animate from.
        key={m.mobile ? 'sheet' : 'panel'}
        className="demo-drawer absolute z-20 flex flex-col overflow-hidden"
        style={{
          ...dock,
          background: '#FFFFFF',
          border: `1px solid ${C.border}`,
          borderRadius: dock.borderRadius,
          boxShadow: '0 12px 40px rgba(5, 5, 5, 0.18)',
          padding: m.drawerPad,
          ['--demo-drawer-ms' as string]: `${m.drawerMs}ms`,
        }}
      >
        <div className="flex items-start justify-between">
          <p style={{ fontSize: m.drawerTitle, fontWeight: 600, lineHeight: 1.3 }}>Newsletter preview</p>
          <span className="flex shrink-0 items-center justify-center">
            <CloseMark size={Math.round(m.drawerTitle * 0.9)} />
          </span>
        </div>

        <div
          style={{
            marginTop: m.drawerPad,
            background: C.surface,
            borderRadius: R.box,
            padding: `0 ${Math.round(m.drawerPad * 0.67)}px`,
          }}
        >
          <DrawerRow label="Subject" m={m} tall>
            <span style={{ fontWeight: 500 }}>🔒 {email.subject}</span>
            <span style={{ color: C.body }} className="truncate">{email.preheader}</span>
          </DrawerRow>
          <DrawerRow label="Sender" m={m}>
            <span className="flex min-w-0 items-center" style={{ gap: 10 }}>
              {/* One store across the whole demo: the wordmark on the hero, the
                  address in the footer and the sender here all say ANIA KRUK. */}
              <span style={{ fontWeight: 500 }}>Karol from ANIA KRUK</span>
              <span style={{ color: C.body }} className="truncate">hello@aniakruk.pl</span>
            </span>
          </DrawerRow>
          <DrawerRow label="When" m={m} last>
            <span className="flex min-w-0 items-center" style={{ gap: 10 }}>
              {email.when}
              <Chip tone="blue" m={m}>{email.due}</Chip>
            </span>
          </DrawerRow>
        </div>

        <div
          ref={(el) => { cardRef.current = el; bodyRef(el) }}
          style={{ marginTop: m.drawerPad, border: `1px solid ${C.border}`, borderRadius: R.box }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Remounted on every open so the scroll replays, and only while open
              so a parked drawer is not animating off screen. The padding rides
              with the content, the way it would in a real scroll container. */}
          <div
            ref={scrollRef}
            className="demo-email-scroll flex shrink-0 flex-col items-center"
            style={{
              padding: m.heroPad,
              transform: scrolling && travel > 0 ? `translateY(${-travel}px)` : 'none',
            }}
          >
            <EmailHero lines={email.heroLines} m={m} />

            <p
              style={{ marginTop: m.heroPad, fontSize: m.emailHeading, fontWeight: 700, lineHeight: 1.3 }}
              className="text-center"
            >
              {email.heading}
            </p>
            <p
              style={{
                marginTop: Math.round(m.heroPad * 0.5),
                fontSize: m.emailBody,
                lineHeight: `${m.emailBodyLH}px`,
                color: C.body,
              }}
              className="text-balance text-center"
            >
              {email.body}
            </p>
            <div
              style={{
                marginTop: m.heroPad,
                height: m.emailButtonH,
                padding: `0 ${m.heroPad}px`,
                background: C.ink,
                color: '#FFFFFF',
                fontSize: m.emailBody,
                fontWeight: 500,
              }}
              className="flex shrink-0 items-center justify-center"
            >
              Check our Privacy Policy
            </div>

            <span
              style={{ marginTop: m.heroPad, width: '100%', height: 1, background: C.border }}
              className="shrink-0"
            />
            <p
              style={{
                marginTop: Math.round(m.heroPad * 0.6),
                fontSize: m.emailFooter,
                lineHeight: `${Math.round(m.emailFooter * 1.55)}px`,
                color: C.muted,
              }}
              className="text-center"
            >
              {email.footer.note}
              <br />
              {email.footer.address}
              <br />
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>Unsubscribe</span>
              {'  ·  '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>Manage preferences</span>
            </p>
          </div>
        </div>

        {/* Under the preview, not in it: this acts on the newsletter, while
            everything above is the newsletter. AI writes the copy — the point
            of the whole sequence — and this is where a user disagrees with it. */}
        <div
          style={{
            marginTop: m.drawerPad,
            height: m.reportH,
            gap: Math.round(m.reportPadX * 0.85),
            background: '#FFFFFF',
            border: `1px solid ${C.border}`,
            borderRadius: R.box,
            fontSize: m.reportFont,
            fontWeight: 500,
          }}
          className="flex shrink-0 items-center justify-center"
        >
          <PencilMark size={m.reportIcon} />
          Edit
        </div>
      </div>
    </>
  )
}

const DrawerRow = ({ label, children, m, tall, last }: {
  label: string
  children: React.ReactNode
  m: Metrics
  tall?: boolean
  last?: boolean
}) => (
  <div
    style={{
      minHeight: tall ? m.drawerRowH * 1.8 : m.drawerRowH,
      borderBottom: last ? undefined : `1px solid ${C.border}`,
      fontSize: m.drawerValue,
    }}
    className="flex items-center"
  >
    <span style={{ width: m.drawerLabelW, fontSize: m.drawerLabel, color: C.body }} className="shrink-0">
      {label}
    </span>
    <span className="flex min-w-0 flex-1 flex-col justify-center">{children}</span>
  </div>
)

/**
 * Stand-in for the campaign's hero photograph.
 *
 * The real email leads with a licensed product shot, which has no business being
 * committed to a portfolio repo. This carries the same two pieces of information
 * — whose store it is and what the mail is about — drawn in CSS. The gradient is
 * the store's, so it holds across the whole sequence; only the headline changes,
 * which is the point being made about who writes the content.
 */
const EmailHero = ({ lines, m }: { lines: string[]; m: Metrics }) => (
  <div
    style={{
      height: m.heroH,
      background:
        'radial-gradient(120% 90% at 18% 12%, #7E1408 0%, #4A0B06 42%, #14090A 100%),' +
        'linear-gradient(140deg, #B4331B 0%, #1A0B0C 70%)',
      padding: m.heroPad,
    }}
    className="flex w-full shrink-0 flex-col justify-between overflow-hidden"
  >
    {/* The store's real mark. It used to be the name set in letterspaced
        caps, which was a stand-in for this — and one the freemium demo, showing
        the same store, no longer used. */}
    <span style={{ color: 'rgba(255,255,255,0.88)' }}>
      <AniaWordmark height={Math.round(m.emailHeading * 1.7)} />
    </span>
    <span
      style={{
        fontSize: Math.round(m.emailHeading * 1.9),
        fontWeight: 700,
        lineHeight: 1.02,
        letterSpacing: '-0.01em',
        color: '#FFFFFF',
      }}
    >
      {lines.map((line, i) => (
        <span key={line} className="block">{line}</span>
      ))}
    </span>
  </div>
)

// ─── Marks ───────────────────────────────────────────────────────────────────
// Drawn rather than shipped as assets, and sized off the metrics so they track
// the layout they sit in. `currentColor` lets the status ramp drive them.

export const MailMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2.2" y="4.4" width="15.6" height="11.2" rx="1.8" fill="currentColor" />
    <path d="M3.4 6.1 10 10.9l6.6-4.8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShieldMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 2.4 3.6 5.1v5c0 4 2.7 6.4 6.4 7.5 3.7-1.1 6.4-3.5 6.4-7.5v-5L10 2.4Z" fill="currentColor" />
    <path d="m7.2 10.2 2 2 3.6-3.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HelpMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <circle cx="8" cy="8" r="6.6" stroke={C.muted} strokeWidth="1.1" />
    <path d="M6.5 6.3a1.5 1.5 0 1 1 1.9 1.6c-.3.1-.4.4-.4.7v.3" stroke={C.muted} strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="8" cy="11" r=".7" fill={C.muted} />
  </svg>
)

const TrendMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
    <path d="M1.6 8.6 4.6 5.4l2 2 3.7-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.8 3.4h2.6V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PlayMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
    <circle cx="6" cy="6" r="5.4" fill="currentColor" />
    <path d="M4.9 3.9 8.2 6 4.9 8.1V3.9Z" fill={C.mintMark} />
  </svg>
)

const PencilMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="M11.1 2.3 13.7 4.9 5.6 13H3v-2.6l8.1-8.1Z" stroke={C.ink} strokeWidth="1.3" strokeLinejoin="round" />
    <path d="m9.6 3.8 2.6 2.6" stroke={C.ink} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const ChartMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="M2 12.4 5.8 8l2.6 2.5L14 4.2" stroke={C.ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.7 4.2H14v3.2" stroke={C.ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const KebabMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    {[3.4, 8, 12.6].map((cy) => <circle key={cy} cx="8" cy={cy} r="1.15" fill={C.ink} />)}
  </svg>
)

const CloseMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="m3.6 3.6 8.8 8.8m0-8.8-8.8 8.8" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const PersonMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <circle cx="7" cy="4.6" r="2.4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.6 12c.5-2.3 2.3-3.5 4.4-3.5S10.9 9.7 11.4 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const RepeatMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <path d="M2.4 7a4.6 4.6 0 0 1 7.9-3.2M11.6 7a4.6 4.6 0 0 1-7.9 3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10.4 1.3v2.6H7.8M3.6 12.7v-2.6h2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CrossMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <path d="m3.6 3.6 6.8 6.8m0-6.8-6.8 6.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
