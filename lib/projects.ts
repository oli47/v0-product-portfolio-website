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
    date: string
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
    tagline: 'From sales-gated to self-serve. 4657 accounts in 7 months.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model I built alongside it.",
    metrics: [
      { value: '8.4%', label: 'PAID CONVERSION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end dev, 1 Back-end dev',
      duration: '7 months',
      date: '2025–2026',
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
            content: 'edrone is a marketing automation CRM for ecommerce. Every new customer went through Sales: demo, contract, Support-led onboarding. No self-serve path existed.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'I saw consistent inbound traffic in GA that never reached Sales, and built the case for a freemium channel to capture it. Freemium launched May 2025, and over 7 months I iterated on the onboarding through continuous user research and production testing.',
          },
          {
            kind: 'text',
            content: 'Together with two Support team members I brought in as my freemium sub-team, we ran dozens of interviews with fresh signups throughout the project and internal sessions with Support\'s onboarding and success teams. With each shipped iteration we analysed how users behaved and what could make the experience more seamless.',
          },
          {
            kind: 'text',
            content: '**The vast majority of users reaching edrone were small, one-person stores.** No time, no MA experience, no idea whether it would pay off. They could not invest hours into understanding, configuring, or learning a tool. **Everything had to work without asking them to build anything.**',
          },
          {
            kind: 'slideshow',
            images: ['/images/freeold1.png', '/images/freeold2.png', '/images/freeold3.png', '/images/freeold4.png', '/images/freeold5.png'],
            caption: 'Early version, May 2025.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'vertical-flow',
            steps: [
              { title: 'Signup', subtitle: 'User creates an account' },
              { title: 'AI content', subtitle: "User sees their store's branded content ready to go" },
              { title: 'Activation', subtitle: 'User reviews what is already on. No setup needed.', labelAfter: 'USER HAS SEEN THE VALUE' },
              { title: 'Integration', subtitle: 'User decides to connect their store', mobileAnnotation: 'INITIALLY AFTER SIGNUP' },
              { title: 'AHA moment', subtitle: 'User sees their first order driven by edrone' },
            ],
            arc: { fromStep: 1, toStep: 3, label: 'INITIAL PROCESS' },
            caption: 'The final activation path. Value demonstrated before any commitment.',
          },
          {
            kind: 'text',
            content: 'Users create an account, AI generates branded content from their store URL: newsletters, automations, pop-ups ready to send on arrival. Everything is on by default: 7 automations, popup, and identification sequence active from day one. I started with nothing enabled and tested increments until activation stopped improving. The free tier is capped at 500 messages: the minimum for a user to reach their first attributed order. Integration comes last because connecting a store means sharing contacts and product data. Users make that decision after seeing what edrone does.',
          },
          {
            kind: 'demo',
            demo: 'freemium',
            caption: 'The shipped onboarding: four steps of one walkthrough, everything already on.',
          },
          {
            kind: 'text',
            content: 'I set the NSM as **time to first attributed order.** That is when users see real revenue and the upgrade decision forms.',
          },
          {
            kind: 'text',
            content: 'Developers built the foundation from May. From December, I used Codex to build improvements and fixes across the frontend, with partial support from a frontend and backend developer.',
          },
        ],
      },
    ],
    results: {
      note: "Freemium's north star metric. Shortening newsletter delivery from **13 to 1 day** was a major contributor. Newsletters generate orders, and the earlier they go out, the faster users see ROI.",
      northStar: {
        label: 'TIME TO FIRST ATTRIBUTED ORDER',
        value: '44 → 5 days',
      },
      metrics: [
        { value: '+4600', label: 'TOTAL NEW USERS', color: 'accent', description: '78% were active users, integrated with 5+ automations running.' },
        { value: '8.4%', label: 'PAID CONVERSION', color: 'accent', description: '~400 paying customers, adding **16%** to edrone\'s paid base built over 10 years. Industry average for freemium SaaS is **2–5%**.' },
      ],
    },
    reflections: [],
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
      date: '2026',
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
      date: '2026',
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
      date: '2022–2024',
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
