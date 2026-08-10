'use client'

import {
  Dashboard, IDENTIFICATION_STEPS, IDENTIFICATION_TILES, IdentificationPanel, SectionTitle,
  TileRow, Title,
} from '@/components/demos/dashboard-ui'
import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import { C, TYPEFACE } from '@/components/demos/edrone-tokens'
import {
  Action, AppFrame, AutomationCard, type AutomationData, CardGrid, CoachMark, type CoachStep,
  Confetti, ConnectedScreen, CONTINUE, GRID, INTEGRATE, IntegrateScreen, type Metrics, metricsFor,
  Page, PageHeader, PlusMark, PopupCard, PreparingScreen, ReportMark, TabRow,
} from '@/components/demos/freemium-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * Freemium onboarding, as the four steps of one guided walkthrough.
 *
 * The case study used to illustrate this with four screenshots in a slideshow,
 * which is the one form that hides what they are: not four screens, but one
 * coach-mark pressing Continue four times. The order is the argument — content
 * generated, subscribers collecting, contacts activating, and only then a store
 * to connect — and a reader clicking a slideshow through it is doing the
 * product's job for it. Here the demo presses Continue, and the last click is
 * the one the whole funnel exists for.
 *
 * It opens on the beat the screenshots could not show — a few seconds of edrone
 * reading the store and writing everything the walkthrough then hands over — and
 * it closes on the one the funnel is for: the store connects, and the free
 * account starts working. Between them is the argument the Solution makes.
 *
 * Every number on it is zero. This is a brand new account: the automations are
 * on, the sequence is scheduled and the pop-up is live, but none of them has
 * earned anything yet, and a demo that opened on someone else's revenue would be
 * showing the wrong thing entirely.
 *
 * Rebuilt from freemiumgif1-4.png, which now live only in git history (see the
 * commit that deleted them). Step 3 is not rebuilt at all: it is the contacts
 * screen from `dashboard-ui.tsx`, on a stage of exactly the same size.
 */

// ─── Screens ─────────────────────────────────────────────────────────────────

const AUTOMATIONS_SCREEN = 0
const POPUPS = 1
const CONTACTS = 2
const INTEGRATE_SCREEN = 3
/** Neither of these is one of the four steps, and both sit past them so that
 *  `restState` — the poster, which has to be a finished screen — stays at 0. */
const PREPARING = 4
const CONNECTED = 5

// ─── Step 1: Automations ─────────────────────────────────────────────────────

/** What a fresh account has earned. Every card says it, so it is written once. */
const NO_REVENUE = '+0,00 zł'

/**
 * Seven automations, all on.
 *
 * Four of them are the ones the screenshot shows above the fold. The other three
 * are named from edrone's own set — the second row is cut off by the bottom of
 * the screen at this height, exactly as it is in the export, and finishing it is
 * what the small scroll on this step is for.
 */
