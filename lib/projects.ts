import type { BreakdownChart } from '@/components/breakdown-chart'

// ─── Process content block types ────────────────────────────────────────────

/** A product screen rebuilt in code. Resolved to a component in components/demos/registry.tsx. */
export type DemoId =
  | 'signup-story'
  | 'signup-story-phone' | 'signup-story-google' | 'signup-story-split' | 'signup-story-split-arrive' | 'signup-story-fixed'
  | 'contacts' | 'freemium' | 'freemium-setup'

/** One side of a comparison: either a screenshot or a coded demo. `step` only
 *  does anything on a `demo` side — it freezes that demo on one screen of its
 *  script, the same way the standalone `demo` block's `step` does. Omit it
 *  and a demo side plays live instead, the same as the standalone block. */
export type CompareSide = {
  label: string
  step?: number
  /** Extra values frozen alongside `step`, the same way `DemoFrame`'s own
   *  `pinnedValues` works — for a side that needs more than just a screen
   *  index to show the right frame (e.g. a form with a field already gone). */
  pinnedValues?: Record<string, string>
} & ({ src: string } | { demo: DemoId })

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'compare'; before: CompareSide; after: CompareSide; caption?: string }
  /** Copy beside a pair of screens stacked one over the other: the paragraphs
   *  in the text column, each screen under its own heading with the point of
   *  that version in text under it. */
  | { kind: 'split'; text: string[]; sides: ({ text: string } & CompareSide)[]; caption?: string }
  | { kind: 'contact-flow'; caption?: string }
  /** `title` is optional: omit it and the card is one paragraph, with bold
   *  carrying the emphasis a heading would have carried. */
  | { kind: 'decisions'; items: { num: string; title?: string; description: string }[] }
  | { kind: 'slideshow'; images: string[]; caption?: string }
  /** `step` holds the demo still on one screen of its script, by that script's
   *  `screen` index, so the same demo can sit beside three different paragraphs
   *  with each one showing what its paragraph is about. Leave it off and the
   *  demo plays while it is on screen. Only one per page should be left
   *  playing: two moving pictures in one column compete rather than read. */
  | { kind: 'demo'; demo: DemoId; step?: number; caption?: string }
  /** Two demos side by side in one card, no per-side caption — each side is
   *  its own `Omit<CompareSide, 'label'>`, so one can play live while the
   *  other holds a pinned frame (or both can do either). `text`, if given,
   *  sits inside the same card above the two screens, rather than as its own
   *  block before it — one visual unit, not a paragraph then a separate card. */
  | {
      kind: 'demo-pair'
      text?: string[]
      left: { step?: number; pinnedValues?: Record<string, string> } & ({ src: string } | { demo: DemoId })
      right: { step?: number; pinnedValues?: Record<string, string> } & ({ src: string } | { demo: DemoId })
      caption?: string
    }
  /** Two plain screenshots side by side, one row, no demo machinery — the
   *  process evidence a coded demo can't stand in for (a third-party tool's
   *  own UI, e.g. an analytics dashboard or a session recorder). */
  | { kind: 'image-pair'; left: { src: string; alt?: string }; right: { src: string; alt?: string }; caption?: string }

// ─── Project interface ───────────────────────────────────────────────────────

/** A badged section rendered between the header and Impact. Add as many as the
 *  story needs — the badge is the label shown above the blocks. */
export interface ProjectSection {
  badge: string
  blocks: ProcessBlock[]
}

