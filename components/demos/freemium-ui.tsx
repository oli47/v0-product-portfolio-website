'use client'

import Image from 'next/image'
import { AniaWordmark } from '@/components/demos/ania-wordmark'
import { useTarget } from '@/components/demos/demo-cursor'
import type { DemoVariant, StageMetrics } from '@/components/demos/demo-frame'
import {
  type Metrics as DashMetrics, metricsFor as dashMetricsFor,
} from '@/components/demos/dashboard-ui'
import { C } from '@/components/demos/edrone-tokens'
import type { DemoState } from '@/components/demos/use-demo-script'

/**
 * The four screens of the freemium onboarding walkthrough, and the coach-mark
 * that drives it.
 *
 * Automations, Pop-ups, Contacts activation, Integrate — in that order, because
 * the order *is* the design decision the case study argues: everything is
 * already on before the user is asked for anything, and integration comes last
 * because connecting a store means handing over contacts and product data.
 *
 * Sampled from freemiumgif1-4.png, which now live only in git history. Those are
 * 2x exports of the same 1920x1080 window as the contacts screenshots, and the
 * content box is identical — x 61..1907, y 65..1067, so 1846 x 1002 at 1x. That
 * is why step 3 is not rebuilt here: it is `dashboard-ui.tsx` unchanged, on a
 * stage of exactly the same size.
 *
 * Four things are deliberately not what the stills show:
 *
 * - The counter runs 1/4 to 4/4. Every still reads "1/4", which is how they were
 *   captured rather than what the product did.
 * - The tabs read 17 / 7 / 10. The stills read 7 / 10 / 17, which does not add up.
 * - The campaign artwork is shorter than the export's. Its composition is a
 *   wordmark at the top and an offer at the bottom, and at the export's height
 *   most of the card was the gap between them.
 * - Every figure on the screens is zero, because the account this walks through
 *   is minutes old.
 */

export interface Metrics extends StageMetrics {
  /** The contacts screen is step 3, and it is a different module's screen. Its
   *  layout comes from that module rather than being restated here, so the two
   *  case studies showing it can never drift apart. */
  dash: DashMetrics

  /** The app around the screen. The stage is the whole window now, and the
   *  screen is the white box inset into it. 0 on a phone, which gets no chrome:
   *  a 60px icon rail is a desktop idea and there is no phone export to copy. */
  railW: number
  topBarH: number
  /** How far the content box stops short of the window's right and bottom. */
  appGap: number
  topBarFont: number
  topBarIcon: number
  railIcon: number

  /** The screen's own height: the content box's interior. */
  screenH: number
  padX: number
  padTop: number

  // ── page header ──
  title: number
  headerH: number
  /** Between the title and whatever the page puts beside it. */
  gapTitleActions: number
  /** Header actions, which only the Pop-ups screen has. */
  actionH: number
  actionPadX: number
  actionFont: number
  actionGap: number

  gapHeaderTabs: number

  // ── tab row ──
  tabsH: number
  tabPadX: number
  tabFont: number
  tabGap: number
  tabChipH: number
  tabChipPadX: number
  tabChipFont: number
  /** Width of one half of the grid/table toggle. 0 hides the toggle, which is
   *  what a phone does with a control that has nowhere useful to go. */
  toggleHalf: number

  gapTabsGrid: number

  // ── automation card grid ──
  cols: number
  gridGap: number
  cardPad: number
  /** The preview box on a card: the whole generated email, scaled down. */
  creativeH: number
  /** How much of that box the campaign banner takes. The rest is the email
   *  under it — which is the point of showing a preview rather than a banner. */
  creativeBanner: number
  /** The banner's own type, sized independently of its height so that
   *  shortening it makes the offer read larger rather than smaller. */
  creativePad: number
  creativeMark: number
  creativeHeadline: number
  /** The mail under the banner, at the sizes `dashboard-ui.tsx` sets one at:
   *  centred heading, a paragraph, a button. Whatever runs past the preview box
   *  is clipped, the way a preview of a longer mail should be. */
  emailPad: number
  emailGap: number
  emailHeading: number
  emailBody: number
  emailBodyLH: number
  emailBtnH: number
  emailBtnGap: number
  /** How far the grid eases down while the cursor rests in it. Set to exactly
   *  what hangs below the fold — two rows plus their gap, less the space the
   *  grid is given — so the scroll finishes the page rather than stopping
   *  somewhere arbitrary inside it. */
  gridLift: number
  cardTitle: number
  cardTitleLH: number
  cardBody: number
  cardBodyLH: number
  gapCreativeTitle: number
  gapTitleBody: number
  gapBodyRow: number
  /** Height of the badge row, and of the badge and chip that make it up. */
  cardRowH: number
  badgeFont: number
  badgePadX: number
  channelFont: number
  channelGap: number
  /** Fixed, because the grid is a grid: a card whose description wraps to three
   *  lines cannot be taller than the one beside it. */
  cardH: number

  // ── pop-up card ──
  popupW: number
  popupH: number
  /** The pale stage the pop-up floats on, and the pop-up drawn at the size
   *  that stage shows it. */
  previewAreaH: number
  previewW: number
  previewH: number

  // ── integrate screen ──
  logoTile: number
  logoRadius: number
  logoLink: number
  intHeading: number
  intSub: number
  intSubLH: number
  intChipH: number
  intChipFont: number
  intChipPadX: number
  intChipGap: number
  intBtnW: number
  intBtnH: number
  intBtnFont: number
  intLinkFont: number
  gapLogoHeading: number
  gapHeadingSub: number
  gapSubChips: number
  gapChipsBtn: number
  gapBtnLink: number

  // ── the setup screen, and the one after the store connects ──
  loaderRing: number
  /** How wide the loader's copy is allowed to get. Without it the paragraph
   *  runs to whatever the window gives it — one long line on a desktop, and on
   *  a phone a block of text hard against both edges of the screen. */
  loaderW: number
  loaderItem: number
  loaderItemGap: number
  loaderBarW: number
  loaderBarH: number
  gapRingHeading: number
  gapSubItems: number
  gapItemsBar: number
  confetti: number

  // ── coach-mark ──
  /** 0 on a phone, where the card is a full-width sheet instead. */
  coachW: number
  coachH: number
  coachInset: number
  coachPad: number
  coachIcon: number
  coachLabel: number
  coachLead: number
  coachLeadLH: number
  /** How many lines the lead paragraph is given. The screenshots hold this box
   *  at a fixed height across all four steps and centre the copy in it, so the
   *  bullets and the button never move as the walkthrough advances. */
  coachLines: number
  coachBulletFont: number
  coachBulletIcon: number
  /** Row height and the gap between rows, not a single pitch: the check marks
   *  land on measured pixels only when the copy sits in a box shorter than its
   *  own stride. */
  coachBulletH: number
  coachBulletGap: number
  coachBtnH: number
  coachBtnFont: number
  gapCoachHeadLead: number
  gapCoachLeadBullets: number
  /** The generating bar the card shows before step 1. */
  coachBarH: number
}

/** Radii, shared by both layouts because they never scaled with the screen. */
const R = { box: 6, chip: 4, group: 8 }