export const AUTOMATIONS: AutomationData[] = [
  {
    title: 'Restore customers',
    body: 'Keep your past customers coming back with personalized remarketing campaigns that remind them what they liked.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/restore.jpg',
      from: '#4A2C1C', to: '#140A06', ink: '#D7F26E',
      lines: ['-40% NA CO', 'DRUGĄ SZTUKĘ'],
      heading: 'Wracamy z czymś dla Ciebie', body: 'Druga sztuka 40% taniej — na wszystko, co ostatnio oglądałaś w naszym sklepie.', cta: 'ZOBACZ WYBÓR',
    },
  },
  {
    title: 'Recover abandoned carts',
    body: 'Automated reminders for customers who left items in their cart.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/cart.jpg', from: '#4A4E57', to: '#1C1F25', ink: '#F2F2EE',
      heading: 'Twój koszyk czeka', body: 'Zostawiłaś w nim kilka rzeczy. Trzymamy je dla Ciebie jeszcze przez 48 godzin.', cta: 'DOKOŃCZ ZAKUPY' },
  },
  {
    title: 'Personalized product recommendations',
    body: 'Suggest relevant items based on browsing history and past purchases.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/recommendations.jpg', from: '#254842', to: '#0B1A18', ink: '#D7F26E',
      heading: 'Wybrane dla Ciebie', body: 'Wybraliśmy je na podstawie tego, co ostatnio oglądałaś i kupowałaś u nas.', cta: 'ZOBACZ POLECANE' },
  },
  {
    title: 'Boost loyalty',
    body: 'Reward loyal customers with special perks and tailored offers.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/loyalty.jpg',
      from: '#2A5C64', to: '#123036', ink: '#D7F26E',
      eyebrow: "Women's day", lines: ['-20%', 'OD 200 ZŁ'], note: 'z kodem BOLDER',
      heading: 'Dzień Kobiet w ANIA KRUK', body: 'Z okazji Dnia Kobiet -20% przy zakupach od 200 zł. Wpisz kod BOLDER przy kasie.', cta: 'ODBIERZ RABAT',
    },
  },
  {
    title: 'Win back inactive customers',
    body: 'Reach customers who have not opened anything in a while, before they go quiet for good.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/winback.jpg',
      from: '#B4441C', to: '#5A1D0A', ink: '#FFE9C7',
      lines: ['-20% NA BIŻUTERIĘ', 'ZE ZŁOTA'], note: 'Tylko do niedzieli!',
      heading: 'Dawno Cię tu nie było', body: 'Wróć po coś dla siebie: -20% na całą biżuterię ze złota, tylko do niedzieli.', cta: 'WRÓĆ DO NAS',
    },
  },
  {
    title: 'Welcome new subscribers',
    body: 'Introduce your store to everyone who has just joined your list.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/welcome.jpg',
      from: '#3F6BBE', to: '#16306A', ink: '#FFFFFF',
      heading: 'Miło Cię tu widzieć', body: 'Na dobry początek -20% przy zakupach od 200 zł. Kod znajdziesz poniżej.', cta: 'ODBIERZ KOD',
    },
  },
  {
    title: 'Celebrate birthdays',
    body: 'Send a birthday message with an offer worth opening.',
    revenue: NO_REVENUE,
    art: {
      photo: '/images/freemium/birthday.jpg', from: '#5B2A55', to: '#200E20', ink: '#F2D7EE', lines: ['-15%', 'NA URODZINY'],
      heading: 'Wszystkiego najlepszego!', body: 'Mamy dla Ciebie -15% na wszystko. Prezent jest ważny przez cały tydzień.', cta: 'ODBIERZ PREZENT' },
  },
]

/**
 * Step 3's tiles, on an account that is minutes old.
 *
 * Derived from the contacts demo's rather than restated, so the labels, units
 * and decimal places cannot drift apart — only the values are dropped, which is
 * the one thing that genuinely differs between a case study about the feature
 * and a walkthrough of a fresh signup.
 */
const EMPTY_TILES = IDENTIFICATION_TILES.map((tile) => ({ ...tile, value: 0, delta: '0%' }))

/**
 * And its schedule, on the same account.
 *
 * The contacts case study shows the sequence mid-flight, with the first mail
 * already gone. Here nothing has gone anywhere: the account is minutes old, so
 * the whole sequence is still ahead of it — the first send three days out, and
 * every one after it thirty days behind the last.
 */
const EMPTY_SCHEDULE = IDENTIFICATION_STEPS.map((step, i) => ({
  ...step,
  status: `Send in ${3 + i * 30} days`,
}))

// ─── The walkthrough ─────────────────────────────────────────────────────────

/**
 * What the coach-mark says, in the words the product used.
 *
 * The label changes with the screen. The screenshots read "Automations" on all
 * four, which is a widget titled after the step it was first written for rather
 * than a decision — on the Integrate screen it is simply wrong, and the demo has
 * no reason to reproduce a stale string.
 */
const STEPS: CoachStep[] = [
  {
    label: 'Automations',
    lead: 'Your automations are ready.',
    rest: "We've prepared key automations matched to your branding.",
    bullets: [
      '7 ready-to-earn automations',
      'Messages tailored to your shop',
      'Start right after store integration',
    ],
  },
  {
    label: 'Pop-ups',
    lead: 'Subscriber pop-up is ready.',
    rest: 'Collect subscribers effectively in a way that does not interrupt your customers’ purchase journey.',
    bullets: [
      'Quickly build your e-mail, SMS, and WhatsApp base',
      'Works without disrupting customer purchases',
      'Visible on your website after integration',
    ],
  },
  {
    label: 'Contacts',
    lead: 'Activate your contacts and grow your identified base,',
    rest: 'so edrone can recognize your customers on your store website and personalize their experience.',
    bullets: [
      'Automatic identification sequence for your contacts',
      'The foundation of personalized communication',
      'Grow identification to boost automation revenue',
    ],
  },
  {
    label: 'Integration',
    lead: 'Connect your store and start earning.',
    rest: 'This is the last step to start earning from the traffic you have already built and unlock the full capabilities of edrone.',
    bullets: [
      'Easy integration in 3 minutes',
      'Automatic import of contacts and products',
      'Unlocked live activity preview of customers',
    ],
  },
]

