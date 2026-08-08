// ─── Process content block types ────────────────────────────────────────────

/** A product screen rebuilt in code. Resolved to a component in components/demos/registry.tsx. */
export type DemoId = 'signup' | 'signup-old' | 'contacts' | 'freemium'

/** One side of a comparison: either a screenshot or a coded demo. */
export type CompareSide = { label: string } & ({ src: string } | { demo: DemoId })

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'compare'; before: CompareSide; after: CompareSide; caption?: string }
  | { kind: 'contact-flow'; caption?: string }
  | { kind: 'vertical-flow'; steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]; arc?: { fromStep: number; toStep: number; label: string }; caption?: string }
  | { kind: 'decisions'; items: { num: string; title: string; description: string }[] }
  | { kind: 'slideshow'; images: string[]; caption?: string }
  | { kind: 'demo'; demo: DemoId; caption?: string }

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
  tagline: string
  description: string
  metrics: {
    value: string
    label: string
    color?: 'accent' | 'ink'
  }[]
  meta: {
    role: string
    team: string
    duration: string
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
    note?: string
    northStar?: {
      label: string
      value: string
    }
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
    tagline: 'From sales-gated to self-serve. 5,050 stores acquired without a salesperson.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model I built alongside it.",
    metrics: [
      { value: '5,050', label: 'STORES ACQUIRED', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end dev, 1 Back-end dev',
      // Eleven monthly cohorts in the data, May 2025 to March 2026.
      duration: '11 months',
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
            content: 'edrone is marketing automation for ecommerce. Automated messages and newsletters bring shoppers back to finish the orders they abandoned.',
          },
          {
            kind: 'text',
            content: 'For ten years edrone sold one way. A salesperson closed the deal and a Support team set the product up. **That put a floor under the size of customer worth acquiring.** Sales promised that team at signing, so almost nobody had ever set the product up alone.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: '**Open edrone to the stores the old model could not afford to serve.** Take the salesperson and the onboarding team out of the cost and the same store pays for itself. That leaves the product to do the whole job.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: '**I had to digitise what the onboarding team did.** Until then every paying customer had their setup handed to them by a person. The first question was whether the product could stand up to a user with nobody behind them, so I went at the places where a store is most on its own.',
          },
          {
            kind: 'text',
            content: 'Even edrone\'s paying customers, who had Support the whole way, did plenty themselves, so the answer was never all or nothing. **What I needed was the line between what should already be done when a store arrives and what it still wants to do itself.** Two things stood in the way.',
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                title: 'One step only the store can take',
                description: 'Connecting a shop needs its own credentials and its own decision to hand over a customer list. It was the first thing the product asked for, and a place a store could stall and never come back from.',
              },
              {
                num: 'PROBLEM 2',
                title: 'No honest definition of an active store',
                description: 'Logins did not mean use. A store could be earning from edrone for weeks without opening it once, so counting sign-ins said nothing about which accounts were alive.',
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
            content: '**Every feature the store came for is set up for it.** The campaigns are written, the automations are built, the pop-up is ready.',
          },
          {
            kind: 'text',
            content: 'Being ready still leaves a decision to make about each one, so I went further and switched them on. **Seven automations run from the first minute.** Abandoned cart, product recommendations, welcome, birthday, win-back, remarketing to past customers and loyalty, plus the pop-up and the first newsletters.',
          },
          {
            kind: 'text',
            content: 'I started with two, to find out whether a store would leave running something it had no hand in making. Nobody switched them off, so the rest followed.',
          },
          {
            kind: 'text',
            content: 'All of it is built from the store\'s own site in the minutes after signup. The store gives a URL and nothing else. No credentials, no connection, nothing to fill in.',
          },
          {
            kind: 'text',
            content: '**Integration is the test.** It is the last step, and it takes one click. That is where the store decides whether what edrone has already done is worth handing over its customer list.',
          },
          {
            kind: 'text',
            content: 'The business wanted it first. A connected store is a committed one, and its real product feed makes better content, and both of those are true. But products can be read off the storefront, so at that position integration was buying the commitment and nothing else. **I argued it cost more than it bought, and moved it.**',
          },
          {
            kind: 'demo',
            demo: 'freemium',
            caption: 'The shipped onboarding. Setup runs while the account is being created, so everything is already on by the time the user arrives.',
          },
          {
            kind: 'text',
            content: '**An active store is an integrated one with automations running.** I measured it only on stores doing around fifty orders a month or more, because below that a shop is either days old or too small for marketing automation to be for it, and counting them would have made the number meaningless. That is what the channel was steered by, not logins.',
          },
        ],
      },
    ],
    results: {
      metrics: [
        { value: '5,050', label: 'STORES ACQUIRED', color: 'accent', description: 'Signed up in under a year, and not one of them cost a salesperson or an onboarding team. Those were the two costs that made a small store unprofitable to begin with. **393 started paying, adding 16% to the 2,500-customer base edrone had built in ten years.**' },
        {
          value: '77%',
          label: 'ACTIVE STORES',
          color: 'accent',
          description: 'Every monthly cohort above, from the first to the last, counting a store once it is integrated with automations running. **Over the same months, median time to a first attributed order fell from 35 days to 5.** An attributed order is a sale from a shopper who came back through an edrone message.',
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
      'Everything shipped as a single preset. The lever I would pull next is a small curated choice, which buys agency without adding a step to setup.',
    ],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup flow',
    tagline: 'Tripled signup conversion in five hours, with Codex.',
    description: 'Tripled signup conversion in five hours, with Codex.',
    metrics: [
      { value: '+200%', label: 'SIGNUP CONVERSION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end dev',
      duration: '5 hours',
    },
    coverImage: '/images/sf-cover.png',
    thumbnailImage: '/images/sf-cover.png',
    demo: 'signup',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation CRM for ecommerce. It exists to keep customers coming back. Automated messages and newsletters bring shoppers back to the store to finish orders they had abandoned, and the rest of the product feeds the same loop.',
          },
          {
            kind: 'text',
            content: 'For ten years edrone sold one way only, through Sales. Freemium was the company\'s first product-led channel, and this work landed four months into it.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: 'Acquisition was freemium\'s goal at that stage, so the activation funnel was the priority for the Freemium Team I led. Signup was its first step, which meant everything lost there was lost again at every step below it.',
          },
          {
            kind: 'text',
            content: 'In Amplitude the largest drop across the four-step funnel sat between clicking "Sign up free" on the website and creating an account. **0.75% of unique visitors made it through, against a 2–3% market standard.** I led the freemium project, so I took this one on myself. It was the highest-leverage number on the board.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'I started in Amplitude. I checked the event data was sound, then watched session recordings of that exact step to see what people were doing on the form. That gave me a short list of what I thought was wrong.',
          },
          {
            kind: 'text',
            content: 'Alongside it I ran a UX agent I had built on Claude across the flow. It walks the screens in a browser, clicks through them the way a user would, and returns a report with problem, description and severity.',
          },
          {
            kind: 'text',
            content: 'I used the agent to test my own hypotheses rather than to produce them. It confirmed most of what I had already found, added candidates I had not considered, and ranked them. I picked the ones worth the time and cost of building.',
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                title: 'A mandatory phone number almost nobody used',
                description: 'A leftover from the sales-led funnel. One salesperson was responsible for calling accounts that signed up and then went quiet. **Every user paid for that, at the most expensive moment in the funnel.**',
              },
              {
                num: 'PROBLEM 2',
                title: 'SSO promised one click and delivered a form',
                description: '"Sign up with Google" did not create an account. It took an address from the Google dialog and dropped the user back on the same four fields, now partly filled. **The button looked like a shortcut and behaved like autofill.**',
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
            content: 'The obvious fix was removing the phone number. The COO pushed back at first, because his concern was Sales losing the ability to qualify leads, which is fair. So I went to Sales and talked to the one person who actually made those calls. He admitted there was no value in them and confirmed the field could go. It stayed removed.',
          },
          {
            kind: 'text',
            content: 'The second was making SSO real. We had just added Shopify alongside Google, so it had to actually create the account across both providers.',
          },
          {
            kind: 'text',
            content: 'Then I went further and split the form to make signing up feel lighter and to capture the account earlier. **Step 1 now creates the account from an email address or SSO. Step 2 collects name and store URL.**',
          },
          {
            kind: 'compare',
            before: { demo: 'signup-old', label: 'Before' },
            after: { demo: 'signup', label: 'After' },
            caption: 'Before: four fields in one pass, with SSO under the form it would have filled in. After: step 1 creates the account, step 2 collects what the product needs.',
          },
          {
            kind: 'text',
            content: 'More steps normally means less conversion. My bet was that what people see at the moment of the decision matters more than how many steps follow, and the result says it did. Anyone who drops out of step 2 already has an account, so I set up recovery paths in Intercom to bring them back. The friction moved to after the contact rather than before it.',
          },
          {
            kind: 'text',
            content: 'I designed the flow in Figma, then built the frontend directly in Codex. That part was quick, because Codex already had the coded design system I had built when I joined edrone. A developer handled the backend, reviewed my code and released it. The whole project, from diagnosis through design, build and test to production, fit into **five hours.**',
          },
        ],
      },
    ],
    results: {
      note: 'Unique visitors who ended up with a created account, from **0.75% to 2.25%**. Conversion on to an integrated store did not move, so the extra signups were no worse than the ones before.',
      northStar: {
        label: 'TOTAL SIGNUP CONVERSION',
        value: '+200%',
      },
      metrics: [
        { value: '+270%', label: 'STEP 1 CONVERSION', color: 'accent', description: 'Share of visitors who began filling the form went from **2.7% to 10%**. Desktop 3% to 10%, mobile 1% to 10%. Splitting the form was the bet, and this is what confirms it.' },
      ],
    },
    reflections: [
      'I shipped three changes at once and gave up knowing which one worked better. Traffic was low enough that isolating each change would have meant at least three weeks per change to collect anything meaningful, and an A/B test would have taken longer still. With more traffic I would split it, but at that point I had to move quicker and leaner.',
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts identification',
    tagline: 'Raised contact identification by a third, with a sequence nobody has to switch on.',
    description: "Automations only reach contacts edrone has identified, and it had identified almost none of them. I designed the sequence that changed that.",
    metrics: [
      { value: '+32%', label: 'IDENTIFICATION RATE', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end dev',
      duration: '6 days',
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
            content: "edrone is a marketing automation CRM for ecommerce, there to make the customers who already reach a shop's website come back and convert. It has two core features. Automations are triggered by any customer activity on the site, and newsletters are sent by the user by hand to subscribed customers only. Each brings half of the total revenue edrone can generate for the shop. Stores pay for edrone by the size of the contact base they keep there.",
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: "For edrone to follow a customer's activity live and fire an automation off it, that customer has to be identified by a cookie.",
          },
          {
            kind: 'contact-flow',
            caption: "Opening an email loads a tracking pixel, which sets the cookie connecting a contact's browsing to their profile.",
          },
          {
            kind: 'text',
            content: "Identification sat at **3.1%** for the median store, so all the rest of the traffic on the site was getting no automations at all, which makes identification the single biggest lever in the product.",
          },
          {
            kind: 'text',
            content: "The ceiling is higher than it looks, because an automation does not need marketing consent, so it reaches contacts a newsletter never will. I took the number on myself, because every point of it is leverage on a base the store already pays for.",
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "I put the product analyst on my team on the data first, to find out whether the number was a reporting artefact or the real state of the base. It was real.",
          },
          {
            kind: 'text',
            content: "Then I went through what other platforms do about it, Klaviyo, HubSpot, Omnisend, Brevo and a few others. **None of them do anything to raise it.** Identification happens wherever a contact engages on their own, and nowhere else.",
          },
          {
            kind: 'text',
            content: "Support was the next place to look, since I wanted to know whether they had any way of handling this already and how customers actually talk about identification. It mattered to them enough that they were sending a short series of emails to a store's entire base by hand, purely to get contacts identified, though only for a small handful of stores, one at a time and only once.",
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                title: 'Nothing identifies a contact unless the contact acts first',
                description: 'It takes an email open or click, a newsletter signup, or an order. Only the first can be repeated on a cycle, and only if the store sends to its entire base.',
              },
              {
                num: 'PROBLEM 2',
                title: 'Identification decays on its own',
                description: 'Cookies might clear on their own within about 30 days depending on the browser, so anything sent once stops working the moment they do.',
              },
              {
                num: 'PROBLEM 3',
                title: 'Almost nobody knows identification exists',
                description: 'Around three quarters of users did not know a contact has to be identified before an automation can reach them, and only marketers did. The feature had to explain its own value simply and fast, or nobody would use it.',
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
            content: "The first decision was what to send. Marketing content cannot go to contacts who never gave consent, and those are exactly the ones worth reaching, so nothing in the sequence is marketing.",
          },
          {
            kind: 'text',
            content: "The second was how often. A single send lifts identification and loses it again as the cookies clear, so the sequence repeats every 30 days instead of running once.",
          },
          {
            kind: 'text',
            content: "The third was variety. Seven different emails rather than the same one resent, because a base that gets an identical message every month stops opening it, and an unopened email identifies nobody.",
          },
          {
            kind: 'text',
            content: "The fourth was the content itself. Each message had to be worth opening and had to look like the store rather than like edrone, so AI generates it from the store's own branding.",
          },
          {
            kind: 'text',
            content: "The last decision was who turns it on. Leaving it off until the user found the setting would have meant nobody ever did, so **the feature starts on**, shown in the onboarding walkthrough as something already running rather than something to configure, and it comes off in one click. That was how the rest of the onboarding already worked.",
          },
          {
            kind: 'demo',
            demo: 'contacts',
            caption: 'The identification screen in the walkthrough. I designed the template structure; AI writes the content.',
          },
          {
            kind: 'text',
            content: "Before any of it went out I validated the whole thing internally with the eight people from Support who had been sending those emails by hand.",
          },
          {
            kind: 'text',
            content: "That left the customers already on the product, who did not get it turned on automatically. Switching it on for one of them came down to a single click for Support, instead of the campaign they used to send themselves.",
          },
          {
            kind: 'text',
            content: "I designed the screen and the email templates in Figma and built the frontend in Codex, a backend developer handled the sending, and it went to production in six days.",
          },
        ],
      },
    ],
    results: {
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
    tagline: 'A cloud-based PLO solver and trainer. Designed from zero as sole designer.',
    description: "Cloud-based poker solver and trainer. Designed from zero for a game I didn't play.",
    metrics: [
      { value: '10+', label: 'B2B API CLIENTS', color: 'accent' },
    ],
    meta: {
      role: 'Sole Designer',
      team: '1 Front-end dev, 1 Back-end dev',
      duration: '10 months',
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
            content: 'PLO Genius is a cloud-based Pot-Limit Omaha solver and GTO trainer. Before it existed, learning PLO with solvers meant buying a $5,000+ PC to run MonkerSolver and waiting minutes per calculation. There was no affordable, browser-based alternative for PLO players.',
          },
          {
            kind: 'text',
            content: 'Deepsolver (NLH) had already proven that a neural-net cloud solver could work. PLO Genius brought the same approach to Omaha: a more complex game with far fewer learning tools.',
          },
          {
            kind: 'text',
            content: "I was the sole designer. The team was small: the CEO as PM, two professional poker players who were also investors, a frontend developer, and a 3-5 person engine team building the neural-net solver. I owned research, UX, UI, the marketing website, and built a standalone design system to give PLO Genius its own brand identity separate from Deepsolver.",
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "I was designing a learning tool for a game I didn't play. That created a real gap in research. Beginners couldn't articulate what they needed because they didn't understand the game well enough yet. Pro players operated on intuition and methods that were hard to translate into interface decisions.",
          },
          {
            kind: 'text',
            content: 'The bridge turned out to be poker stables: organizations where a knowledgeable lead managed groups of players at different levels. Those leads understood both the theory and the learning process, which made them the most useful collaborators for validating design decisions.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'image',
            src: '/images/plo-preflop.png',
            caption: 'Preflop solver. Range charts and matrices showing optimal plays across stack sizes, positions, and rake structures.',
          },
          {
            kind: 'image',
            src: '/images/plo-postflop.png',
            caption: 'Postflop solver. Hand breakdown with equity visualizations showing how a hand performs against opponent ranges on a specific board.',
          },
          {
            kind: 'image',
            src: '/images/plo-trainer.png',
            caption: 'GTO Trainer. Up to 4 tables simultaneously, designed to feel like a real session. Players practice strategy and track accuracy without custom bets, keeping focus on learning correct play.',
          },
          {
            kind: 'text',
            content: 'The product launched, found paying users, and is still live four years later.',
          },
        ],
      },
    ],
    results: {
      metrics: [
        { value: '10+', label: 'B2B API CLIENTS', color: 'accent', description: 'Platforms licensing the neural-net engine. Primary revenue channel.' },
        { value: '120+', label: 'PAYING SUBSCRIBERS', color: 'accent', description: 'Players using the app I designed. Three tiers: $0 / $59 / $125.' },
      ],
    },
    reflections: [],
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
