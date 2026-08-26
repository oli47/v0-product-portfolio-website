// ─── Process content block types ────────────────────────────────────────────

/** A product screen rebuilt in code. Resolved to a component in components/demos/registry.tsx. */
export type DemoId = 'signup' | 'signup-old' | 'contacts' | 'freemium' | 'freemium-setup'

/** One side of a comparison: either a screenshot or a coded demo. */
export type CompareSide = { label: string } & ({ src: string } | { demo: DemoId })

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'compare'; before: CompareSide; after: CompareSide; caption?: string }
  | { kind: 'contact-flow'; caption?: string }
  | { kind: 'vertical-flow'; steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]; arc?: { fromStep: number; toStep: number; label: string }; caption?: string }
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
  metrics: {
    value: string
    label: string
    color?: 'accent' | 'ink'
  }[]
  meta: {
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
    description: "Freemium, edrone's first product-led channel after a decade of sales-led growth.",
    metrics: [
      { value: '5,050', label: 'STORES ACQUIRED', color: 'accent' },
    ],
    meta: {
      // The eleven months are in Approach ("The build was quick. The eleven
      // months were the iterating"), so they are not repeated here.
      myRole: 'I owned the acquisition model, the funnel and every design decision. Two developers built it and two freemium specialists from the onboarding team ran the customer calls that shaped every iteration.',
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
          {
            kind: 'text',
            content: 'For ten years every customer came through a salesperson and stayed with a Support team. **Both cost more than a small store would ever pay, so small stores were not worth acquiring.** Almost nobody had ever run edrone alone.',
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
            content: 'Ten years of the old model had built 2,500 paying stores. This channel had to reach the ones it never could, and most of them would never pay at all.',
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
            content: 'A person had set up every paying customer, so the product had never stood on its own. My job was to digitise the onboarding team.',
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
            content: 'The build was quick; the eleven months were the iterating. Two freemium specialists gave me dozens of store calls, and everything went through pass after pass.',
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
            caption: 'What the store finds waiting: seven automations, every one of them already switched on.',
          },
          {
            kind: 'text',
            content: 'I started with two, to see whether a store would leave running something it had no hand in making. Nobody switched them off, so the rest followed.',
          },
          {
            kind: 'text',
            content: '**Nothing is asked before something is shown.** Tailoring means questions, and a question comes before anything runs. So the same seven go out for a furniture store and a store selling socks, and every one has an off switch. Disagreeing costs a click, not a setup.',
          },
          {
            kind: 'text',
            content: 'Nothing sends until the store connects its shop, so integration is the real start line, not signup. That ask is the last step of the walkthrough rather than the first, because by then the store has seen what is waiting for it.',
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
      metrics: [
        { value: '5,050', label: 'STORES ACQUIRED', color: 'accent', description: 'Signed up in under a year, none of them costing a salesperson or an onboarding team, which were the two costs that made a small store unprofitable. **393 started paying, adding 16% to a base built over ten years.**' },
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
    metrics: [
      { value: '+200%', label: 'SIGNUP CONVERSION', color: 'accent' },
    ],
    meta: {
      // "Five hours" is the description and the last line of Solution. Twice
      // is already the limit; a third place would be the punchline told again.
      myRole: 'I owned the diagnosis, the design and the shipped frontend. I built it in Codex using the design system I had created. A developer handled the backend, reviewed my code and released it.',
      live: { label: 'edrone.me', url: 'https://edrone.me' },
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
            content: 'edrone is a marketing automation CRM for ecommerce. Automated messages and newsletters bring shoppers to the store to buy: a cart they left behind, a first order, the next one.',
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
    description: "Identified a third more of a shop's traffic, the metric behind half its revenue.",
    metrics: [
      { value: '+32%', label: 'IDENTIFICATION RATE', color: 'accent' },
    ],
    meta: {
      // The six days close Solution, so they are not repeated here.
      myRole: 'I owned the concept, the sequence and every screen. My product analyst verified the data. A backend developer built the sending.',
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
            content: "I designed the screen and the templates in Figma and built the frontend in Codex; a backend developer handled the sending. Six days to production.",
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
    description: "The first PLO poker solver ever to run in a browser. Designed from zero as the sole designer.",
    metrics: [
      { value: '10+', label: 'B2B API CLIENTS', color: 'accent' },
    ],
    meta: {
      // The ten months live here rather than in the prose: this is the one
      // project whose duration is stated nowhere else.
      myRole: 'I owned research, UX, UI, the marketing website and the design system over ten months. A frontend developer built the app and the engine team handled the neural-net solver.',
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
        badge: 'Goal',
        blocks: [
          {
            // No conversion baseline exists for this one, so the goal is
            // anchored to the alternative and what it cost, the way freemium's
            // is anchored to what Sales was already being paid.
            kind: 'text',
            content: '**Put a PLO solver in a browser at a price a player could justify.** The bar was whatever a player would otherwise do: buy a $5,000 PC, run MonkerSolver on it, and wait minutes for a single calculation. Most would not, so most PLO players studied without a solver at all.',
          },
          {
            kind: 'text',
            content: 'Deepsolver had already shown a neural-net cloud solver worked for No-Limit Hold’em, so the engine was never the open question. **The interface was.** A solver answers with a matrix of frequencies, and the players who needed one most were the least able to read it.',
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