/**
 * What the setup screen ticks off, in the order edrone actually does it.
 *
 * This is the whole of account creation, which is the case study's claim in
 * miniature: the user typed a URL, and everything the next four screens hand
 * them was read off their own site and written for them in the time it takes to
 * watch this list finish.
 *
 * Each line is now a caption under the thing it produced rather than a status
 * message on its own. The first one used to open "Reading aniakruk.pl —", which
 * was the only interesting fact on the screen and was spending it as the fourth
 * word of a grey status line; the address is the headline now, so repeating it
 * here would be saying it twice.
 */
export const SETUP_ITEMS = [
  'Reading the store',
  'Writing the content',
  'Fitting the copy',
  'Account ready',
]

/** The field the script counts finished setup items into. */
const READY = 'ready'
/** And the one it flips while the hand-off to Shoper is in flight. */
const CONNECTING = 'connecting'

/** How long each screen holds before the cursor sets off for Continue. Long
 *  enough to read the bold lead, which is all any of these steps asks of you. */
const READ_MS = 2200

const SCRIPT: Step[] = [
  // The account is minutes old and the content does not exist yet. The four
  // things above land in turn; the bar under them fills as they do.
  { kind: 'screen', index: PREPARING },
  // Short. The frame this opens on is four empty tiles, and holding it is the
  // one moment in the beat with nothing to look at.
  { kind: 'wait',   ms: 380 },
  // A fast pass. The same seven stages get 1500ms each in `freemium-setup-demo`,
  // where they are the subject; here they are the doorway into four screens
  // that are, and a reader made to wait ten seconds for the first one leaves.
  ...SETUP_ITEMS.flatMap((_, i): Step[] => [
    { kind: 'set',  field: READY, text: String(i + 1) },
    { kind: 'wait', ms: 420 },
  ]),
  { kind: 'wait',   ms: 400 },

  // Everything above is now real.
  { kind: 'screen', index: AUTOMATIONS_SCREEN },
  { kind: 'wait',   ms: 1300 },

  // Down into the cards to finish the second row, then back up to the button.
  // The grid follows the pointer down and eases back on its own once it leaves,
  // so the rest of the walkthrough runs without the page moving again.
  { kind: 'move',   target: GRID },
  { kind: 'wait',   ms: 1700 },

  // Three presses of Continue, each advancing the screen under the card. The
  // click travels first — the engine handles that — so the pointer is always on
  // the button before anything moves.
  ...[POPUPS, CONTACTS, INTEGRATE_SCREEN].flatMap((index): Step[] => [
    { kind: 'click',  target: CONTINUE },
    { kind: 'screen', index },
    { kind: 'wait',   ms: READ_MS },
  ]),

  // The one click that is not Continue. Everything above this is the product
  // showing what it has already done; this is the first thing it asks for, and
  // it is the last thing in the flow rather than the first.
  { kind: 'click', target: INTEGRATE },
  { kind: 'set',   field: CONNECTING, text: '1' },
  { kind: 'wait',  ms: 850 },
  { kind: 'screen', index: CONNECTED },
  { kind: 'wait',  ms: 2600 },
]

/**
 * The poster: Automations with the coach-mark on 1/4.
 *
 * The busiest of the four and the one that says "your automations are ready",
 * which makes it both the best still for a card and an honest summary of what
 * pressing play would show. Shown at rest, off screen, and under reduced motion
 * — none of which should open on a progress bar that will never finish.
 */
const REST: Partial<DemoState> = { screen: AUTOMATIONS_SCREEN }

