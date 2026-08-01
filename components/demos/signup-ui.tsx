'use client'

import { useTarget } from '@/components/demos/demo-cursor'
import type { DemoVariant, StageMetrics } from '@/components/demos/demo-frame'
import { C } from '@/components/demos/edrone-tokens'
import type { DemoState } from '@/components/demos/use-demo-script'

/**
 * The edrone signup UI, shared by the before and after demos.
 *
 * The desktop numbers were sampled from the case-study screenshots, which are
 * 1.5x exports, so they are the originals divided by 1.5.
 *
 * The mobile set is not a scaled-down desktop: a shrunken 1340px screen reads as
 * a screenshot of a laptop, not as a phone. It is the same UI re-laid out at
 * phone proportions, with the side padding cut to 30px so the form fills the
 * width the way it does on a real device.
 */

export interface Metrics extends StageMetrics {
  column: number

  heading: number
  headingOld: number
  subtitle: number
  label: number

  fieldH: number
  fieldFont: number
  fieldPadX: number
  prefixW: number
  prefixWOld: number

  buttonH: number
  buttonHOld: number
  buttonFont: number
  backW: number
  backGap: number

  oauthH: number
  oauthGap: number
  oauthFont: number
  oauthIcon: number

  legal: number
  legalLH: number
  dividerFont: number

  /** Vertical rhythm, all measured between rendered boxes. */
  gapSubtitle: number
  gapFirstLabel: number
  gapLabelField: number
  gapFieldLabel: number
  gapFieldButton: number
  gapButtonDivider: number
  gapDividerOAuth: number
  gapOAuthLegal: number
  gapLegalFooter: number
}

export const DESKTOP: Metrics = {
  mobile: false,
  stageW: 1340, stageH: 1004, column: 550,
  heading: 44, headingOld: 42, subtitle: 17, label: 16,
  fieldH: 50, fieldFont: 17, fieldPadX: 15, prefixW: 89, prefixWOld: 82,
  buttonH: 60, buttonHOld: 50, buttonFont: 17, backW: 60, backGap: 12,
  oauthH: 60, oauthGap: 20, oauthFont: 17, oauthIcon: 22,
  legal: 16, legalLH: 24, dividerFont: 15,
  gapSubtitle: 10, gapFirstLabel: 53, gapLabelField: 8, gapFieldLabel: 23,
  gapFieldButton: 29, gapButtonDivider: 32, gapDividerOAuth: 31,
  gapOAuthLegal: 51, gapLegalFooter: 51,
}

const MOBILE: Metrics = {
  mobile: true,
  stageW: 390, stageH: 700, column: 330,
  heading: 23, headingOld: 22, subtitle: 13, label: 12,
  fieldH: 38, fieldFont: 13, fieldPadX: 11, prefixW: 58, prefixWOld: 55,
  buttonH: 41, buttonHOld: 38, buttonFont: 13, backW: 41, backGap: 9,
  oauthH: 41, oauthGap: 9, oauthFont: 12, oauthIcon: 16,
  legal: 11, legalLH: 16, dividerFont: 11,
  gapSubtitle: 6, gapFirstLabel: 26, gapLabelField: 5, gapFieldLabel: 14,
  gapFieldButton: 18, gapButtonDivider: 20, gapDividerOAuth: 18,
  gapOAuthLegal: 25, gapLegalFooter: 23,
}

/**
 * Compact desktop stage height. Derived from the home card, so the stage matches
 * that card's own shape at both breakpoints and never letterboxes:
 *
 *   mobile card, full bleed        378 / 235            = 1.6085
 *   desktop card, inset to 75.6%   (680 x 0.756) / 320  = 1.6065
 *   compact stage                  1340 / 834           = 1.6067
 *
 * The card renders the demo narrower than that (88% on a phone, 71.8% above sm)
 * to leave a beige margin around it. If `aspect-[378/235]` or
 * `sm:aspect-[680/320]` in components/project-row.tsx ever change, recompute it.
 */
const COMPACT_STAGE_H = 834

/** Compact phone stage. The shipped signup is ~390 tall here, so this leaves it
 *  ~75px of air per side instead of the 155 the tall stage gives. */
const COMPACT_MOBILE_STAGE_H = 540

/** Below this column width the demo switches to the phone layout. */
export const MOBILE_BREAKPOINT = 520

/** Side padding of the phone layout. Desktop leaves 395 per side, a phone 30. */
const MOBILE_PAD = 30

/** Widest and narrowest phone the stage pretends to be. */
const MOBILE_STAGE_MIN = 340
const MOBILE_STAGE_MAX = 460

/**
 * Picks the layout for a given column width.
 *
 * The phone stage tracks the column instead of sitting at a fixed 390, so the
 * screens render close to 1:1 rather than being blown up whenever the column is
 * wider than one particular phone.
 */
export function metricsFor(hostWidth: number, variant: DemoVariant = 'inline'): Metrics {
  // A card is a landscape slot however narrow the viewport gets, and a portrait
  // phone layout cannot fill one, so it never switches.
  if (variant === 'card') return { ...DESKTOP, stageH: COMPACT_STAGE_H }

  const compact = variant === 'compact'

  if (hostWidth === 0 || hostWidth >= MOBILE_BREAKPOINT) {
    return compact ? { ...DESKTOP, stageH: COMPACT_STAGE_H } : DESKTOP
  }

  const stageW = Math.min(Math.max(Math.round(hostWidth), MOBILE_STAGE_MIN), MOBILE_STAGE_MAX)
  return {
    ...MOBILE,
    stageW,
    column: stageW - 2 * MOBILE_PAD,
    ...(compact && { stageH: COMPACT_MOBILE_STAGE_H }),
  }
}