// `dash` is left empty in both tables and filled in by `metricsFor`: it is the
// other module's layout for the same host width, and asking for it here would
// mean deciding twice which breakpoint we are on.
export const DESKTOP: Metrics = {
  mobile: false, dash: {} as DashMetrics,
  stageW: 1920, stageH: 1080, screenH: 1002,
  railW: 60, topBarH: 64, appGap: 12,
  topBarFont: 15, topBarIcon: 18, railIcon: 18,
  padX: 23, padTop: 25,

  title: 31, headerH: 41, gapTitleActions: 16,
  actionH: 40, actionPadX: 18, actionFont: 15, actionGap: 8,

  gapHeaderTabs: 25,

  tabsH: 42, tabPadX: 12, tabFont: 15, tabGap: 8,
  tabChipH: 22, tabChipPadX: 6, tabChipFont: 13, toggleHalf: 42,

  gapTabsGrid: 20,

  cols: 4, gridGap: 24, cardPad: 16, creativeH: 315, creativeBanner: 150,
  creativePad: 16, creativeMark: 20, creativeHeadline: 26, gridLift: 165,
  emailPad: 18, emailGap: 12, emailHeading: 15, emailBody: 12, emailBodyLH: 17,
  emailBtnH: 32, emailBtnGap: 18,
  cardTitle: 17.5, cardTitleLH: 24, cardBody: 15, cardBodyLH: 20,
  gapCreativeTitle: 20, gapTitleBody: 8, gapBodyRow: 24,
  cardRowH: 32, badgeFont: 15, badgePadX: 10, channelFont: 13, channelGap: 13,
  cardH: 495,

  popupW: 383, popupH: 453, previewAreaH: 320, previewW: 302, previewH: 189,

  logoTile: 52, logoRadius: 8, logoLink: 20,
  intHeading: 35, intSub: 16, intSubLH: 24,
  intChipH: 24, intChipFont: 12, intChipPadX: 5, intChipGap: 4,
  intBtnW: 352, intBtnH: 40, intBtnFont: 16, intLinkFont: 16,
  gapLogoHeading: 41, gapHeadingSub: 12, gapSubChips: 19,
  gapChipsBtn: 56, gapBtnLink: 14,

  loaderRing: 44, loaderW: 560, loaderItem: 15, loaderItemGap: 10, loaderBarW: 320, loaderBarH: 6,
  gapRingHeading: 30, gapSubItems: 30, gapItemsBar: 30, confetti: 14,

  coachW: 402, coachH: 350, coachInset: 28, coachPad: 14,
  coachIcon: 22, coachLabel: 14,
  coachLead: 16, coachLeadLH: 22, coachLines: 4,
  coachBulletFont: 14, coachBulletIcon: 12, coachBulletH: 20, coachBulletGap: 8,
  coachBtnH: 40, coachBtnFont: 16, coachBarH: 6,
  gapCoachHeadLead: 16, gapCoachLeadBullets: 24,
}

/**
 * The phone layout, re-laid out rather than scaled down.
 *
 * The automations grid drops to one column, the Pop-ups header keeps one action
 * instead of two, the grid/table toggle goes away entirely, and the coach-mark
 * stops being a card in a corner and becomes a sheet across the bottom — which
 * is the only place a 402px card can go on a 390px screen.
 *
 * It is not the shipped Polish mobile build. That is a later version of the
 * product than the one this case study is about.
 */
const MOBILE: Metrics = {
  mobile: true, dash: {} as DashMetrics,
  stageW: 390, stageH: 858, screenH: 858,
  railW: 0, topBarH: 0, appGap: 0,
  topBarFont: 0, topBarIcon: 0, railIcon: 0,
  padX: 16, padTop: 16,

  title: 22, headerH: 28, gapTitleActions: 10,
  actionH: 30, actionPadX: 12, actionFont: 12, actionGap: 6,

  gapHeaderTabs: 16,

  tabsH: 32, tabPadX: 10, tabFont: 12, tabGap: 6,
  tabChipH: 18, tabChipPadX: 5, tabChipFont: 10, toggleHalf: 0,

  gapTabsGrid: 14,

  cols: 1, gridGap: 16, cardPad: 12, creativeH: 246, creativeBanner: 118,
  creativePad: 12, creativeMark: 16, creativeHeadline: 20, gridLift: 120,
  emailPad: 14, emailGap: 9, emailHeading: 13, emailBody: 10, emailBodyLH: 14,
  emailBtnH: 26, emailBtnGap: 13,
  cardTitle: 15, cardTitleLH: 20, cardBody: 12, cardBodyLH: 17,
  gapCreativeTitle: 14, gapTitleBody: 6, gapBodyRow: 16,
  cardRowH: 26, badgeFont: 12, badgePadX: 8, channelFont: 10, channelGap: 9,
  cardH: 0,

  popupW: 0, popupH: 0, previewAreaH: 264, previewW: 250, previewH: 156,

  logoTile: 44, logoRadius: 7, logoLink: 16,
  intHeading: 24, intSub: 14, intSubLH: 20,
  intChipH: 20, intChipFont: 10, intChipPadX: 5, intChipGap: 4,
  intBtnW: 0, intBtnH: 36, intBtnFont: 14, intLinkFont: 13,
  gapLogoHeading: 26, gapHeadingSub: 10, gapSubChips: 14,
  gapChipsBtn: 32, gapBtnLink: 14,

  loaderRing: 34, loaderW: 330, loaderItem: 12, loaderItemGap: 8, loaderBarW: 0, loaderBarH: 5,
  gapRingHeading: 22, gapSubItems: 22, gapItemsBar: 22, confetti: 10,

  coachW: 0, coachH: 288, coachInset: 0, coachPad: 14,
  coachIcon: 18, coachLabel: 12,
  coachLead: 14, coachLeadLH: 19, coachLines: 4,
  coachBulletFont: 12, coachBulletIcon: 11, coachBulletH: 16, coachBulletGap: 6,
  coachBtnH: 38, coachBtnFont: 14, coachBarH: 5,
  gapCoachHeadLead: 12, gapCoachLeadBullets: 18,
}

/** Below this column width the demo switches to the phone layout. Same value as
 *  the other demos use, so every demo on a page switches together. */
export const MOBILE_BREAKPOINT = 520

/**
 * One stage everywhere, and the same one the contacts demo uses.
 *
 * That is not a coincidence to be tidied away later: step 3 of this walkthrough
 * *is* that screen, so the two have to agree or the walkthrough would resize
 * halfway through. The dashboard's own metrics ride along under `dash`.
 */
export function metricsFor(hostWidth: number, variant: DemoVariant = 'inline'): Metrics {
  const phone = variant !== 'card' && hostWidth > 0 && hostWidth < MOBILE_BREAKPOINT
  return { ...(phone ? MOBILE : DESKTOP), dash: dashMetricsFor(hostWidth, variant) }
}

// ─── The app around the screen ───────────────────────────────────────────────

/**
 * The window: icon rail, top bar, and the white content box inset into them.
 *
 * The other two demos crop this away, because a demo of a feature should not
 * spend a third of its width on chrome the case study never mentions. This one
 * keeps it, because here the chrome is the point — the walkthrough is about a
 * user's first minutes *inside the product*, and a screen with no application
 * around it could be anything.
 *
 * Measured off freemiumgif1.png: window 1920x1080, rail 0..60, bar 0..64, both
 * on #FAFAFA behind a #F2F2F2 hairline, and the content box white at
 * x 61..1907, y 65..1067 — the same 1846x1002 every screen was already built to.
 *
 * A phone gets none of it. There is no phone export to copy, and a 60px icon
 * rail is a desktop idea; inventing one would be the only part of this demo not
 * taken from something real.
 */