export function FreemiumDemo(props: DemoProps) {
  return (
    <DemoFrame script={SCRIPT} restState={REST} metrics={metricsFor} ink={C.ink} typeface={TYPEFACE} holdLastFrame {...props}>
      {(state, m) => {
        // The card belongs to the walkthrough, and the two screens either side
        // of it are not part of the walkthrough.
        const step = STEPS[state.screen]

        // Setting up happens before there is an application to be inside: the
        // account exists, the content does not, and the app only assembles once
        // it does. So that one beat fills the window and the rest sit in the
        // product's own chrome.
        if (state.screen === PREPARING) {
          return (
            <div
              className="demo-screen-in flex h-full w-full items-center justify-center bg-white"
              style={{ padding: `0 ${m.padX}px` }}
            >
              <PreparingScreen
                items={SETUP_ITEMS}
                art={AUTOMATIONS.map((a) => a.art)}
                // Pinned, the script never runs and never counts, so the honest
                // still of this beat is the one where it has finished. Reading
                // the counter would draw four empty tiles and claim that is
                // what the screen looks like.
                done={state.pinned ? SETUP_ITEMS.length : Number(state.values[READY] ?? 0)}
                m={m}
              />
            </div>
          )
        }

        return (
          <>
            <AppFrame m={m}>
              {/* Keyed so `demo-screen-in` replays on every advance. Only the
                  screen is keyed: the chrome around it and the coach-mark over
                  it sit outside, and neither is remounted — which is what keeps
                  the card from fading and shifting with the page it is talking
                  about. */}
              <div key={state.screen} className="h-full w-full">
                {state.screen === AUTOMATIONS_SCREEN && <Automations state={state} m={m} />}
                {state.screen === POPUPS && <Popups m={m} />}
                {state.screen === CONTACTS && <Contacts state={state} m={m} />}
                {state.screen === INTEGRATE_SCREEN && (
                  <Integrate connecting={state.values[CONNECTING] === '1'} state={state} m={m} />
                )}
                {state.screen === CONNECTED && (
                  <Page m={m} centre>
                    <ConnectedScreen m={m} />
                  </Page>
                )}
              </div>

              {step && (
                <CoachMark
                  step={step}
                  index={state.screen}
                  total={STEPS.length}
                  state={state}
                  m={m}
                />
              )}
            </AppFrame>

            {/* Over the whole window, chrome included: the store connecting is
                the application's news, not one screen's. */}
            {state.screen === CONNECTED && <Confetti m={m} />}
          </>
        )
      }}
    </DemoFrame>
  )
}

// ─── The screens ─────────────────────────────────────────────────────────────

const TABS = [
  { label: 'All', count: 17 },
  { label: 'Active', count: 7 },
  { label: 'Inactive', count: 10 },
]

const Automations = ({ state, m }: { state: DemoState; m: Metrics }) => (
  <Page m={m}>
    <PageHeader title="Automations" m={m} />
    <TabRow m={m} style={{ marginTop: m.gapHeaderTabs }} toggleRight tabs={TABS} />
    <CardGrid lifted={state.cursor === GRID} m={m} style={{ marginTop: m.gapTabsGrid }}>
      {AUTOMATIONS.map((a) => <AutomationCard key={a.title} data={a} m={m} />)}
    </CardGrid>
  </Page>
)

const Popups = ({ m }: { m: Metrics }) => (
  <Page m={m}>
    <PageHeader
      title="Pop-ups"
      m={m}
      actions={
        <span style={{ gap: m.actionGap }} className="flex items-center">
          {/* A phone header holds one action, and it is not the one that opens a
              report. The desktop keeps both, as the product does. */}
          {!m.mobile && (
            <Action tone="plain" icon={<ReportMark size={Math.round(m.actionFont * 1.05)} />} m={m}>
              Reports
            </Action>
          )}
          <Action tone="yellow" icon={<PlusMark size={Math.round(m.actionFont * 1.05)} />} m={m}>
            New pop-up
          </Action>
        </span>
      }
    />
    <TabRow
      m={m}
      style={{ marginTop: m.gapHeaderTabs }}
      tabs={[{ label: 'All', count: 1 }, { label: 'Active', count: 1 }]}
    />
    <div style={{ marginTop: m.gapTabsGrid }} className="flex shrink-0">
      <PopupCard m={m} />
    </div>
  </Page>
)

/**
 * Step 3, which is not built here.
 *
 * `dashboard-ui.tsx` renders the contacts screen for its own case study, and the
 * freemium walkthrough passes through the same screen on the way to integration.
 * One sequence rather than the two the contacts demo shows: this is a fresh
 * account, and the second sequence is also the half of the screen the coach-mark
 * would be sitting on.
 */
const Contacts = ({ state, m }: { state: DemoState; m: Metrics }) => (
  <Dashboard m={m.dash}>
    <Title m={m.dash}>Contacts activation</Title>
    <TileRow
      tiles={EMPTY_TILES}
      run={state.run}
      m={m.dash}
      style={{ marginTop: m.dash.gapTitleTiles }}
    />
    <SectionTitle m={m.dash} style={{ marginTop: m.dash.gapTilesSection }}>Sequences</SectionTitle>
    <IdentificationPanel
      steps={EMPTY_SCHEDULE}
      state={state}
      m={m.dash}
      style={{ marginTop: m.dash.gapSectionPanel }}
    />
  </Dashboard>
)

const Integrate = ({ connecting, state, m }: {
  connecting: boolean
  state: DemoState
  m: Metrics
}) => (
  <Page m={m} centre sheetBelow>
    <IntegrateScreen connecting={connecting} state={state} m={m} />
  </Page>
)
