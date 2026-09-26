import type { BreakdownChart } from '@/components/breakdown-chart'

// ─── Process content block types ────────────────────────────────────────────

/** A product screen rebuilt in code. Resolved to a component in components/demos/registry.tsx. */
export type DemoId = 'signup-story-desktop' | 'contacts' | 'freemium'

/** One tile of a `demo-row`: a coded demo (optionally pinned to one screen of
 *  its script), a screenshot, or a customer quote. */
export type DemoRowItem =
  | DemoId
  | { demo: DemoId; step?: number }
  /** `crop` covers the 16:9 frame around a point instead of fitting in it;
   *  `bleed: 'top-left'` runs a crop of the app's corner off those two edges. */
  | { src: string; alt: string; width?: number; height?: number; crop?: string; bleed?: 'top-left' }
  | { quote: string; author: string; href?: string }

export type ProcessBlock =
  | { kind: 'text'; content: string }
  /** A bulleted list, read with the paragraphs around it. */
  | { kind: 'list'; items: string[] }
  /** Blocks folded into a closed `Collapse` box: there for whoever wants them. */
  | { kind: 'collapse'; label: string; blocks: ProcessBlock[] }
  /** The UI after the copy that explains it: full window width, one column on
   *  a phone, two on a tablet, three from lg, every tile a 16:9 frame. */
  | { kind: 'demo-row'; demos: DemoRowItem[] }

// ─── Project interface ───────────────────────────────────────────────────────

/** A badged section. The first one is Context and folds into a closed box at
 *  the foot of the second; the rest read as Problem, Research, Solution. */
export interface ProjectSection {
  badge: string
  blocks: ProcessBlock[]
}

