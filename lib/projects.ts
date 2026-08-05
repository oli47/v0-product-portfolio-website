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
    tagline: 'From sales-gated to self-serve. 4657 accounts in 10 months.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model I built alongside it.",
    metrics: [
      { value: '8.4%', label: 'FREE TO PAID', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end dev, 1 Back-end dev',
      duration: '10 months',
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
            content: 'edrone is a marketing automation CRM for ecommerce. Automated messages and newsletters bring shoppers back to finish the orders they abandoned, and stores pay by the size of the contact base they keep there.',
          },
          {
            kind: 'text',
            content: 'For ten years edrone sold one way only. Every customer arrived through Sales: a demo, a contract, then onboarding led by Support. Nobody used the product themselves before signing for it, and no self-serve path existed.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: 'GA showed around 25,000 unique visitors a month. Sales was closing 60 to 100 new customers out of them, at an acquisition cost of roughly 4,000 PLN each, so almost all of that traffic left without ever entering the funnel. Self-serve was already standard in the category. I had been edrone\'s only designer for two years, and I took the case for a freemium channel to the CTO across months of conversations, until he brought in the CEO and COO and gave it a green light.',
          },
          {
            kind: 'text',
            content: 'I set the north star as time to first attributed order. Signups alone would have made the channel look successful by month two. **Time to first attributed order was the only number that would say whether the free tier was doing its job,** and it is the number that later set the size of that tier.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'Freemium launched May 2025. Two Support people the CSO allocated to me ran most of the research: around thirty interviews with fresh signups spread across the project, alongside internal sessions with Support\'s onboarding and success teams. Three versions of the onboarding reached production over the ten months.',
          },
          {
            kind: 'text',
            content: '**The vast majority of users reaching edrone were small, one-person stores.** No time, no marketing automation experience, no idea whether it would pay off. They could not spend hours understanding, configuring or learning a tool.',
          },
          {
            kind: 'text',
            content: 'The first version asked them to do exactly that. It opened on store integration, then handed over a builder and a list of steps to follow.',
          },
          {
            kind: 'text',
            content: 'Nothing in that version was broken. It shipped, it worked, and it asked more of a new store than a new store would give. What I spent the ten months looking for was not faults but leverage, and it kept returning to the same four places.',
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'OPPORTUNITY 1',
                title: 'Setup was the price of entry',
                description: 'Every route to value started with the user building something: an integration, a pop-up, a campaign. A one-person store has no hours to spend proving that a tool might work.',
              },
              {
                num: 'OPPORTUNITY 2',
                title: 'An empty product proves nothing',
                description: 'With nothing switched on, a new account showed features rather than results. The user had to imagine the value instead of seeing it happen in their own store.',
              },
              {
                num: 'OPPORTUNITY 3',
                title: 'Integration asks a stranger for everything',
                description: 'Connecting a store hands over its contacts and its product data. It was the first screen, before edrone had shown anything in return.',
              },
              {
                num: 'OPPORTUNITY 4',
                title: 'A free tier has two ways to fail',
                description: 'Too small and the user never reaches proof. Too large and the upgrade never has to happen. The business wanted the cap set low.',
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
            content: 'Signup now generates the content instead of asking for it. From the store URL, edrone writes branded newsletters, automations and a subscriber pop-up, reading the store\'s own logo, colours, type and product photography. Nothing is waiting to be built when the user arrives. Reading products off the storefront rather than the store backend is what made this work before any integration existed.',
          },
          {
            kind: 'text',
            content: 'Everything ships switched on. I started with two automations and a pop-up, went to three, then five, then seven, measuring activation at each step. **No step made it worse, and past seven it stopped getting better,** so seven is where it stayed.',
          },
          {
            kind: 'text',
            content: 'Integration moved to the end. The business wanted it first, because an integrated store is a committed one and its real product feed makes better content. Both of those are true, but products can be read off the storefront, so at that position integration was buying the commitment and nothing else. My argument was that asking a stranger for their contacts and product data before showing them anything inverts the order of trust. If I had that wrong, fewer accounts would end up integrated with automations running.',
          },
          {
            kind: 'vertical-flow',
            steps: [
              { title: 'Signup', subtitle: 'User creates an account' },
              { title: 'AI content', subtitle: "User sees their store's branded content ready to go", labelAfter: 'AHA MOMENT' },
              { title: 'Activation', subtitle: 'User reviews what is already on. No setup needed.' },
              { title: 'Integration', subtitle: 'User decides to connect their store' },
              { title: 'First order', subtitle: 'User sees their first order driven by edrone' },
            ],
            caption: 'The final activation path. Value demonstrated before any commitment.',
          },
          {
            kind: 'text',
            content: 'The free tier is capped at 500 messages a month. It meters a quota rather than walling off features, so nothing in the product is hidden from a free store and what runs out is the sending. I worked the number out in two steps: how many messages it takes to generate one order attributed to edrone under a pessimistic conversion assumption, then how many of those orders a store needs before paying for edrone returns more than it costs. **Five hundred is the smallest number that clears both.** The business had asked for 200, which would have held down the cost of a free user and pushed the upgrade sooner, but would have stopped most stores short of the proof they came for.',
          },
          {
            kind: 'text',
            content: 'What happens at the limit was mine as well. A meter in the menu shows how much of the month is left, a short series of messages goes out through Intercom as the store gets close, and the banner to upgrade holds until the allowance is actually spent. I made the upgrade a drawer asking how many contacts the store wants to bring across, because **the free tier meters what a store sends while the paid plan prices what it keeps.**',
          },
          {
            kind: 'demo',
            demo: 'freemium',
            caption: 'The shipped onboarding. Setup runs while the account is being created, and everything is already on by the time the user arrives.',
          },
          {
            kind: 'text',
            content: 'I did not push back on everything. I also took direction on features I had not validated, built them, and watched them move nothing.',
          },
          {
            kind: 'text',
            content: 'The company now had two ways to acquire a customer. One took a sales cycle and roughly 4,000 PLN every time. The other took ten months to build and then ran at the cost of the free tier.',
          },
          {
            kind: 'text',
            content: 'Developers built the foundation from May. From December I built improvements and fixes across the frontend myself in Codex, somewhere between thirty and forty releases, while the developers handled the backend and the changes with the widest blast radius. Pricing of the paid plan, positioning and campaigns were not mine.',
          },
        ],
      },
    ],
    results: {
      note: "Freemium's north star, measured as a median. Shortening newsletter delivery from **13 to 1 day** was the largest contributor. Newsletters generate the orders, so the earlier they go out, the sooner a store sees a return.",
      northStar: {
        label: 'TIME TO FIRST ATTRIBUTED ORDER',
        value: '44 → 5 days',
      },
      metrics: [
        { value: '78%', label: 'ACTIVE ACCOUNTS', color: 'accent', description: 'An integrated store with five or more automations running. Integration was the last step in the flow, so this is the number that would have fallen if the business had been right to want it first.' },
        { value: '8.4%', label: 'FREE TO PAID', color: 'accent', description: 'Roughly 390 paying customers against every account created across the ten months. The 2026 ChartMogul and ProductLed survey of 200 self-serve products puts good freemium conversion at 3–5% and great at **8–12%**, measured on six-month signup cohorts rather than a cumulative window like this one.' },
      ],
    },
    reflections: [
      'Removing the sales call moved every question it used to absorb onto Support, and the onboarding answered fewer of them than it should have. We never instrumented a counter-metric for it, which is the first thing I would fix. What the flow needed was an assistant that could explain what was running and why, in the product, at the moment the question formed. Coach marks put words on the screen but cannot answer anything back.',
      'Around thirty interviews across ten months was too few for a channel this size, and it left me short of evidence at the moments I needed it most. More of the calls I made in that period rested on what the two of us in Support had heard most recently than I would like.',
      'The piece I would push hardest with more room is generating content with AI at a larger scale, for every user. It removed more work from the user than anything else in the flow, and it stayed narrower than it needed to be.',
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