/** A paragraph, not a heading: the demo tree is aria-hidden, so a real heading
 *  here would only pollute the page outline without ever being announced. */
export const Heading = ({ children, size }: { children: React.ReactNode; size: number }) => (
  <p
    style={{ fontSize: size, fontWeight: 700, lineHeight: `${Math.round(size * 1.18)}px`, letterSpacing: '-0.02em' }}
    className="text-center text-balance"
  >
    {children}
  </p>
)

export const Subtitle = ({ children, m }: { children: React.ReactNode; m: Metrics }) => (
  <p style={{ marginTop: m.gapSubtitle, fontSize: m.subtitle, color: C.body }} className="text-center text-pretty">
    {children}
  </p>
)

export const Label = ({ children, m, style }: { children: React.ReactNode; m: Metrics; style?: React.CSSProperties }) => (
  <span style={{ fontSize: m.label, fontWeight: 600, ...style }}>{children}</span>
)

export const Underlined = ({ children }: { children: React.ReactNode }) => (
  <span style={{ textDecoration: 'underline', textUnderlineOffset: 2, color: C.ink }}>{children}</span>
)

export const Divider = ({ children, m, style }: { children: React.ReactNode; m: Metrics; style?: React.CSSProperties }) => (
  <div style={style} className="flex items-center gap-3">
    <span className="h-px flex-1" style={{ background: C.border }} />
    <span style={{ fontSize: m.dividerFont, color: C.body }}>{children}</span>
    <span className="h-px flex-1" style={{ background: C.border }} />
  </div>
)

export const Legal = ({ children, m, style }: { children: React.ReactNode; m: Metrics; style?: React.CSSProperties }) => (
  <p style={{ ...style, fontSize: m.legal, lineHeight: `${m.legalLH}px`, color: C.body }} className="text-center text-pretty">
    {children}
  </p>
)

interface FieldProps {
  name: string
  placeholder: string
  prefix?: string
  prefixWidth?: number
  state: DemoState
  m: Metrics
  style?: React.CSSProperties
}

export function Field({ name, placeholder, prefix, prefixWidth, state, m, style }: FieldProps) {
  const ref = useTarget(name)
  const value = state.values[name] ?? ''
  const focused = state.focus === name

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        ...style,
        height: m.fieldH,
        borderRadius: 6,
        border: `${focused ? 2 : 1}px solid ${focused ? C.focus : C.border}`,
        overflow: 'hidden',
      }}
      className="flex items-stretch"
    >
      {prefix && (
        <span
          style={{
            width: prefixWidth ?? m.prefixW,
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
            fontSize: m.fieldFont,
            color: C.body,
          }}
          className="flex shrink-0 items-center justify-center"
        >
          {prefix}
        </span>
      )}
      <span
        style={{ fontSize: m.fieldFont, paddingLeft: m.fieldPadX, paddingRight: m.fieldPadX }}
        className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap"
      >
        {value ? <span>{value}</span> : !focused && <span style={{ color: C.muted }}>{placeholder}</span>}
        {focused && <span className="demo-caret" style={{ background: C.ink }} />}
      </span>
    </div>
  )
}

interface YellowButtonProps {
  target: string
  state: DemoState
  m: Metrics
  children: React.ReactNode
  style?: React.CSSProperties
  height?: number
}

export function YellowButton({ target, state, m, children, style, height }: YellowButtonProps) {
  const ref = useTarget(target)
  const pressed = state.pressed === target

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        ...style,
        height: height ?? m.buttonH,
        borderRadius: 6,
        border: `1px solid ${C.ink}`,
        background: C.yellow,
        fontSize: m.buttonFont,
        fontWeight: 600,
        transform: pressed ? 'scale(0.994)' : 'none',
        filter: pressed ? 'brightness(0.95)' : 'none',
        transition: 'filter 120ms ease-out, transform 120ms ease-out',
      }}
      className="flex items-center justify-center"
    >
      {children}
    </div>
  )
}

export const OAuthRow = ({ m, style }: { m: Metrics; style?: React.CSSProperties }) => (
  <div style={{ ...style, gap: m.oauthGap }} className="grid grid-cols-2">
    <OAuthButton m={m} icon={<GoogleMark size={m.oauthIcon} />}>Google</OAuthButton>
    <OAuthButton m={m} icon={<ShopifyMark size={m.oauthIcon} />}>Shopify</OAuthButton>
  </div>
)

const OAuthButton = ({ icon, children, m }: { icon: React.ReactNode; children: React.ReactNode; m: Metrics }) => (
  <div
    style={{ height: m.oauthH, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: m.oauthFont, fontWeight: 500 }}
    className="flex items-center justify-center gap-2"
  >
    {icon}
    {children}
  </div>
)

const GoogleMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden>
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>
)

/** Stand-in for the Shopify bag mark, drawn rather than shipped as an asset. */
const ShopifyMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4.8 7h14.4l-1.3 12.4a2.2 2.2 0 0 1-2.2 2H8.3a2.2 2.2 0 0 1-2.2-2L4.8 7Z" fill="#95BF46" />
    <path d="M9 9.2V6a3 3 0 0 1 6 0v3.2" stroke="#5E8E3E" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