export const AppFrame = ({ children, m }: { children: React.ReactNode; m: Metrics }) => {
  if (m.mobile) return <div className="relative h-full w-full">{children}</div>

  return (
    <div className="relative h-full w-full" style={{ background: C.surface }}>
      <TopBar m={m} />
      <Rail m={m} />
      <div
        className="absolute overflow-hidden"
        style={{
          left: m.railW,
          top: m.topBarH,
          right: m.appGap,
          bottom: m.appGap,
          background: '#FFFFFF',
          border: `1px solid ${C.grey}`,
          borderRadius: 4,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const TopBar = ({ m }: { m: Metrics }) => (
  <div
    className="absolute left-0 right-0 top-0 flex items-center"
    style={{ height: m.topBarH, padding: `0 ${m.railW / 3}px`, gap: 30 }}
  >
    <PanelMark size={m.topBarIcon} />
    <span className="flex items-center" style={{ gap: 10, color: C.body, fontSize: m.topBarFont }}>
      <SearchMark size={m.topBarIcon} />
      Search
    </span>

    <span className="flex-1" />

    <span className="flex items-center" style={{ gap: 10, fontSize: m.topBarFont }}>
      <BellMark size={m.topBarIcon} />
      Notifications
      <span
        style={{
          minWidth: 20,
          height: 20,
          padding: '0 6px',
          background: C.focus,
          color: '#FFFFFF',
          borderRadius: R.chip,
          fontSize: Math.round(m.topBarFont * 0.8),
          fontWeight: 500,
        }}
        className="flex items-center justify-center"
      >
        8
      </span>
    </span>
  </div>
)

/**
 * The icon rail.
 *
 * Ten marks and an avatar, on the vertical rhythm measured off the export: the
 * two at the top on their own, then six on a 40px pitch, then two more after a
 * wider gap, and the avatar pinned near the bottom. They are drawn small and
 * plain on purpose — at this scale the rail reads as a rail, and an icon set
 * detailed enough to name would only be inventing product it is not this case
 * study's job to show.
 */
const Rail = ({ m }: { m: Metrics }) => {
  const at = (y: number, mark: React.ReactNode) => (
    <span
      key={y}
      className="absolute flex items-center justify-center"
      style={{ left: 0, top: y - m.railIcon / 2, width: m.railW, height: m.railIcon }}
    >
      {mark}
    </span>
  )
  const s = m.railIcon
  return (
    <div
      className="absolute bottom-0 left-0 top-0"
      style={{ width: m.railW, borderRight: `1px solid ${C.grey}` }}
    >
      {at(92, <ArcMark size={s + 2} />)}
      {at(132, <BroadcastMark size={s} />)}
      {at(188, <ChatMark size={s} />)}
      {at(228, <EnvelopeMark size={s} />)}
      {at(268, <TreeMark size={s} />)}
      {at(308, <FindMark size={s} />)}
      {at(348, <StarMark size={s} />)}
      {at(388, <GiftMark size={s} />)}
      {at(444, <PeopleMark size={s} />)}
      {at(484, <TrendUpMark size={s} />)}
      <span
        className="absolute"
        style={{
          left: (m.railW - 36) / 2,
          top: 1042 - 18,
          width: 36,
          height: 36,
          borderRadius: R.box,
          background: 'linear-gradient(150deg, #8C7BD8 0%, #4B3A86 100%)',
        }}
      />
    </div>
  )
}

// ─── Page furniture ──────────────────────────────────────────────────────────

/**
 * The stage for the three screens built here.
 *
 * Step 3 does not use it — it brings `Dashboard` from `dashboard-ui.tsx`, which
 * is the same two boxes with the same rules. Both centre a fixed-height screen
 * in whatever stage the variant asked for, so the slack the card variant adds
 * lands around the screen rather than being stretched through it.
 *
 * Neither of them holds the coach-mark. That card is a sibling of the screens
 * rather than a child of one, because it is the one thing on the stage that has
 * to survive a screen change untouched.
 *
 * A paragraph tree, not a heading tree: everything here sits inside an
 * aria-hidden frame, so real headings would pollute the page outline without
 * ever being announced.
 */
export const Page = ({ children, m, centre, sheetBelow }: {
  children: React.ReactNode
  m: Metrics
  /** The integrate screen is an empty state: one block in the middle of the
   *  page rather than content stacked from the top. */
  centre?: boolean
  /** Whether a coach-mark is on this screen. Only matters on a phone, where the
   *  card is a sheet across the bottom third and a centred block has to centre
   *  in what is left. The two screens with no card centre in the whole screen. */
  sheetBelow?: boolean
}) => (
  <div
    className="demo-screen-in relative flex h-full w-full flex-col justify-center overflow-hidden bg-white"
    style={{ fontFamily: 'var(--font-dm-sans)', color: C.ink }}
  >
    <div
      className={`flex w-full flex-col${centre ? ' items-center justify-center' : ''}`}
      style={{
        height: m.screenH,
        // A centred screen centres in what is left of it. On a phone the
        // coach-mark is a sheet across the bottom third, and a block centred in
        // the whole screen would run underneath it — which on the one screen
        // that is nothing but a call to action would put the call to action
        // behind the card telling you to press it.
        padding: centre
          ? `0 ${m.padX}px ${m.mobile && sheetBelow ? m.coachH : 0}px`
          : `${m.padTop}px ${m.padX}px 0`,
      }}
    >
      {children}
    </div>
  </div>
)

/** Page title and, beside it, whatever that page puts in its header. */
export const PageHeader = ({ title, actions, m }: {
  title: string
  actions?: React.ReactNode
  m: Metrics
}) => (
  <div className="flex shrink-0 items-center" style={{ height: m.headerH, gap: m.gapTitleActions }}>
    <p style={{ fontSize: m.title, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
      {title}
    </p>
    <span className="flex-1" />
    {actions}
  </div>
)

/** A header action. `tone` picks the app's two: yellow for the primary one on
 *  the page, plain white for everything else. */
export const Action = ({ tone, icon, children, m }: {
  tone: 'yellow' | 'plain'
  icon: React.ReactNode
  children: React.ReactNode
  m: Metrics
}) => (
  <span
    style={{
      height: m.actionH,
      padding: `0 ${m.actionPadX}px`,
      gap: Math.round(m.actionPadX * 0.45),
      background: tone === 'yellow' ? C.yellow : '#FFFFFF',
      // The yellow is light enough to vanish against white, so the primary
      // action is outlined in the ink it is labelled with rather than in itself.
      border: `1px solid ${tone === 'yellow' ? C.ink : C.border}`,
      borderRadius: R.box,
      fontSize: m.actionFont,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
    className="flex shrink-0 items-center"
  >
    {icon}
    {children}
  </span>
)

// ─── Tabs and the view toggle ────────────────────────────────────────────────

export interface TabData {
  label: string
  count: number
}

/**
 * The filter tabs, with the grid/table toggle that sits on the same line.
 *
 * `toggleRight` is the one place the two grid screens genuinely disagree: the
 * Automations page pushes the toggle to the far edge and the Pop-ups page tucks
 * it in beside the tabs. Reproduced rather than reconciled — they are different
 * pages, and a reader is not tracking a 4-icon control across a screen change.
 */
export const TabRow = ({ tabs, toggleRight, m, style }: {
  tabs: TabData[]
  toggleRight?: boolean
  m: Metrics
  style?: React.CSSProperties
}) => (
  <div style={{ ...style, gap: m.tabGap }} className="flex shrink-0 items-center">
    <span
      style={{
        height: m.tabsH,
        background: C.grey,
        border: `1px solid #EAEAEA`,
        borderRadius: R.group,
      }}
      className="flex shrink-0 items-stretch overflow-hidden"
    >
      {tabs.map((tab, i) => (
        <span
          key={tab.label}
          style={{
            padding: `0 ${m.tabPadX}px`,
            gap: Math.round(m.tabPadX * 0.7),
            // Only the first tab is ever selected here: these are four stills of
            // a walkthrough nobody filtered.
            background: i === 0 ? '#FFFFFF' : 'transparent',
            color: i === 0 ? '#262626' : C.body,
            fontSize: m.tabFont,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
          className="flex items-center"
        >
          {tab.label}
          <span
            style={{
              height: m.tabChipH,
              minWidth: m.tabChipH,
              padding: `0 ${m.tabChipPadX}px`,
              background: i === 0 ? C.grey : '#E5E5E5',
              color: '#363636',
              borderRadius: R.chip,
              fontSize: m.tabChipFont,
            }}
            className="flex items-center justify-center"
          >
            {tab.count}
          </span>
        </span>
      ))}
    </span>

    {toggleRight && <span className="flex-1" />}
    {m.toggleHalf > 0 && (
      <span
        style={{
          height: m.tabsH,
          background: C.grey,
          border: `1px solid #EAEAEA`,
          borderRadius: R.group,
        }}
        className="flex shrink-0 items-stretch overflow-hidden"
      >
        <span
          style={{ width: m.toggleHalf, background: '#FFFFFF' }}
          className="flex items-center justify-center"
        >
          <GridMark size={18} />
        </span>
        <span style={{ width: m.toggleHalf }} className="flex items-center justify-center">
          <TableMark size={18} />
        </span>
      </span>
    )}
  </div>
)

// ─── Automation cards ────────────────────────────────────────────────────────

/** One card's campaign artwork, as CSS. See `Creative` for why. */
export interface CreativeArt {
  from: string
  to: string
  ink: string
  /** The offer, one line per entry, set large. Omitted where the real creative
   *  is the wordmark and nothing else. */
  lines?: string[]
  eyebrow?: string
  note?: string
  /**
   * The generated creative, cropped to the banner.
   *
   * `from` and `to` still matter: they are what the banner shows while the
   * image loads, so a card never opens on a white hole.
   */
  photo: string
  /** What the mail says under the banner. */
  heading: string
  body: string
  cta: string
}

export interface AutomationData {
  title: string
  body: string
  revenue: string
  art: CreativeArt
}

/**
 * The generated email, as the card previews it.
 *
 * A banner and then the mail under it, not a banner alone. What the screen is
 * claiming is that *AI wrote content from the store's URL*, and a full-bleed
 * hero only shows that it found the branding — the copy underneath is the part
 * nobody had to write, so the preview has to leave room for it.
 *
 * The photography is a gradient. The real campaigns are licensed brand shots
 * with very large type over them, which has no business being committed to a
 * portfolio repo, and at the size a card renders here — 400px on the case study
 * stage, a third of that on the home card — the type is what carries the claim
 * anyway. Same trade the contacts demo makes for its newsletter hero.
 */
export const Creative = ({ art, m }: { art: CreativeArt; m: Metrics }) => {
  const pad = m.creativePad
  const headline = m.creativeHeadline

  return (
    <div
      style={{ height: m.creativeH, background: '#FFFFFF', borderRadius: R.chip }}
      className="flex w-full shrink-0 flex-col overflow-hidden"
    >
      <div
        style={{
          height: m.creativeBanner,
          padding: pad,
          background: `linear-gradient(146deg, ${art.from} 0%, ${art.to} 100%)`,
        }}
        className="relative flex shrink-0 flex-col justify-between overflow-hidden"
      >
        <Image
          src={art.photo}
          alt=""
          fill
          quality={80}
          // The stage is scaled down hard by the time it reaches a reader: a 400px
          // banner is ~150 CSS px in the case study and ~113 on the home card.
          // Asking for 400 would fetch four times the pixels anyone sees.
          sizes="(max-width: 520px) 340px, 200px"
          className="object-cover"
        />
        {/* Under the offer, over the photograph. The campaigns set their type
            straight onto the picture, which only works if the picture is made
            to give way underneath it — and these were generated without knowing
            what would land on top. */}
        {art.lines && (
          <span
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,6,4,0.76) 0%, rgba(8,6,4,0.42) 38%,' +
                ' rgba(8,6,4,0.10) 68%, rgba(8,6,4,0) 100%)',
            }}
          />
        )}

        <span className="relative">
          <Wordmark ink={art.ink} size={m.creativeMark} shadow />
        </span>
        {art.lines && (
          <span className="relative flex flex-col">
              {art.eyebrow && (
                <span
                  style={{
                    marginBottom: Math.round(pad * 0.4),
                    fontSize: Math.round(headline * 0.44),
                    color: art.ink,
                    opacity: 0.9,
                  }}
                >
                  {art.eyebrow}
                </span>
              )}
              {art.lines?.map((line) => (
                <span
                  key={line}
                  style={{
                    fontSize: headline,
                    fontWeight: 700,
                    lineHeight: 1.06,
                    letterSpacing: '-0.01em',
                    color: art.ink,
                  }}
                >
                  {line}
                </span>
              ))}
              {art.note && (
              <span
                style={{
                  marginTop: Math.round(pad * 0.45),
                  fontSize: Math.round(headline * 0.42),
                  color: art.ink,
                  opacity: 0.9,
                }}
              >
                {art.note}
              </span>
            )}
          </span>
        )}
      </div>

      {/* The mail itself, at the proportions `dashboard-ui.tsx` gives one in the
          newsletter drawer — centred heading, a paragraph, a button. Nothing is
          squeezed to fit the box; the box clips whatever runs past, which is
          what a preview of a longer mail looks like. */}
      <div
        style={{ padding: m.emailPad, gap: m.emailGap }}
        className="flex shrink-0 flex-col items-center text-center"
      >
        <span style={{ fontSize: m.emailHeading, fontWeight: 700, lineHeight: 1.3 }}>
          {art.heading}
        </span>
        <span
          style={{ fontSize: m.emailBody, lineHeight: `${m.emailBodyLH}px`, color: C.body }}
          className="text-balance"
        >
          {art.body}
        </span>
        <span
          style={{
            marginTop: m.emailBtnGap - m.emailGap,
            height: m.emailBtnH,
            padding: `0 ${Math.round(m.emailBtnH * 1.15)}px`,
            background: C.ink,
            color: '#FFFFFF',
            fontSize: Math.round(m.emailBody * 0.92),
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
          className="flex shrink-0 items-center whitespace-nowrap"
        >
          {art.cta}
        </span>
      </div>
    </div>
  )
}

export const AutomationCard = ({ data, m }: { data: AutomationData; m: Metrics }) => (
  <div
    style={{
      height: m.cardH || undefined,
      padding: m.cardPad,
      background: C.mint,
      borderRadius: R.box,
    }}
    className="flex min-w-0 flex-col"
  >
    <Creative art={data.art} m={m} />

    <p
      style={{
        marginTop: m.gapCreativeTitle,
        fontSize: m.cardTitle,
        lineHeight: `${m.cardTitleLH}px`,
        fontWeight: 600,
        color: '#262626',
      }}
      className="truncate"
    >
      {data.title}
    </p>
    <p
      style={{
        marginTop: m.gapTitleBody,
        height: m.cardBodyLH * 2,
        fontSize: m.cardBody,
        lineHeight: `${m.cardBodyLH}px`,
        color: C.body,
        // Two lines whatever the copy does, so a long description cannot push
        // the badge row of one card out of line with the next.
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {data.body}
    </p>

    <div
      style={{ marginTop: m.gapBodyRow, height: m.cardRowH }}
      className="flex shrink-0 items-center"
    >
      <ActiveBadge revenue={data.revenue} m={m} />
      <span className="flex-1" />
      <Channels m={m} />
    </div>
  </div>
)

/**
 * The store's mark, over whichever kind of banner is underneath.
 *
 * The real logotype, tinted by `currentColor` to whatever reads on the artwork
 * behind it. `size` is still the old text size, so the metrics that set it did
 * not have to change: the lockup was about one and a half times its cap height,
 * and the logotype is scaled to match.
 */
const Wordmark = ({ ink, size, pad, shadow }: {
  ink: string
  size: number
  /** Set to place it in a banner's corner. Omitted where the banner's own
   *  layout is already positioning it. */
  pad?: number
  /** A photograph or a drawn set needs it to stay legible; a flat gradient
   *  does not, and gets a cleaner mark without it. */
  shadow?: boolean
}) => (
  <span
    className={pad === undefined ? 'block' : 'absolute block'}
    style={{
      ...(pad === undefined ? null : { left: pad, top: pad }),
      color: ink,
      filter: shadow ? 'drop-shadow(0 1px 10px rgba(0, 0, 0, 0.45))' : undefined,
    }}
  >
    <AniaWordmark height={Math.round(size * 1.5)} />
  </span>
)

/** Target key for the point in the card grid the cursor rests on to scroll it. */
export const GRID = 'grid'

/**
 * The card grid, and the short scroll it takes while the cursor is resting in it.
 *
 * Two cards' worth of grid does not fit the content box, and a screen that never
 * moves reads as a picture of a page rather than a page. So the pointer goes
 * down into the cards, the grid follows it far enough to finish the second row,
 * and it eases back on its own when the pointer leaves for the coach-mark —
 * the same rule the newsletter preview follows in `dashboard-ui.tsx`: nothing
 * scrolls unless the pointer is on it.
 */
export const CardGrid = ({ lifted, children, m, style }: {
  lifted: boolean
  children: React.ReactNode
  m: Metrics
  style?: React.CSSProperties
}) => {
  const ref = useTarget(GRID)
  return (
    // Takes the rest of the screen and clips to it, so the grid scrolls *under*
    // the header and the filters rather than over them. Without the clip a
    // translated grid simply slides up the page and swallows the tab row, which
    // is not what scrolling a page looks like.
    <div style={style} className="relative min-h-0 flex-1 overflow-hidden">
      <div
        className="demo-grid-scroll"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${m.cols}, minmax(0, 1fr))`,
          gap: m.gridGap,
          transform: lifted ? `translateY(${-m.gridLift}px)` : 'none',
        }}
      >
        {children}
      </div>
      {/* Where the pointer goes to do it: over the cards, well clear of the
          coach-mark it has to come back to. */}
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className="pointer-events-none absolute"
        style={{ left: '32%', top: m.mobile ? '30%' : '46%' }}
      />
    </div>
  )
}

/**
 * The green Active pill with the revenue it has earned welded to its side.
 *
 * Each half carries its own outer radius rather than the pair being rounded and
 * clipped. A parent with `overflow: hidden` and a corner radius cuts the
 * corners off the bordered half inside it, which at this size reads as a broken
 * outline rather than a rounded one.
 */
export const ActiveBadge = ({ revenue, m }: { revenue?: string; m: Metrics }) => {
  const ends = revenue
    ? [`${R.chip}px 0 0 ${R.chip}px`, `0 ${R.chip}px ${R.chip}px 0`]
    : [`${R.chip}px`, '']

  return (
    <span
      style={{ height: m.cardRowH, fontSize: m.badgeFont, fontWeight: 500 }}
      className="flex shrink-0 items-stretch"
    >
      <span
        style={{
          padding: `0 ${m.badgePadX}px`,
          gap: Math.round(m.badgePadX * 0.6),
          background: C.mintMark,
          // Matched to the other half's border box, so the two sit on one line
          // instead of the green standing a pixel proud at the top and bottom.
          border: `1px solid ${C.mintMark}`,
          borderRadius: ends[0],
          color: '#FFFFFF',
        }}
        className="flex items-center"
      >
        <PlayMark size={Math.round(m.badgeFont * 0.8)} />
        Active
      </span>
      {revenue && (
        <span
          style={{
            padding: `0 ${m.badgePadX}px`,
            background: '#F6FEF9',
            border: `1px solid ${C.mintMark}`,
            borderLeft: 'none',
            borderRadius: ends[1],
            color: C.mintInk,
            fontSize: Math.round(m.badgeFont * 0.92),
          }}
          className="flex items-center whitespace-nowrap"
        >
          {revenue}
        </span>
      )}
    </span>
  )
}

/** Which channels an automation can reach. Only Email is lit: the free tier has
 *  no SMS or WhatsApp, and that is the upgrade the whole funnel is aiming at. */
const Channels = ({ m }: { m: Metrics }) => (
  <span
    style={{ gap: m.channelGap, fontSize: m.channelFont }}
    className="flex shrink-0 items-center"
  >
    <span style={{ color: '#1B9844', fontWeight: 500 }}>Email</span>
    <span style={{ color: C.body }}>SMS</span>
    <span style={{ color: C.body }}>WhatsApp</span>
  </span>
)

// ─── Pop-up card ─────────────────────────────────────────────────────────────

/**
 * The one generated subscriber pop-up, shown the way the product shows it: a
 * scaled preview floating on a pale-mint stage inside the card.
 *
 * The pop-up itself is drawn rather than screenshotted, for the same reason the
 * automation creatives are — half of it is a campaign photograph.
 */
export const PopupCard = ({ m }: { m: Metrics }) => (
  <div
    style={{
      width: m.popupW || '100%',
      height: m.popupH || undefined,
      padding: m.cardPad,
      background: C.mint,
      borderRadius: R.box,
    }}
    className="flex shrink-0 flex-col"
  >
    <div
      style={{ height: m.previewAreaH, background: '#F2FDF6', borderRadius: R.chip }}
      className="flex shrink-0 items-center justify-center overflow-hidden"
    >
      <PopupPreview m={m} />
    </div>

    <p
      style={{
        marginTop: m.gapCreativeTitle,
        fontSize: m.cardTitle,
        lineHeight: `${m.cardTitleLH}px`,
        fontWeight: 600,
        color: '#262626',
      }}
      className="truncate"
    >
      Sign up for email and phone
    </p>

    <div
      style={{ marginTop: m.gapBodyRow, height: m.cardRowH }}
      className="flex shrink-0 items-center"
    >
      <ActiveBadge revenue="+0 subscribers" m={m} />
    </div>
  </div>
)

const PopupPreview = ({ m }: { m: Metrics }) => {
  const half = Math.round(m.previewW * 0.5)
  const pad = Math.round(m.previewH * 0.075)
  const body = Math.max(4, Math.round(m.previewH * 0.038))

  /** A form row, at the size a preview renders one: a label and a rule. */
  const field = (label: string) => (
    <span className="flex flex-col" style={{ gap: Math.round(pad * 0.25) }}>
      <span style={{ fontSize: body, color: C.muted }}>{label}</span>
      <span style={{ height: Math.round(body * 1.5), border: `1px solid ${C.border}` }} />
    </span>
  )

  return (
    <div
      style={{
        width: m.previewW,
        height: m.previewH,
        background: '#FFFFFF',
        boxShadow: '0 6px 20px rgba(5, 5, 5, 0.12)',
      }}
      className="relative flex shrink-0 overflow-hidden"
    >
      {/* The generated pop-up's own image. Portrait, because a pop-up is not a
          banner: the picture takes a tall half of it rather than a wide strip
          across the top, and the crop it ships at is cut for that. */}
      <div
        style={{
          width: half,
          background: 'linear-gradient(150deg, #C0341F 0%, #7A1A0E 55%, #2A0906 100%)',
        }}
        className="relative flex shrink-0 items-end overflow-hidden"
      >
        <Image
          src="/images/freemium/popup.jpg"
          alt=""
          fill
          quality={80}
          sizes="160px"
          className="object-cover"
        />
        <span
          className="relative"
          style={{ padding: pad, color: '#F6EAD2', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.5))' }}
        >
          <AniaWordmark height={Math.round(body * 2.2)} />
        </span>
      </div>

      <div
        style={{ padding: pad, gap: Math.round(pad * 0.55) }}
        className="flex min-w-0 flex-1 flex-col justify-center"
      >
        <span style={{ fontSize: Math.round(body * 1.25), fontWeight: 700, lineHeight: 1.25 }}>
          ODBIERZ 20 ZŁ RABATU NA ZAKUPY!
        </span>
        <span style={{ fontSize: body, lineHeight: 1.35, color: C.body }}>
          Dołącz do Newslettera i odbierz rabat na zakupy powyżej 200 zł.
        </span>
        {field('Imię')}
        {field('Adres email *')}
        <span
          style={{
            height: Math.round(body * 2.4),
            background: C.ink,
            color: '#FFFFFF',
            fontSize: body,
            letterSpacing: '0.08em',
          }}
          className="flex items-center justify-center"
        >
          DOŁĄCZ
        </span>
      </div>

      <span style={{ top: pad, right: pad }} className="absolute">
        <CloseMark size={Math.round(body * 1.4)} />
      </span>
    </div>
  )
}

// ─── Integrate screen ────────────────────────────────────────────────────────

/**
 * The last step, and the only one that asks the user for anything.
 *
 * An empty state with one action on it: everything above has already been shown
 * working, so this screen has nothing to explain and nothing to configure.
 */
export const IntegrateScreen = ({ connecting, state, m }: {
  /** True from the click until the next screen: the hand-off to Shoper is a
   *  real round trip, and a button that did nothing for a second would read as
   *  a demo that had frozen. */
  connecting: boolean
  state: DemoState
  m: Metrics
}) => {
  const ref = useTarget(INTEGRATE)
  const pressed = state.pressed === INTEGRATE

  return (
    <div className="flex flex-col items-center">
      <LogoPair m={m} />

      <p
        style={{
          marginTop: m.gapLogoHeading,
          fontSize: m.intHeading,
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}
      >
        Integrate with edrone
      </p>
      <p
        style={{
          marginTop: m.gapHeadingSub,
          fontSize: m.intSub,
          lineHeight: `${m.intSubLH}px`,
          color: C.body,
        }}
        className="text-center"
      >
        Integrate your Shoper account with edrone and boost your revenue.
      </p>

      <div style={{ marginTop: m.gapSubChips, gap: m.intChipGap }} className="flex items-center">
        <IntChip icon={<ShieldMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>100% Secure</IntChip>
        <IntChip icon={<ClockMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>2 min</IntChip>
        <IntChip icon={<CodeMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>No tech skills</IntChip>
      </div>

      <div
        ref={ref as React.Ref<HTMLDivElement>}
        style={{
          marginTop: m.gapChipsBtn,
          width: m.intBtnW || '100%',
          height: m.intBtnH,
          gap: 10,
          background: C.yellow,
          // Outlined in its own ink: on an otherwise empty white screen the
          // yellow alone does not tell you where the button ends.
          border: `1px solid ${C.ink}`,
          borderRadius: R.box,
          fontSize: m.intBtnFont,
          fontWeight: 500,
          transform: pressed ? 'scale(0.985)' : 'none',
          transition: 'transform 120ms ease-out',
        }}
        className="flex shrink-0 items-center justify-center"
      >
        {connecting
          ? <Ring size={Math.round(m.intBtnFont * 1.1)} stroke={2} />
          : <LinkMark size={Math.round(m.intBtnFont * 1.05)} />}
        {connecting ? 'Opening Shoper…' : 'Integrate Shoper'}
      </div>

      <span
        style={{
          marginTop: m.gapBtnLink,
          gap: 13,
          color: C.focus,
          fontSize: m.intLinkFont,
          fontWeight: 500,
        }}
        className="flex items-center"
      >
        See how to integrate
        <ExternalMark size={Math.round(m.intLinkFont * 0.95)} />
      </span>
    </div>
  )
}

const IntChip = ({ icon, children, m }: {
  icon: React.ReactNode
  children: React.ReactNode
  m: Metrics
}) => (
  <span
    style={{
      height: m.intChipH,
      padding: `0 ${m.intChipPadX}px`,
      gap: 4,
      background: C.blue,
      color: C.blueInk,
      borderRadius: R.chip,
      fontSize: m.intChipFont,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
    className="flex shrink-0 items-center"
  >
    {icon}
    {children}
  </span>
)

/**
 * The two marks the integration joins, with the link glyph between them.
 *
 * Neither needs a file. Shoper's is traced from the artwork Olaf supplied, and
 * edrone's is three bars in a yellow square — which is not a simplification of
 * the logo, it is what the product itself renders in this tile.
 */
const LogoPair = ({ m }: { m: Metrics }) => {
  const tile: React.CSSProperties = {
    width: m.logoTile,
    height: m.logoTile,
    borderRadius: m.logoRadius,
    boxShadow: '0 3px 12px rgba(5, 5, 5, 0.10)',
  }
  const bar = Math.max(2, Math.round(m.logoTile * 0.075))

  return (
    <div className="flex shrink-0 items-center">
      <span
        style={{ ...tile, background: C.yellow, gap: bar }}
        className="flex flex-col items-center justify-center"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ width: Math.round(m.logoTile * 0.48), height: bar, background: C.ink }}
          />
        ))}
      </span>

      <span
        style={{ width: m.logoLink, marginInline: -Math.round(m.logoLink * 0.18) }}
        className="z-10 flex items-center justify-center"
      >
        <LinkMark size={Math.round(m.logoLink * 0.7)} />
      </span>

      <span
        style={{ ...tile, background: '#FFFFFF' }}
        className="flex items-center justify-center"
      >
        <ShoperMark size={Math.round(m.logoTile * 0.77)} />
      </span>
    </div>
  )
}

// ─── Before the walkthrough, and after it ────────────────────────────────────

/**
 * The screen the account opens on.
 *
 * A user who has just typed their store URL does not land on a dashboard — they
 * land here, for a few seconds, while edrone reads the site and writes the
 * automations, the pop-up and the newsletters. It is the one screen the
 * screenshots could not show and the one that makes the next four make sense:
 * everything the walkthrough hands over was made in this moment, and the user
 * chose none of it.
 */
export const PreparingScreen = ({ items, done, m }: {
  items: string[]
  /** How many have landed. Drives both the ticks and the bar. */
  done: number
  m: Metrics
}) => (
  <div className="flex flex-col items-center" style={{ maxWidth: m.loaderW }}>
    <Ring size={m.loaderRing} stroke={3} />

    <p
      style={{
        marginTop: m.gapRingHeading,
        fontSize: m.intHeading,
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
      }}
    >
      Preparing your content
    </p>
    <p
      style={{
        marginTop: m.gapHeadingSub,
        fontSize: m.intSub,
        lineHeight: `${m.intSubLH}px`,
        color: C.body,
      }}
      className="text-center"
    >
      edrone is reading aniakruk.pl and building the account out of what it finds.
      Nothing to pick, nothing to configure.
    </p>

    <div
      style={{ marginTop: m.gapSubItems, gap: m.loaderItemGap }}
      className="flex flex-col"
    >
      {items.map((item, i) => {
        const pending = i >= done
        return (
          <span
            key={item}
            style={{
              gap: 9,
              fontSize: m.loaderItem,
              color: pending ? C.muted : C.ink,
            }}
            className="flex items-center"
          >
            <CheckMark size={Math.round(m.loaderItem * 0.85)} pending={pending} />
            {item}
          </span>
        )
      })}
    </div>

    <span
      style={{
        marginTop: m.gapItemsBar,
        width: m.loaderBarW || '100%',
        height: m.loaderBarH,
        background: C.violetRing,
        borderRadius: m.loaderBarH,
      }}
      className="block overflow-hidden"
    >
      <span
        className="demo-progress block h-full"
        style={{
          width: `${(done / Math.max(1, items.length)) * 100}%`,
          background: C.violet,
          borderRadius: m.loaderBarH,
        }}
      />
    </span>
  </div>
)

/**
 * And the screen after the store is connected.
 *
 * The vertical-flow diagram above this demo ends on an AHA moment, and until
 * now the last click went nowhere. The hand-off to Shoper's marketplace is not
 * rebuilt — that page is somebody else's design and a reader would learn
 * nothing from it — so the demo shows the button waiting and then the return.
 */
export const ConnectedScreen = ({ m }: { m: Metrics }) => (
  <div className="flex flex-col items-center">
    <span
      style={{
        width: m.loaderRing,
        height: m.loaderRing,
        borderRadius: '50%',
        background: C.mint,
        color: C.mintMark,
      }}
      className="flex shrink-0 items-center justify-center"
    >
      <TickMark size={Math.round(m.loaderRing * 0.5)} />
    </span>

    <p
      style={{
        marginTop: m.gapRingHeading,
        fontSize: m.intHeading,
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
      }}
    >
      Your store is connected
    </p>
    <p
      style={{
        marginTop: m.gapHeadingSub,
        fontSize: m.intSub,
        lineHeight: `${m.intSubLH}px`,
        color: C.body,
      }}
      className="text-center"
    >
      Contacts and products are importing. Your automations start sending today.
    </p>

    <div style={{ marginTop: m.gapSubChips, gap: m.intChipGap }} className="flex items-center">
      <IntChip icon={<TickMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>7 automations live</IntChip>
      <IntChip icon={<TickMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>Pop-up on your site</IntChip>
      <IntChip icon={<TickMark size={Math.round(m.intChipFont * 1.05)} />} m={m}>Sequence scheduled</IntChip>
    </div>
  </div>
)

/**
 * Confetti, thrown out of the tick on the connected screen.
 *
 * A burst rather than a fall. Pieces leave the middle of the screen in every
 * direction, gravity bends the end of each arc downward, and they are gone
 * before the loop restarts. Every vector, spin and duration comes from the
 * piece's own index — not `Math.random()`, because this renders on the server
 * too and a random burst would hydrate into a different one.
 */
export const Confetti = ({ m }: { m: Metrics }) => {
  const colours = [C.yellow, C.violet, C.mintMark, C.blueMark, C.amberMark, C.orangeMark]
  const count = m.mobile ? 48 : 80

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        // An even fan with a co-prime offset, so the pieces do not land in a
        // visible ring or line up into a lattice.
        const angle = (i / count) * Math.PI * 2 + ((i * 7) % 11) * 0.09
        // Far enough that the widest pieces clear the stage: half the stage
        // times a reach that runs to 1, so the burst fills the screen instead
        // of clustering round the middle of it.
        const reach = 0.5 + ((i * 31) % 50) / 100      // 0.50..0.99
        const dx = Math.cos(angle) * m.stageW * 0.52 * reach
        const dy = Math.sin(angle) * m.stageH * 0.66 * reach
        // Gravity on the tail of the arc, light enough that the pieces thrown
        // upwards actually get to be up there before it takes them.
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
              top: '42%',
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

// ─── Coach-mark ──────────────────────────────────────────────────────────────

/** Target key for the coach-mark's Continue button. */
export const CONTINUE = 'continue'
/** Target key for the yellow button that ends the walkthrough. */
export const INTEGRATE = 'integrate'

export interface CoachStep {
  /** Names the part of the app this step is about. */
  label: string
  /** Set bold, and the only part of the card meant to stop you. */
  lead: string
  rest: string
  bullets: string[]
  /**
   * The beat before the walkthrough, when the content does not exist yet.
   *
   * Same card, same place, same size — it just has a bar filling instead of a
   * button, and its bullets tick off as each thing lands. That is the honest
   * shape of this moment: the user has typed a store URL and edrone is writing
   * everything the next four steps go on to show them.
   */
  preparing?: boolean
}

/**
 * The card that drives the whole walkthrough.
 *
 * Its lead paragraph sits in a box four lines tall whatever the copy is, and the
 * copy is centred in it. That is measured off the screenshots, not invented: a
 * two-line step and a four-line step put their bullets and their button on
 * exactly the same pixels, so pressing Continue advances the screen underneath
 * without the card itself moving. Take the fixed box away and the button walks
 * up and down the screen under the cursor between steps.
 *
 * On a phone it stops being a card in a corner and becomes a sheet across the
 * bottom, which is the same move `Drawer` makes in `dashboard-ui.tsx`.
 */
export const CoachMark = ({ step, index, total, done, state, m }: {
  step: CoachStep
  index: number
  total: number
  /** How many of a preparing step's bullets have landed. Ignored otherwise. */
  done?: number
  state: DemoState
  m: Metrics
}) => {
  const ref = useTarget(CONTINUE)
  const pressed = state.pressed === CONTINUE

  // Docked inside the content box rather than the stage: on a desktop the stage
  // is the whole window now, and a card inset from *its* corner would float out
  // over the app's chrome.
  const dock: React.CSSProperties = m.mobile
    ? {
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: `${R.group * 2}px ${R.group * 2}px 0 0`,
      }
    : {
        right: m.coachInset,
        bottom: m.coachInset,
        width: m.coachW,
        borderRadius: R.box,
      }

  return (
    <div
      className="absolute z-20 flex flex-col"
      style={{
        ...dock,
        height: m.coachH,
        padding: m.coachPad,
        background: '#FFFFFF',
        // A halo on the desktop card, a hairline on the phone sheet. The halo is
        // a spread shadow, so on a sheet docked to three edges of the screen it
        // gets clipped on all of them but the top — which reads as a stray band
        // above the sheet rather than as a card lifted off the page.
        border: `1px solid ${m.mobile ? C.violetRing : C.violetTint}`,
        boxShadow: m.mobile
          ? '0 -14px 40px rgba(5, 5, 5, 0.16)'
          : `0 0 0 8px ${C.violetRing}, 0 18px 44px rgba(5, 5, 5, 0.12)`,
      }}
    >
      <div className="flex shrink-0 items-center" style={{ height: m.coachIcon, gap: 9 }}>
        <SparkMark size={m.coachIcon} />
        <span style={{ fontSize: m.coachLabel, fontWeight: 500, color: C.violetInk }}>
          {step.label}
        </span>
        <span style={{ fontSize: m.coachLabel, color: C.violetSoft }}>
          {step.preparing ? 'Setting up' : `${index + 1}/${total}`}
        </span>
        <span className="flex-1" />
        {/* In its own square rather than flush to the edge: the collapse control
            is the one thing here you could press by accident, and the screenshot
            keeps it a chevron's width clear of the corner. */}
        <span
          style={{ width: m.coachIcon }}
          className="flex shrink-0 items-center justify-center"
        >
          <ChevronMark size={Math.round(m.coachIcon * 0.55)} />
        </span>
      </div>

      <div
        style={{
          marginTop: m.gapCoachHeadLead,
          height: m.coachLeadLH * m.coachLines,
          fontSize: m.coachLead,
          lineHeight: `${m.coachLeadLH}px`,
          color: C.bodyLight,
        }}
        className="flex shrink-0 flex-col justify-center"
      >
        <p className="text-pretty">
          <span style={{ fontWeight: 700, color: C.ink }}>{step.lead}</span>{' '}
          {step.rest}
        </p>
      </div>

      <div
        style={{ marginTop: m.gapCoachLeadBullets, gap: m.coachBulletGap }}
        className="flex shrink-0 flex-col"
      >
        {step.bullets.map((bullet, i) => {
          // While preparing, a bullet is a thing still being written until it
          // is not. Unticked ones are set back rather than hidden, so the card
          // says up front how much is coming.
          const pending = step.preparing && i >= (done ?? 0)
          return (
            <span
              key={bullet}
              style={{
                height: m.coachBulletH,
                gap: 8,
                fontSize: m.coachBulletFont,
                color: pending ? C.muted : C.violetInk,
              }}
              className="flex items-center"
            >
              <CheckMark size={m.coachBulletIcon} pending={pending} />
              <span className="truncate">{bullet}</span>
            </span>
          )
        })}
      </div>

      {step.preparing ? (
        <div
          style={{ marginTop: 'auto', height: m.coachBtnH }}
          className="flex shrink-0 flex-col justify-center"
        >
          <span
            // The track is the halo's colour rather than the button's tint: at
            // 6px on white the tint is invisible, and a bar with no track is a
            // line growing rather than a job three-quarters done.
            style={{ height: m.coachBarH, background: C.violetRing, borderRadius: m.coachBarH }}
            className="block w-full overflow-hidden"
          >
            <span
              className="demo-progress block h-full"
              style={{
                width: `${((done ?? 0) / Math.max(1, step.bullets.length)) * 100}%`,
                background: C.violet,
                borderRadius: m.coachBarH,
              }}
            />
          </span>
        </div>
      ) : (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          style={{
            marginTop: 'auto',
            height: m.coachBtnH,
            background: C.violet,
            color: C.violetTint,
            borderRadius: R.box,
            fontSize: m.coachBtnFont,
            fontWeight: 500,
            transform: pressed ? 'scale(0.985)' : 'none',
            transition: 'transform 120ms ease-out',
          }}
          className="flex shrink-0 items-center justify-center"
        >
          Continue
        </div>
      )}
    </div>
  )
}

// ─── Marks ───────────────────────────────────────────────────────────────────
// Drawn rather than shipped as assets, and sized off the metrics so they track
// the layout they sit in.

const SparkMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0">
    <path
      d="M12.4 2.6 14 7.2l4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6L6.2 8.8l4.6-1.6 1.6-4.6Z"
      fill={C.violet}
    />
    <path d="M5.4 12.6 6.3 15l2.4.9-2.4.9-.9 2.4-.9-2.4L2.1 15.9l2.4-.9.9-2.4Z" fill={C.violetSoft} />
    <circle cx="18.4" cy="16.6" r="1.5" fill={C.violetSoft} />
  </svg>
)

const CheckMark = ({ size, pending }: { size: number; pending?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
    {pending
      ? <circle cx="6" cy="6" r="4.9" stroke={C.border} strokeWidth="1.2" />
      : <>
          <circle cx="6" cy="6" r="5.4" fill={C.violet} />
          <path d="m3.7 6.1 1.7 1.7 3-3.4" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </>}
  </svg>
)

const ChevronMark = ({ size }: { size: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 12 7" fill="none" aria-hidden className="shrink-0">
    <path d="m1.2 1.4 4.8 4.2 4.8-4.2" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PlayMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
    <path d="M3.4 2.4 9.6 6l-6.2 3.6V2.4Z" fill="currentColor" />
  </svg>
)

const GridMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
    {[[2.4, 2.4], [9.8, 2.4], [2.4, 9.8], [9.8, 9.8]].map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width="5.8" height="5.8" rx="1.4" fill={C.ink} />
    ))}
  </svg>
)

const TableMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
    <rect x="2.2" y="3" width="13.6" height="12" rx="1.6" stroke={C.body} strokeWidth="1.3" />
    <path d="M2.2 7.2h13.6M7 7.2V15" stroke={C.body} strokeWidth="1.3" />
  </svg>
)

const CloseMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
    <path d="m2.8 2.8 6.4 6.4m0-6.4-6.4 6.4" stroke={C.body} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

/**
 * Shoper's mark, traced from the file Olaf supplied.
 *
 * That file is a 40px PNG and a 69 KB "SVG" that is the same picture at 1549px
 * wrapped in base64 — neither is a vector, and both go soft or heavy at the
 * sizes this renders. The mark is two circles and a fillet, so it is drawn here
 * instead: a bowl (circle at 20,20 r 20, sliced flat at y 10.06 with 2.34 corner
 * fillets) under a disc (20,10 r 10). Fitted to the supplied artwork to better
 * than a pixel on its own 1549px canvas, which is 0.02px at this size.
 */
const ShoperMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden className="shrink-0">
    <path
      d="M4.05 10.06h31.9a2.34 2.34 0 0 1 2.11 1.33 20 20 0 1 1-36.12 0 2.34 2.34 0 0 1 2.11-1.33Z"
      fill="#CCD6FF"
    />
    <circle cx="20" cy="10" r="10" fill="#002EFF" />
  </svg>
)

/** The spinner, drawn as a ring with a violet quarter running round it. */
const Ring = ({ size, stroke }: { size: number; stroke: number }) => (
  <span
    className="demo-spin block shrink-0"
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `${stroke}px solid ${C.violetRing}`,
      borderTopColor: C.violet,
    }}
  />
)

const TickMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="m3.4 8.4 3.1 3.1 6.1-6.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// The application's own furniture. Line marks at 18px, which on the case study
// stage is seven — enough to read as a toolbar, not enough to read as icons.

const stroke = { stroke: C.ink, strokeWidth: 1.5, fill: 'none' } as const

const Frame = ({ size, children }: { size: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className="shrink-0" {...stroke}>
    {children}
  </svg>
)

const PanelMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <rect x="2.2" y="3.2" width="15.6" height="13.6" rx="2.4" />
    <path d="M7.6 3.2v13.6" />
  </Frame>
)

const SearchMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className="shrink-0"
       stroke={C.body} strokeWidth="1.5" fill="none">
    <circle cx="9" cy="9" r="5.6" />
    <path d="m13.4 13.4 3.2 3.2" strokeLinecap="round" />
  </svg>
)

const BellMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <path d="M5.2 8.4a4.8 4.8 0 0 1 9.6 0c0 3.4 1.2 4.6 1.2 4.6H4s1.2-1.2 1.2-4.6Z" strokeLinejoin="round" />
    <path d="M8.4 15.6a1.8 1.8 0 0 0 3.2 0" strokeLinecap="round" />
  </Frame>
)

const ArcMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className="shrink-0"
       stroke={C.focus} strokeWidth="2.2" fill="none" strokeLinecap="round">
    <path d="M10 2.4a7.6 7.6 0 1 1-6.6 3.8" />
  </svg>
)

const BroadcastMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <circle cx="10" cy="10" r="1.8" fill={C.ink} stroke="none" />
    <path d="M6.2 6.2a5.4 5.4 0 0 0 0 7.6M13.8 6.2a5.4 5.4 0 0 1 0 7.6" strokeLinecap="round" />
  </Frame>
)

const ChatMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <path d="M3.4 6.2a2.4 2.4 0 0 1 2.4-2.4h8.4a2.4 2.4 0 0 1 2.4 2.4v5.2a2.4 2.4 0 0 1-2.4 2.4H8l-4.6 3.2V6.2Z" strokeLinejoin="round" />
  </Frame>
)

const EnvelopeMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <rect x="2.6" y="5" width="14.8" height="10.4" rx="2.2" />
    <path d="m3.6 6.6 6.4 4.6 6.4-4.6" strokeLinejoin="round" />
  </Frame>
)

const TreeMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <circle cx="10" cy="4.4" r="2" />
    <circle cx="4.8" cy="15.6" r="2" />
    <circle cx="15.2" cy="15.6" r="2" />
    <path d="M10 6.4v3.2M4.8 13.6v-2a2 2 0 0 1 2-2h6.4a2 2 0 0 1 2 2v2" strokeLinejoin="round" />
  </Frame>
)

const FindMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <path d="M17 10.4V6.2a2.2 2.2 0 0 0-2.2-2.2H5.2A2.2 2.2 0 0 0 3 6.2v7.6A2.2 2.2 0 0 0 5.2 16h4.6" strokeLinecap="round" />
    <circle cx="14" cy="14" r="2.8" />
    <path d="m16.2 16.2 1.4 1.4" strokeLinecap="round" />
  </Frame>
)

const StarMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <path d="m10 3 2.2 4.5 4.9.7-3.5 3.5.8 4.9-4.4-2.3-4.4 2.3.8-4.9L2.9 8.2l4.9-.7L10 3Z" strokeLinejoin="round" />
  </Frame>
)

const GiftMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <rect x="2.8" y="8" width="14.4" height="8.6" rx="1.8" />
    <path d="M2.4 8h15.2M10 8v8.6" />
    <path d="M10 8S8.4 3.4 6.4 3.4a2 2 0 1 0 0 4M10 8s1.6-4.6 3.6-4.6a2 2 0 1 1 0 4" strokeLinejoin="round" />
  </Frame>
)

const PeopleMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <circle cx="8" cy="7" r="2.8" />
    <path d="M2.8 16.4c.6-2.8 2.6-4.2 5.2-4.2s4.6 1.4 5.2 4.2" strokeLinecap="round" />
    <path d="M13.6 5c1.6.4 2.6 1.6 2.6 3.2M15 12.6c1.2.6 1.9 1.8 2.2 3.4" strokeLinecap="round" />
  </Frame>
)

const TrendUpMark = ({ size }: { size: number }) => (
  <Frame size={size}>
    <rect x="2.6" y="3" width="14.8" height="14" rx="2.4" />
    <path d="m6 12.6 3-3.2 2.2 2.2 3-3.4" strokeLinecap="round" strokeLinejoin="round" />
  </Frame>
)

const LinkMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="M6.6 9.4a2.9 2.9 0 0 0 4.3.3l1.9-1.9a2.9 2.9 0 0 0-4.1-4.1l-1 1" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9.4 6.6a2.9 2.9 0 0 0-4.3-.3L3.2 8.2a2.9 2.9 0 0 0 4.1 4.1l1-1" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const ExternalMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <path d="M11 7.6v3.1a1.2 1.2 0 0 1-1.2 1.2H3.3a1.2 1.2 0 0 1-1.2-1.2V4.2A1.2 1.2 0 0 1 3.3 3h3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M8.8 2.2h3v3M11.8 2.2 6.6 7.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShieldMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <path d="M7 1.6 2.6 3.5v3.6c0 2.9 1.9 4.6 4.4 5.3 2.5-.7 4.4-2.4 4.4-5.3V3.5L7 1.6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

const ClockMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 4.2V7l1.9 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CodeMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
    <path d="M5 4.2 2.2 7 5 9.8M9 4.2 11.8 7 9 9.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlusMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="M8 3.2v9.6M3.2 8h9.6" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const ReportMark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <rect x="2.2" y="2.4" width="11.6" height="11.2" rx="2" stroke={C.ink} strokeWidth="1.3" />
    <path d="M5.4 10.4V7.8M8 10.4V5.6M10.6 10.4V8.8" stroke={C.ink} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