export interface Project {
  slug: string
  title: string
  /** The one shared one-liner for the project: rendered on the home card,
   *  under the header of the case study, and in its SEO, Open Graph, Twitter
   *  and JSON-LD metadata. There is no separate tagline to drift from it. */
  description: string
  /** The card headline, composed as one sentence: the scrambled lead runs into
   *  an accent number with its eyebrow label, all inline. */
  card: {
    lead: string
    number: string
    label: string
    tail?: string
  }
  metrics: {
    value: string
    label: string
    color?: 'accent' | 'ink'
  }[]
  /** The 30-second skim under the case-study header: Problem, Solution,
   *  Result, one line each. Rendered outside the section rail. */
  tldr: {
    problem: string
    solution: string
    result: string
  }
  meta: {
    company: string
    domain: string
    role: string
    team: string
    duration: string
    /**
     * One sentence: what was mine and what was somebody else's.
     *
     * No bold, ever. Bold marks the insight or the number; bolding your own
     * role is the thing that rule exists to stop.
     */
    myRole: string
    /** The shipped product, linked from the header. Prototypes have none. */
    live?: { label: string; url: string }
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
    /** One paragraph of what happened, read before the metric cards. */
    summary?: string
    note?: string
    northStar?: {
      label: string
      value: string
    }
    /** A stacked-bar breakdown shown beside the north star in the same card —
     *  e.g. desktop vs mobile, before vs after — rather than as more
     *  `MetricMain` cards stacked below it. Only renders that composite
     *  layout when both this and `northStar` are set; every project without
     *  one keeps today's stacked cards untouched. */
    breakdownChart?: BreakdownChart
    metrics: {
      value: string
      label: string
      description?: string
      color?: 'accent' | 'ink'
      /** Drawn inside this metric's card, under its number. One bar per cohort,
       *  and a metric that carries a chart is rendered full-width.
       *  `label` is the axis tick, kept short; `full` is what the tooltip says,
       *  where there is room to spell it out. */
      chart?: {
        seriesLabel: string
        data: { label: string; full: string; value: number }[]
      }
    }[]
  }
  /** Rendered as plain paragraphs under a Reflections badge. */
  reflections: string[]
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'freemium-activation',
    title: 'Freemium launch',
    description: "Freemium, edrone's first product-led channel after a decade of sales-led growth.",
    card: {
      lead: 'Opened edrone to self-serve after ten years of sales-led growth, reaching',
      number: '5,050',
      label: 'stores in 11 months',
      tail: 'with 7.8% converting to paid',
    },
    metrics: [
      { value: '5,050', label: 'STORES ACQUIRED', color: 'accent' },
    ],
    tldr: {
      problem: 'For ten years every customer was set up by a person, so the stores that could not pay for a person were never worth acquiring. Almost nobody had ever run edrone alone.',
      solution: 'I rebuilt the entry so a store sets itself up in minutes: nothing is asked, seven automations are already running, and the one ask lands at the end.',
      result: '5,050 stores in under a year, 393 of them paying, adding 16% to a base built over ten years.',
    },
    meta: {
      company: 'edrone',
      domain: 'Marketing automation for ecommerce',
      role: 'Sr Product Designer & Team Lead',
      team: '2 developers, 2 freemium specialists',
      duration: '11 months',
      // The eleven months are in Approach ("The build was quick. The eleven
      // months were the iterating"), so they are not repeated here.
      myRole: 'I decided what the setup keeps, what it asks, and what it decides on its own, then designed every screen that carries those decisions. Dozens of calls with small stores redrew each pass of the design.',
      live: { label: 'edrone.me', url: 'https://edrone.me' },
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
            content: 'edrone is marketing automation for ecommerce. Automated messages bring shoppers back to buy: an abandoned cart, a first order, the next one.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'For ten years every customer came through a Salesperson and stayed with a Support team. **The product always had people doing its setup, which is exactly what a small store cannot pay for.**',
          },
          {
            kind: 'text',
            content: 'Small stores were never worth acquiring: the cost of a person sat on top of every setup, and no path ran without one. Almost nobody had ever run edrone alone.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: '**Open edrone to the stores the old model could not afford to serve.** No salesperson, no Support team. The product sells itself, sets itself up and earns its keep.',
          },
          {
            // The definition of the number, in the section that is supposed to
            // define it. It spent a while at the foot of Solution, where it
            // read as a caveat arriving after the work rather than as the bar
            // the work was aimed at.
            kind: 'text',
            content: 'Ten years of the old model built 2,500 paying stores. Freemium had to reach the ones it never could, and most of those would never pay.',
          },
          {
            kind: 'text',
            content: 'Active meant a store had connected its shop to edrone, had automations running, and was doing around fifty orders a month. Not logins.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'A person had set up every paying customer, so the product had never stood on its own. Freemium had to turn everything that person used to do into decisions the product makes itself.',
          },
          {
            kind: 'text',
            content: 'Those customers still wrote their own newsletters, so it was never all or nothing. **I had to find the line: what is done before the store arrives, and what it still wants to do itself.**',
          },
          {
            kind: 'text',
            content: 'Then a third thing. A newsletter only counts if the next one is coming. **Setup that runs once is a demo.**',
          },
          {
            kind: 'text',
            content: 'The build was quick; the eleven months were the iterating. Dozens of calls with small stores redrew the design each pass: the step they stalled on, the automation they switched off, what they asked us for.',
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                description: 'A trial ends on a date. Freemium ends when the store outgrows it. **Which one holds a store long enough to be worth anything?**',
              },
              {
                num: 'PROBLEM 2',
                description: 'No two stores want the same messages going out under their name. **If the store has to decide, the setup is not finished. If I decide for everyone, some of it is wrong for someone.**',
              },
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: '**Freemium, not a trial.** Orders come when shoppers are ready, not when we are. A trial closes the account before that happens; a free one costs us nothing to leave open.',
          },
          {
            // The list this used to carry (campaigns written, automations
            // built, pop-up ready) is the still below it. Saying it twice made
            // the picture an illustration of the sentence instead of the
            // evidence for it.
            kind: 'text',
            content: "Everything is built from the store's own site in the minutes after signup. It gives us a URL and nothing else.",
          },
          {
            kind: 'demo',
            demo: 'freemium-setup',
            caption: 'Account creation in full. Four stages, no question asked at any of them, all of it read off the one address the store typed.',
          },
          {
            // Same cut: the seven automations were named one by one here and
            // are named again on their own cards in the still below.
            kind: 'text',
            content: 'Someone still had to decide what runs, and I took it. edrone knows what works better than a store that never ran marketing automation, so I switched everything on. Seven automations are live before the store logs in.',
          },
          {
            kind: 'demo',
            demo: 'freemium',
            step: 0,
            caption: 'What the store finds waiting: seven automations, all of them running. Each keeps an off switch, because disagreeing with edrone should cost a click.',
          },
          {
            kind: 'text',
            content: 'I started with two, to see whether a store would leave running something it had no hand in making. Nobody switched them off, so the rest followed.',
          },
          {
            kind: 'text',
            content: '**Nothing is asked before something is shown.** Tailoring means questions, and a question comes before anything runs. So the same seven run for a furniture store and a sock shop, each with an off switch. Disagreeing costs a click, not a setup.',
          },
          {
            kind: 'text',
            content: 'Nothing sends until the store connects its shop, so that ask falls last, not first: by then the store has seen what it is getting.',
          },
          {
            // The whole walkthrough, and it belongs here rather than three
            // paragraphs earlier. It ends on the store connecting, which is
            // what the paragraph above it is about; run before that and the
            // section showed the full sequence and then its own ending again.
            kind: 'demo',
            demo: 'freemium',
            caption: 'The shipped onboarding, end to end. Four steps of showing what is already done, and one ask at the end of them.',
          },
        ],
      },
    ],
    results: {
      summary: 'Almost nobody had ever run edrone alone; a year later more than five thousand stores had. The entrance the old model could not afford to serve became the one most stores came through.',
      metrics: [
        { value: '5,050', label: 'STORES ACQUIRED', color: 'accent', description: 'Signed up in under a year, without a salesperson or an onboarding team, the two costs that made a small store unprofitable. **393 started paying, adding 16% to a base built over ten years.**' },
        {
          value: '77%',
          label: 'ACTIVE STORES',
          color: 'accent',
          description: 'Every monthly cohort above. **Over the same months, the median time to a first attributed order fell from 35 days to 5.** That is a sale from a shopper who came back through an edrone message.',
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
      ],
    },
    reflections: [
      'Everything shipped as one preset. Next I would give the store a small set of choices, so it has a say without adding a step to setup.',
      'The model was built to take Support out of the customer, and Support\u2019s workload went up anyway. I never put a number on that, which is the first thing anyone should ask of a model that claims to remove a cost.',
    ],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup flow',
    description: 'Tripled signup conversion in five hours, with Codex.',
    card: {
      lead: 'Redesigned the signup form and tripled conversion, delivered with AI in',
      number: '5',
      label: 'hours',
    },
    metrics: [
      { value: '+200%', label: 'SIGNUP CONVERSION', color: 'accent' },
    ],
    tldr: {
      problem: 'Signup lost 97 of every 100 visitors who reached the form. A phone number almost nobody used sat on the most expensive moment in the funnel, and the SSO button did not create an account.',
      solution: 'Cut the phone number, made SSO real, and split the form so step 1 alone creates the account.',
      result: '0.75% to 2.25% of unique visitors, with conversion on to an integrated store unmoved.',
    },
    meta: {
      company: 'edrone',
      domain: 'Marketing automation for ecommerce',
      role: 'Sr Product Designer',
      team: 'Design and build solo, paired with Codex',
      duration: 'One afternoon',
      // "Five hours" is the description and the last line of Solution. Twice
      // is already the limit; a third place would be the punchline told again.
      myRole: 'I diagnosed the drop from event data and session recordings, then bet the redesign on one judgment: that splitting the form and creating the account on the first step would raise conversion despite adding a step. It did. I designed the flow and built its frontend in Codex.',
      live: { label: 'edrone.me', url: 'https://edrone.me' },
    },
    coverImage: '/images/sf-cover.png',
    thumbnailImage: '/images/sf-cover.png',
    // The redesigned story, not the old prototype `signup-demo.tsx` shows.
    // Not the full narrative either, landing page included — that version
    // still exists (`SignupStoryDemo`, kept alive by the Solution section's
    // own pinned use of `'signup-story'`), but the click-to-enlarge lightbox
    // ClickableDemo opens ignores every pin and always plays a demo's `id`
    // from the top, so a hero built on it surfaced the landing page again
    // however small the hero itself was capped. Both the hero and the home
    // card play the shipped product only: the redesign's own history is the
    // case study's job to tell, not this demo's.
    demo: 'signup-story-fixed',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation CRM for ecommerce. Automated messages and newsletters bring shoppers to the store to buy: a cart they left behind, a first order, the next one.',
          },
          {
            kind: 'text',
            content: 'For ten years edrone sold one way only, through Sales. Freemium was the company\'s first product-led channel, and this work landed four months into it.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'split',
            text: [
              'The four-step funnel lost the most people between clicking "Sign up free" and creating an account. **A mandatory phone number almost nobody used** stayed in the form for one salesperson who cold-called quiet signups, and every signing-up user paid for it at the most expensive moment in the funnel.',
              '**"Sign up with Google" did not create an account.** It pulled a name and email from the Google dialog and dropped the user back on the same four fields, now partly filled. The button looked like a shortcut and behaved like autofill.',
            ],
            sides: [
              {
                label: '',
                text: '',
                demo: 'signup-story',
                // Screen 1 of the story script: the old form, all four fields.
                step: 1,
              },
            ],
          },
        ],
      },
      {
        badge: 'Research',
        blocks: [
          {
            kind: 'text',
            content: 'I started in Amplitude, checked that the event data was sound, then watched session recordings of that exact step to see what people were doing on the form. That gave me a dozen or so issues I thought were wrong.',
          },
          {
            kind: 'text',
            content: 'Alongside it, I ran a UX agent I\'d built on Claude through the flow. It walks the screens in a browser, clicks through them the way a user would, and comes back with a report: what\'s wrong, why, and how severe.',
          },
          {
            kind: 'text',
            content: 'I used the agent to test my own hypotheses rather than to produce them. It confirmed most of what I had already found, added candidates I had not considered, and ranked them. I picked the ones worth the time and cost of building.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            // Each of the three changes gets its own short, live, looping
            // demo — `signup-story-demo.tsx`'s `SignupPhoneRemoveDemo`, not
            // a screenshot and not scroll-driven: it plays on its own once it
            // is on screen, the same as every other demo on this page.
            kind: 'split',
            text: [
              'Time to act on what the research had found.',
              'The main change was **removing the phone number input**. I had to confirm with Sales whether it held real value; it turned out to be marginal, worth cutting outright.',
            ],
            sides: [
              { label: '', text: '', demo: 'signup-story-phone' },
            ],
          },
          {
            kind: 'split',
            text: [
              "Next, SSO finally worked correctly, so **users could create an account through Google or Shopify**.",
              "And that's where the third change came in: creating an account still required the shop's URL up front...",
            ],
            sides: [
              { label: '', text: '', demo: 'signup-story-google' },
            ],
          },
          {
            // Left plays Name and Shop URL leaving (`SignupSplitDemo`);
            // right plays them landing on the step 2 it's splitting into
            // (`SignupSplitArriveDemo`) — two `DemoFrame`s on an identical
            // timeline, not one pinned still, so the pair reads as one
            // relocation rather than a before/after cut.
            kind: 'demo-pair',
            text: [
              "So **I split that step into two**, an unpopular move, though it did streamline the SSO flow. After creating the account, the user supplied their shop link and name, for the Support team and in-app personalization.",
            ],
            left: { demo: 'signup-story-split' },
            right: { demo: 'signup-story-split-arrive' },
          },
          {
            kind: 'text',
            content: 'I put together a prototype draft in Figma, and after checking with a developer it turned out the whole thing needed some backend work, so I took the front end myself, in Codex.',
          },
          {
            kind: 'text',
            content: "And that's how we shipped **the new signup flow in five hours**.",
          },
        ],
      },
    ],
    results: {
      summary: "I waited three weeks before deciding whether the flow stayed or not. Given the site's average traffic, that was the least I'd trust the number, though honestly, I already knew the decision after the first few days of seeing the performance.",
      note: '**Desktop, about 85% of the traffic, went from 1% to 2%; mobile, which had a dismal 0.05%, rose to 3%.**',
      northStar: {
        label: 'TOTAL SIGNUP CONVERSION',
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
      },
      metrics: [],
    },
    reflections: [
      'At the same time, I was aware of the risk that **rolling out three changes at once could make it hard to tell which one actually moved the needle**, especially splitting the form into two steps, so I tracked that one on its own. **Share of visitors who began filling the form went from 2.7% to 10%: desktop 3% to 10%, mobile 1% to 10%. Splitting the form was the bet, and this is what confirms it.**',
      "For cleanliness, I would have shipped the phone number removal on its own, then SSO and the split together as a second phase, but I didn't have that much time at that point.",
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts identification',
    description: "Identified a third more of a shop's traffic, the metric behind half its revenue.",
    card: {
      lead: "Reactivated stores' customers through a feature built with AI in a week, making",
      number: '32%',
      label: 'more of them reachable by automations',
    },
    metrics: [
      { value: '+32%', label: 'IDENTIFICATION RATE', color: 'accent' },
    ],
    tldr: {
      problem: 'An automation can only fire at a contact edrone has identified by a cookie, and for the median store that was 3.1% of traffic. Nothing on the market raises it, and it decays on its own.',
      solution: 'A seven-email sequence that repeats every 30 days, starts switched on, and is written in the store\'s own voice by AI.',
      result: '3.1% to 4.1% reachable traffic in the first month, with 860 stores having kept it on against 42.',
    },
    meta: {
      company: 'edrone',
      domain: 'Marketing automation for ecommerce',
      role: 'Sr Product Designer',
      team: '1 product analyst, AI-written copy',
      duration: 'One week',
      // The six days close Solution, so they are not repeated here.
      myRole: 'I decided the concept, the sequence, the frequency and every screen: how often to send, what is and is not marketing, and that the feature starts on. A product analyst verified the data behind each call.',
      live: { label: 'edrone.me', url: 'https://edrone.me' },
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
            content: "edrone is marketing automation for ecommerce. Automations fire off what a shopper does on the site; newsletters go out by hand to subscribers. Each brings half the revenue edrone can earn a shop, and a store pays by the size of the contact base it keeps there.",
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                title: 'Nothing identifies a contact unless the contact acts first',
                description: 'It takes an open, a click, a signup or an order. Only the first can be repeated, and only if the store mails its whole base.',
              },
              {
                num: 'PROBLEM 2',
                title: 'Identification decays on its own',
                description: 'Cookies clear on their own within about 30 days, so anything sent once stops working.',
              },
              {
                num: 'PROBLEM 3',
                title: 'Almost nobody knows identification exists',
                description: 'Three quarters of users did not know a contact has to be identified at all. The feature had to explain its own value fast, or nobody would use it.',
              },
            ],
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: "An automation can only fire at a contact edrone has identified by a cookie.",
          },
          {
            kind: 'contact-flow',
            caption: "Opening an email loads a tracking pixel, which sets the cookie connecting a contact's browsing to their profile.",
          },
          {
            kind: 'text',
            content: "For the median store that was **3.1%**. The other 97% of the traffic got no automations at all, which makes identification the biggest lever in the product.",
          },
          {
            kind: 'text',
            content: "The ceiling is higher than it looks: an automation needs no marketing consent, so it reaches contacts a newsletter never will. Every point is leverage on a base the store already pays for.",
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "My product analyst checked the data first, in case 3.1% was a reporting artefact. It was real.",
          },
          {
            kind: 'text',
            content: "Then Klaviyo, HubSpot, Omnisend, Brevo and a few others. **None of them do anything to raise it.** Identification happens where a contact engages on their own, and nowhere else.",
          },
          {
            kind: 'text',
            content: "Support was already solving it by hand: a short series of emails to a store's whole base, purely to get contacts identified. For a handful of stores, one at a time, once.",
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: "What to send. Marketing cannot go to contacts without consent, and those are exactly the ones worth reaching, so nothing in the sequence is marketing.",
          },
          {
            kind: 'text',
            content: "How often. One send lifts identification and loses it again as the cookies clear, so the sequence repeats every 30 days.",
          },
          {
            kind: 'demo',
            demo: 'contacts',
            step: 0,
            caption: 'The sequence as the user sees it: each send 30 days after the one before, and a repeat at the end rather than a stop.',
          },
          {
            kind: 'text',
            content: "Variety. Seven different emails, not one resent: a base that gets the same message monthly stops opening it, and an unopened email identifies nobody.",
          },
          {
            kind: 'text',
            content: "The content. Each message had to look like the store rather than like edrone, so AI writes it from the store's own branding.",
          },
          {
            kind: 'demo',
            demo: 'contacts',
            step: 1,
            caption: "One send opened in the preview drawer, carrying the store's own branding rather than edrone's.",
          },
          {
            kind: 'text',
            content: "Who turns it on. Left off until someone found the setting, nobody would have, so **the feature starts on**, shown in onboarding as something already running. It comes off in one click.",
          },
          {
            kind: 'demo',
            demo: 'contacts',
            caption: 'The identification screen in the walkthrough. I designed the template structure; AI writes the content.',
          },
          {
            kind: 'text',
            content: "I validated it first with the eight people in Support who had been sending those emails by hand.",
          },
          {
            kind: 'text',
            content: "Existing customers did not get it switched on automatically. For them it became one click for Support, instead of the campaign they used to send themselves.",
          },
          {
            kind: 'text',
            content: "The screen, the template structure and the sequence shipped together in **six days**, because each decision carried its own evidence: the repeat cadence from how the cookies clear, the 'starts on' default from nobody searching for the setting, the content from the store's own branding.",
          },
        ],
      },
    ],
    results: {
      summary: 'Eight people in Support had been sending these emails by hand, one store at a time. The feature condensed that into one screen that writes its own copy from the store\'s branding and defaults to running.',
      note: "Share of contacts an automation could reach, from **3.1% to 4.1%** a month after rollout.",
      northStar: {
        label: 'IDENTIFICATION RATE',
        value: '+32%',
      },
      metrics: [
        { value: '95%', label: 'KEPT IT ON', description: 'The sequence starts on, and 860 stores left it that way against 42 who switched it off.', color: 'accent' },
      ],
    },
    reflections: [
      "The first version sent to the whole base every cycle, including contacts it had already identified that month. That is volume spent on nothing and a tax on deliverability. Skipping anyone who opened an email in the last 30 days would have fixed it, and there was no room for that before launch.",
    ],
  },
  {
    slug: 'plo-genius',
    title: 'PLO Genius',
    description: "The first PLO poker solver ever to run in a browser. Designed from zero as the sole designer.",
    card: {
      lead: 'Sole designer of the first PLO solver in a browser, from research to design system, still live four years on with',
      number: '120+',
      label: 'paying subscribers',
    },
    metrics: [
      { value: '10+', label: 'B2B API CLIENTS', color: 'accent' },
    ],
    tldr: {
      problem: 'PLO players studied without a solver: the only option was a $5,000+ PC running MonkerSolver, and the output was a frequency matrix most players could not read.',
      solution: 'I turned a proven neural-net engine into a browser product whose whole interface taught players to read its output: preflop and postflop solvers, a trainer, and the marketing site.',
      result: 'Four years on: 120+ paying subscribers on the app I designed, 10+ platforms licensing the engine.',
    },
    meta: {
      company: 'Deepsolver',
      domain: 'SaaS · Poker / GTO solver',
      role: 'Sole product designer',
      team: 'Solo design; engineers owned the engine',
      duration: '10 months',
      myRole: 'Research, UX, UI, the marketing site and the design system. The core judgment was treating the interface as the product: the engine was proven, the players who needed it most could not read its output, so the whole design existed to make that matrix readable.',
      live: { label: 'plogenius.com', url: 'https://www.plogenius.com' },
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
            content: 'PLO Genius is a cloud-based Pot-Limit Omaha solver and GTO trainer, built to run in a browser on a subscription a player could justify.',
          },
          {
            kind: 'text',
            content: 'Deepsolver (NLH) had already proven that a neural-net cloud solver could work. PLO Genius brought the same approach to Omaha: a more complex game with far fewer learning tools.',
          },
          {
            kind: 'text',
            content: 'I was the sole designer, and that constraint shaped every decision. There was no onboarding team and no brand to fall back on, so whatever the product needed to teach had to be designed into the product itself.',
          },
        ],
      },
      {
        badge: 'Problem',
        blocks: [
          {
            kind: 'text',
            content: 'Before it, studying PLO with a solver meant buying a **$5,000+ PC to run MonkerSolver**. There was no affordable, browser-based alternative, so most PLO players studied without a solver at all.',
          },
          {
            kind: 'text',
            content: 'A solver answers with a matrix of frequencies and stops there. **The players who needed one most were the least able to read it**: the tool that was supposed to teach demanded a language the learner did not have yet.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: '**Put a PLO solver in a browser at a price a player could justify.** The bar was the alternative: hardware, software, minutes per calculation. Most players would not pay any of it, so they studied without a solver.',
          },
          {
            kind: 'text',
            content: 'Deepsolver had already shown a neural-net cloud solver worked for No-Limit Hold’em, so the engine was never the open question. **The interface was.** The product had to exist to make the solver’s output readable.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "I was designing a learning tool for a game I didn't play. The usual sources failed in useful ways: beginners could not say what they needed because they did not know the game yet, and pros operated on intuition that would not translate into interface decisions. Neither could validate a judgment about how a solver should teach.",
          },
          {
            kind: 'text',
            content: 'The bridge turned out to be poker stables: organizations where a knowledgeable lead managed groups of players at different levels. Those leads understood both the theory and the learning process, which made them the most useful collaborators for validating design decisions.',
          },
          {
            kind: 'text',
            content: 'Validation ran through those stables. Each new surface went to a lead who both understood the theory and taught it, and the design changed on what they said: which charts confused, which drills held, where a screen asked more than a player could know yet.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'The design broke the matrix into three surfaces, each answering one question a player actually asks. Each one carries its own piece of the teaching, with no onboarding team to explain anything outside the screen.',
          },
          {
            kind: 'image',
            src: '/images/plo-preflop.png',
            caption: 'Preflop: "what should I play here." Range charts and matrices across stack sizes, positions and rake, drawn from the trained network.',
          },
          {
            kind: 'image',
            src: '/images/plo-postflop.png',
            caption: 'Postflop: "how does my hand do against that range on this board." Equity visualisations turn the matrix into a picture.',
          },
          {
            kind: 'image',
            src: '/images/plo-trainer.png',
            caption: 'GTO Trainer: up to four tables at once, tuned to feel like a real session so learned play transfers to it. No custom bets, so the drill stays on correct play.',
          },
          {
            kind: 'text',
            content: 'The marketing site had to teach the same idea to people who had never used a solver: it led with the player\'s question, not with the engine, because nobody buys a matrix they cannot read.',
          },
          {
            kind: 'text',
            content: 'Launch. The product found paying users, and the screens above are the ones it shipped with.',
          },
        ],
      },
    ],
    results: {
      summary: 'The product shipped with paying users and is still live four years later, while the engine it presented is licensed to other platforms. Both revenue lines ran through the same interface: something players could read well enough to pay for, and platforms could recognize well enough to license.',
      metrics: [
        { value: '10+', label: 'B2B API CLIENTS', color: 'accent', description: 'Platforms licensing the neural-net engine. Primary revenue channel.' },
        { value: '120+', label: 'PAYING SUBSCRIBERS', color: 'accent', description: 'Players using the app I designed. Three tiers: $0 / $59 / $125.' },
      ],
    },
    reflections: [
      'The engine sold better than the app around it. Ten platforms licensed the API against 120 subscribers on the product I spent ten months designing. Knowing that, I would put the design effort where the revenue was and treat the consumer app as the demo for it.',
      'Nothing in the product let players teach each other. PLO study already happens inside stables and the groups around them, which is where my own research came from, and the product never gave those groups anything to work with. A trainer a stable lead could set drills in would have grown through the people already doing that work by hand.',
    ],
  },
]

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