export interface Project {
  slug: string
  title: string
  /** The card headline, one sentence that carries its own accents: rendered
   *  on the home card, under the case study's hero and, stripped of its
   *  accents by `projectSummary`, as the page's SEO, Open Graph, Twitter and
   *  JSON-LD description. There is no separate description to drift from it.
   *  Anything inside `[[ ]]` renders in the accent colour — at most two per sentence,
   *  the second one always the number. Rendered by `CardSentence`. */
  card: {
    text: string
  }
  coverImage: string
  coverImagePosition?: 'bottom-right' | 'center-bottom'
  thumbnailImage: string
  /** When set, a coded demo replaces the cover on the home card and the case
   *  study hero. `coverImage` and `thumbnailImage` stay: the OG image, Twitter
   *  card and JSON-LD still need a real file, and a React component is not one. */
  demo?: DemoId
  sections: ProjectSection[]
  results: {
    /** One paragraph that says what the card does not: when and on what it was
     *  measured, and what it means. */
    summary?: string
    northStar: {
      label: string
      value: string
      /** Beside the number: its before and after, or a short fact backing it. */
      badge?: string
    }
    /** Desktop vs mobile growth, drawn in the north star's card (signup). */
    breakdownChart?: BreakdownChart
    metrics: {
      value: string
      label: string
      badge?: string
      /** A cohort chart: this metric then leads the card with the chart under
       *  it. `label` is the axis tick, `full` the tooltip. */
      chart?: {
        seriesLabel: string
        data: { label: string; full: string; value: number }[]
      }
    }[]
  }
  /** Short paragraphs read under the Outcome card. */
  reflections: string[]
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'freemium-activation',
    title: 'Freemium onboarding',
    card: {
      text: 'Led and designed edrone\'s freemium onboarding, bringing in [[5050 stores in 11 months]] with [[7.8% converting to paid]]',
    },
    coverImage: '/thumbnails/freemium-activation.png',
    thumbnailImage: '/thumbnails/freemium-activation.png',
    demo: 'freemium',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation platform for online stores. It sends automated emails and newsletters that bring shoppers back to buy, for example after they leave a full cart or to nudge them towards their next order.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'A small store had no way into edrone. For ten years every customer was set up by Support\'s onboarding team, and **that cost made small stores not worth acquiring**.',
          },
          {
            kind: 'text',
            content: 'Freemium had to reach them with **nobody doing the setup**, and almost nobody had ever run edrone alone.',
          },
        ],
      },
      {
        badge: 'Research',
        blocks: [
          {
            kind: 'text',
            content: 'Research ran from before launch through the **11 months** after it:',
          },
          {
            kind: 'list',
            items: [
              '**Around 100 user interviews**, run with the 2 freemium specialists on my team, on what stores expect and where they get stuck',
              '**Onboarding team calls and exit calls**, to see what the team set up by hand for every new customer and why stores left',
              '**Session recordings**, to see where stores hesitate or drop off',
              '**Onboarding analytics** I set up myself in **{{amplitude|Amplitude}}**, read alongside **{{tableau|Tableau}}** and **{{vitally|Vitally}}**',
              '**Competitors and other self-serve SaaS**, to see how they onboard new accounts',
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'Every part of freemium went through many iterations, the onboarding most of all.',
          },
          {
            kind: 'collapse',
            label: 'How the onboarding evolved',
            blocks: [
              {
                kind: 'list',
                items: [
                  '**Shop connected to edrone first, then 3 automations switched on in onboarding cards.** Stores clicked "next" without reading, and were angry when emails went out.',
                  '**Shop connected first, then a checklist and walkthrough** for stores to set things up themselves. Most were new to marketing automation and did not see the value.',
                  '**Shop connected first, then live events with suggested tasks**, like "someone just added to cart, turn on abandoned cart". Stores still did not act, and some waited for a call.',
                  '**Everything ready first, shop connected last.** An onboarding widget walks the store through what is already built, and it connects its shop only after its aha moment. **Fewer stores connected**, but those that did knew what they would get, and the share of active stores kept climbing.',
                ],
              },
            ],
          },
          {
            kind: 'text',
            content: 'What shipped:',
          },
          {
            kind: 'list',
            items: [
              '**Freemium, not a trial.** Small stores need time to grow before a paid plan makes sense, and freemium let them stay with us until it did.',
              '**Built from the store\'s URL alone.** AI generates every email ready to send, from layout and images to copy.',
              '**Everything on from the start**, with 7 core automations across channels, a pop-up to grow the customer base, Contacts activation and a widget showing recent purchases.',
              '**1-click shop connection**, which I pushed hard for, since connecting the shop was a major blocker.',
            ],
          },
          {
            kind: 'text',
            content: 'I led it with 2 developers and 2 freemium specialists, and built parts myself in {{codex|Codex}}.',
          },
          {
            // The whole onboarding playing, the customer's words, then the
            // screens it walks through.
            kind: 'demo-row',
            demos: [
              'freemium',
              {
                quote: 'It was love at first sight. As soon as I set it up on your freemium plan, I could use it freely with the small base we had. [\u2026] We moved to the paid plan simply because our base grew. There was never even a moment of asking if it was worth it.',
                author: 'Kuba, co-founder of Malviva, on edrone\'s podcast (translated from Polish)',
                href: 'https://www.youtube.com/watch?v=9c7pFdssDug&t=557s',
              },
              { src: '/images/fm-automations-ready.png', alt: 'Automations built from the store\'s site, ready before it connects', width: 1920, height: 1080 },
              { src: '/images/fm-popup-ready.png', alt: 'A subscriber pop-up, ready before the store connects', width: 1920, height: 1080 },
              { src: '/images/fm-integrate-last.png', alt: 'Connecting the shop, the last onboarding step', width: 1920, height: 1080 },
              { src: '/images/fm-widget-corner.png', alt: 'The onboarding widget, step 2 of 4', width: 2571, height: 1446, bleed: 'top-left' },
            ],
          },
        ],
      },
    ],
    results: {
      summary: 'Ten years of the sales-led model built 2500 paying stores. In 11 months freemium signed up **twice that many stores**, free and paid, with nobody from Support setting them up, and its paying stores **grew the paid base by 16%**. An active store is one with its automations running.',
      northStar: {
        label: 'STORES ACQUIRED',
        value: '5050',
        badge: 'in 11 months',
      },
      metrics: [
        {
          value: '77%',
          label: 'ACTIVE STORES',
          badge: '2.2× since launch',
          chart: {
            seriesLabel: 'ACTIVE STORES',
            data: [
              { label: 'May', full: 'May 2025', value: 44.0 },
              { label: 'Jun', full: 'June 2025', value: 33.6 },
              { label: 'Jul', full: 'July 2025', value: 40.9 },
              { label: 'Aug', full: 'August 2025', value: 23.2 },
              { label: 'Sep', full: 'September 2025', value: 37.0 },
              { label: 'Oct', full: 'October 2025', value: 51.5 },
              { label: 'Nov', full: 'November 2025', value: 56.4 },
              { label: 'Dec', full: 'December 2025', value: 49.9 },
              { label: 'Jan', full: 'January 2026', value: 74.0 },
              { label: 'Feb', full: 'February 2026', value: 77.6 },
              { label: 'Mar', full: 'March 2026', value: 80.3 },
            ],
          },
        },
        { value: '7.8%', label: 'FREE TO PAID', badge: '393 stores' },
      ],
    },
    reflections: [
      'The onboarding ended at the integration. After that, nothing in the app led a store to its next step, only Intercom messages did, and that is the part I would design next.',
    ],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup flow',
    card: {
      text: 'Redesigned the signup form and [[tripled conversion]], delivered with AI in [[5 hours]]',
    },
    coverImage: '/images/sf-cover.png',
    thumbnailImage: '/images/sf-cover.png',
    // The shipped product only, form through Google to success, on the same
    // desktop stage the other cards and heroes use.
    demo: 'signup-story-desktop',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation platform for online stores. It sends automated emails and newsletters that bring shoppers back to buy, for example after they leave a full cart or to nudge them towards their next order.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'Freemium was edrone\'s first product-led channel, and four months in, **acquisition was the focus**. But most people who clicked "Sign up free" left the form without creating an account. Signup conversion sat at 0.75%, **far below the 2 to 5% typical for the industry**.',
          },
        ],
      },
      {
        badge: 'Research',
        blocks: [
          {
            kind: 'text',
            content: 'To find out why people left, I went through the flow three ways:',
          },
          {
            kind: 'list',
            items: [
              'Analyzed the signup flow\'s event data in **{{amplitude|Amplitude}}**',
              'Watched **session recordings** of the form',
              'Ran my self-built **UX Audit Agent** on {{codex|Codex}} through the flow',
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'The research pointed to three changes that could lift conversion:',
          },
          {
            kind: 'list',
            items: [
              '**Removed the phone number input**, after Sales confirmed it was worth little.',
              '**Made Google and Shopify sign-in create the account**, instead of only filling in the form.',
              '**Split the form into two steps**, with the account first and the shop\'s name and URL after. It adds a step, but it lets SSO work without asking for the URL first.',
            ],
          },
          {
            kind: 'text',
            content: "I built the frontend in **{{codex|Codex}}** and shipped **the new signup flow in 5 hours**.",
          },
          {
            // The shipped flow playing, then its two steps.
            kind: 'demo-row',
            demos: [
              'signup-story-desktop',
              { src: '/images/su-step-account.png', alt: 'Step 1: create the account with email, Google or Shopify', width: 1920, height: 1400, crop: '50% 50%' },
              { src: '/images/su-step-shop.png', alt: 'Step 2: the shop\'s name and URL, after the account exists', width: 1920, height: 1400, crop: '50% 50%' },
            ],
          },
        ],
      },
    ],
    results: {
      summary: 'After 3 weeks of live traffic, signup conversion had tripled. The biggest jump was on mobile, which went from almost no signups to converting better than desktop.',
      northStar: {
        label: 'TOTAL CONVERSION',
        value: '+200%',
      },
      // The +200% north star is the independently-measured total
      // (0.75% → 2.25%), not something the chart below has to derive on
      // its own. `share` here is picked so the chart's own blend lands on
      // that same +200% (desktop and mobile as component facts, not a
      // recomputation) — it's a looser fit than the "about 85%" in the
      // note above, which is Olaf's own prose and stays as written.
      breakdownChart: {
        channels: [
          { key: 'desktop', label: 'Desktop', share: 0.75 },
          { key: 'mobile', label: 'Mobile', share: 0.25 },
        ],
        before: { desktop: 1, mobile: 0.05 },
        after: { desktop: 2, mobile: 3 },
        total: { before: 0.75, after: 2.25 },
      },
      metrics: [],
    },
    reflections: [
      'Shipping three changes in one release made it hard to tell which one moved the number. With more time I would have shipped them separately.',
      'To hedge, I added extra tracking in {{amplitude|Amplitude}}. It clearly confirmed the split, as **the share of visitors who began filling the form went from 2.7% to 10%**.',
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts identification',
    card: {
      text: "Designed a new feature that made [[32% more contacts reachable]] by automations, delivered with AI in [[6 days]]",
    },
    coverImage: '/images/ci-cover.png',
    thumbnailImage: '/images/ci-thumbnail.png',
    demo: 'contacts',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation platform for online stores. It sends automated emails and newsletters that bring shoppers back to buy, for example after they leave a full cart or to nudge them towards their next order.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'Stores pay edrone for their whole contact base, but automations, which bring half the revenue they get from edrone, **reached only 3.1% of it**.',
          },
          {
            kind: 'text',
            content: 'An automation can only reach a contact identified by a cookie, and nothing in the product helped a store raise that. Stores saw little return for what they paid, and **churn was rising**.',
          },
        ],
      },
      {
        badge: 'Research',
        blocks: [
          {
            kind: 'text',
            content: 'To understand what drives identification and how stores see it, I went five ways:',
          },
          {
            kind: 'list',
            items: [
              'Ran **6 user interviews** to test my hypothesis that most stores did not know identification existed',
              'Ran **internal research** with the **Support Team** on how they were already dealing with it',
              'Checked the data in **{{tableau|Tableau}}** and compared **store cohorts** to see what affects identification',
              'Reviewed whether and how **competitors** handle identification',
              'Researched **technical ways to raise identification** and talked them through with **developers**',
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'Support was already raising identification by emailing a store\'s whole base, and the research pointed the same way, since more opened emails mean more identified contacts. I turned that into **Contacts activation**, the first step of a larger area for activating a store\'s base, built around an automated email sequence:',
          },
          {
            kind: 'list',
            items: [
              '**Branded as the store and sent automatically**, with every email generated by AI.',
              '**Multiple different emails**, so a monthly send keeps getting opened.',
              '**A 30-day cycle**, because cookies clear on their own within about 30 days.',
              '**Neutral content**, not marketing, so it can go to the whole base.',
            ],
          },
          {
            kind: 'text',
            content: 'On the dashboard it is a module with **a preview of every email**, its sending details and its performance. The interviews showed some stores did not get identification, so it also has a short **How it works** section.',
          },
          {
            kind: 'text',
            content: 'Most importantly, **it is on by default**, shown in onboarding as already running, since stores would never look for a feature they did not understand.',
          },
          {
            kind: 'text',
            content: 'With one backend developer and {{codex|Codex}}, we shipped the feature in **6 days**.',
          },
          {
            // The screen playing, the sequences, then one email previewed.
            kind: 'demo-row',
            demos: [
              'contacts',
              { src: '/images/ci-sequences.png', alt: 'Contacts activation with the identification sequence running', width: 1920, height: 1080 },
              { src: '/images/ci-email-preview.png', alt: 'One email of the sequence in the preview drawer', width: 1920, height: 1080 },
            ],
          },
        ],
      },
    ],
    results: {
      summary: 'In the first 2 months after release, **902 new stores** got it by default (about 12% of all stores). Their automations now reach a third more of the base they pay for, which could mean **around 15% more revenue** from edrone.',
      northStar: {
        label: 'IDENTIFICATION RATE',
        value: '+32%',
        badge: '3.1% → 4.1%',
      },
      metrics: [
        { value: '95%', label: 'ADOPTION', badge: '860 of 902 kept it on' },
      ],
    },
    reflections: [
      'The first version emailed the whole base every cycle, including contacts already identified that month, which wastes sends and hurts deliverability. Skipping anyone who opened an email in the last 30 days would have fixed it, but there was no room for that before launch.',
    ],
  },
  {
    slug: 'plo-genius',
    title: 'PLO Genius',
    card: {
      text: 'Designed the first PLO solver in a browser as its sole designer, still live [[four years on]] with [[120+ paying subscribers]]',
    },
    coverImage: '/images/plo-cover.png',
    coverImagePosition: 'center-bottom',
    thumbnailImage: '/images/plo-cover.png',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'PLO Genius is a Pot-Limit Omaha solver and GTO trainer that runs in a browser. Its sister product Deepsolver had already proven a neural-net cloud solver for No-Limit Hold\u2019em.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'Studying Pot-Limit Omaha with a solver meant buying a **$5000+ PC to run MonkerSolver**, so most players studied without one.',
          },
          {
            kind: 'text',
            content: 'And a solver answers with a matrix of frequencies. **The players who needed it most could not read it.** The engine was proven, so the open question was the interface.',
          },
        ],
      },
      {
        badge: 'Research',
        blocks: [
          {
            kind: 'text',
            content: 'I was designing a learning tool for a game I did not play, so I learned it through players:',
          },
          {
            kind: 'list',
            items: [
              '**Beginners and pros**, who showed the gap. Beginners could not say what they needed, and pros played on intuition',
              '**Leads of poker stables**, who teach players at every level, as my main collaborators',
              '**Every new screen validated with a stable lead**, to find what confused, what held and where a screen asked too much',
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'I broke the solver\u2019s matrix into 3 surfaces, each answering one question a player actually asks:',
          },
          {
            kind: 'list',
            items: [
              '**Preflop**, for "what should I play here", with range charts across stack sizes, positions and rake.',
              '**Postflop**, for "how does my hand do on this board", with equity visuals in place of the matrix.',
              '**GTO Trainer**, for practice, with up to 4 tables tuned to feel like a real session and no custom bets, so the drill stays on correct play.',
            ],
          },
          {
            kind: 'text',
            content: 'Most importantly, **I treated the interface as the product**. With no onboarding team, every screen had to teach on its own, and the marketing site led with the player\u2019s question, not the engine.',
          },
          {
            kind: 'text',
            content: 'I designed it alone over **10 months**, from research to the design system, while engineers owned the engine.',
          },
          {
            kind: 'demo-row',
            demos: [
              { src: '/images/plo-preflop.png', alt: 'Preflop range charts' },
              { src: '/images/plo-postflop.png', alt: 'Postflop equity view' },
              { src: '/images/plo-trainer.png', alt: 'GTO Trainer tables' },
            ],
          },
        ],
      },
    ],
    results: {
      summary: 'The app is still live four years later, and the engine behind it is licensed to other platforms, which became the main revenue channel.',
      northStar: {
        label: 'PAYING SUBSCRIBERS',
        value: '120+',
      },
      metrics: [
        { value: '10+', label: 'B2B API CLIENTS' },
      ],
    },
    reflections: [
      'The engine sold better than the app around it, with 10 platforms licensing the API against 120 subscribers. Knowing that, I would have designed the app as the demo for the API.',
      'Nothing in the product let players teach each other. A trainer where a stable lead sets drills would have grown through the groups already teaching PLO by hand.',
    ],
  },
]

/** The card sentence as plain text, for metadata. */
export function projectSummary(project: Project): string {
  return project.card.text.replace(/\[\[|\]\]/g, '')
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getProjectNavigation(slug: string): {
  prev: Project
  next: Project
} {
  const index = projects.findIndex((p) => p.slug === slug)
  const total = projects.length
  return {
    prev: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total],
  }
}
