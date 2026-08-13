# Case study section pattern

Derived from `signup-redesign` (July 2026). Every rule below is one mistake that
was actually made and fixed in that case study, not a general principle.

Order: **Context → Goal → Approach → Solution → Impact → Reflections**

Sections live in `project.sections` as `{ badge, blocks }`. Impact renders from
`results`, Reflections from `reflections` — both outside `sections`.
`components/section-nav.tsx` builds the left-margin scroll-spy from the badges,
so section names double as the table of contents. A badge that reads badly in a
5-word nav list reads badly as a section title.

---

## Context

**Purpose:** tell a reader who has never heard of the product what it is and what
world it operates in, so that nothing further down needs a footnote.

**Belongs**
- What the product does, in plain language, including how the business makes money.
- The structural fact that makes this project possible or necessary. ("For ten
  years edrone sold one way only, through Sales. Freemium was the company's first
  product-led channel, and this work landed four months into it.")
- Split into short paragraphs. One paragraph for the product, one for the situation.

**Does not belong**
- Metrics. The baseline belongs to Goal.
- The problem, your role, or anything you did.

**Typical mistake:** naming the category and stopping. "A marketing automation CRM
for ecommerce" tells a hiring manager nothing. Say what it does for whom and where
the revenue comes from. Second mistake: opening with the baseline number, which
makes Context read like a results section.

---

## Goal

**Purpose:** state what was supposed to improve, how bad it was, and why it was
worth your time rather than someone else's.

**Belongs**
- The target metric defined precisely. Not "signups" but "unique visitors who
  ended up with a created account".
- The baseline, and an external benchmark if one exists ("against a 2–3% market
  standard").
- Where in the funnel the loss sat, with the funnel described well enough that the
  location means something.
- The leverage argument: why this step and not another. ("Signup was its first
  step, which meant everything lost there was lost again at every step below it.")
- How you came to own it.

**Does not belong**
- The diagnosis. Why it was broken is Approach.
- Anything you only learned later.

**Typical mistake:** a goal phrased as a verb ("improve signup conversion") instead
of a number with a definition. If the metric is not defined, the Impact number
cannot be checked, and a senior reader will assume it was chosen after the fact.

---

## Approach

**Purpose:** show how you located the cause, and that the judgment was yours.

**Belongs**
- The order of evidence, stated explicitly. Quantitative first to find *where*,
  qualitative second to find *why*.
- Your own hypotheses before any tool. ("That gave me a short list of what I
  thought was wrong.")
- Tools in one sentence each, framed as verification: "I used the agent to test my
  own hypotheses rather than to produce them."
- The named problems as a discrete list (`decisions` block), one problem per card,
  stacked vertically.

**Does not belong**
- Fixes, decisions, or negotiations. Those are Solution.
- How a tool works in general, or where else you have used it. That is a different
  case study.
- Caveats about measurement quality. Those are Reflections.

**Typical mistake:** letting the tool be the protagonist. The first draft opened
"To find out what was wrong with the form I used a UX agent", which reads as though
the agent did the thinking and you executed. Second mistake: putting the resolution
inside the problem statement. `PROBLEM 1` originally contained the whole COO
negotiation and its outcome. A problem card states the problem and stops.

---

## Solution

**Purpose:** show what shipped and, for every problem named in Approach, what
happened to it.

**Belongs**
- One beat per named problem, each one closed. If Approach names three, Solution
  resolves three.
- The non-obvious choice, with the obvious alternative you rejected stated first.
  ("The obvious fix was removing the phone number… Then I went further and split
  the form.")
- The reasoning that makes a counter-intuitive move work. ("More steps normally
  means less conversion, but here it worked. Anyone who drops out of step 2 already
  has an account.")
- Who built what, and how long it took.
- The `compare` or `image` block placed where it explains the most, which is usually
  *inside* the reasoning, not after it.

**Does not belong**
- Problems that were never named upstream.
- Metrics or results.

**Typical mistake:** naming three problems and visibly solving one. The draft
described the form split in detail and left the phone field and the SSO fix to be
inferred, so the strongest scene in the case study (an exec reversing a decision)
ended without a shown outcome.

---

## Impact

**Purpose:** give the number that moved and pre-empt the obvious attack on it.

**Belongs**
- One headline number, short enough to read as a single glyph: `+200%`, `95%`,
  `44 → 5 days`.
- The before → after range in the `note`, not in the value.
- A defence metric: something that did **not** get worse, proving you did not buy
  the win. ("Conversion on to an integrated store did not move, so the extra
  signups were no worse than the ones before.")
- One supporting metric that isolates the mechanism rather than restating the
  headline. `STEP 1 CONVERSION +270%` proves the form was the constraint; a second
  view of total conversion proves nothing new.
- The same card component for every metric, so nothing looks more important than
  the hierarchy intends.

**Does not belong**
- Rates and volumes side by side. Pick one unit.
- A benchmark already stated in Goal.
- Hedges about instrumentation.

**Typical mistakes**
1. **A long string in the big number slot.** `0.75% → 1.25%` at `clamp(2.5rem, 8vw,
   3.5rem)` in a half-width card wraps and becomes unreadable. Put the delta in the
   value and the range in the note.
2. **Two numbers that imply different things.** A rate change and a volume change
   must agree. `+200%` (rate) and `+56%` (348 → 545 accounts) do not, because they
   imply traffic halved. One of them has to go.
3. **A blend outside its own components.** A weighted average always lies between
   its parts. A total of 1.25% cannot come from desktop 2% and mobile 3% at any
   traffic split. If the total sits outside the range, one of the three numbers is
   wrong.

**Before publishing any rate, divide.** Volume ÷ traffic must reproduce the rate,
and a deeper funnel step can never show a higher rate than a shallower one.

---

## Reflections

**Purpose:** show the judgment you would apply next time, at the price of admitting
what you traded away.

**Belongs**
- The trade you made knowingly, and the constraint that forced it.
- What you would do differently with more room.
- Plain paragraphs, same type style as body copy.

**Does not belong**
- Anything that undermines a number you just published.
- Status updates. "It is still live" is an Impact note.
- The same admission twice in different words.

**Typical mistake:** a reflection that disarms your own Impact. One draft said the
device-level numbers "never fully reconciled" three screens below a metric
described as the one that isolates the form. Either trust the number or do not
publish it. Second mistake: bold titles on every reflection, which turns an
admission into a performance.

---

## Rules that cross all sections

- **Bold marks the insight or the number, never your own contribution.** Bolding
  "The COO pushed back" reads as a junior boasting about beating an exec. Aim for
  four to six bold spans in a whole case study.
- **No em dashes.**
- **One number, one place.** If "five hours" is in the description, it does not
  also
  need to be in the meta row and the Solution.
- **Do not start a paragraph or a note with a digit.**
- **Every number gets divided before it ships.** See Impact.
- **A field that nothing renders should be deleted, not filled in.** `results.headline`
  sat populated in four projects and was never displayed.

---

## Known bias in this pattern

It was derived from a five-hour, heavily quantitative project with a clean
before/after.

**`freemium-activation` was the test case, and it passed.** Ten months, qualitative
research, iterative, and the two things this doc predicted would break did not:

- `Goal` survived without a funnel baseline. The baseline it uses is the *alternative*:
  25,000 monthly visitors with no path to the product, against Sales closing 60 to 100
  customers a month at roughly 4,000 PLN each. A goal can be anchored to what the
  company was already paying rather than to a conversion rate.
- The pairing survived a project that was iteration rather than diagnosis. Nothing
  in freemium ever broke; the designer was hunting for leverage on a metric, not
  for faults. Its Approach cards are `PROBLEM 1–2` in the current copy, but each
  one reads as a decision about leverage rather than a discovered fault.

  **Use `PROBLEM` only when the project really was a diagnosis.** `signup-redesign`
  found faults, so its cards are problems. Forcing that label onto optimisation work
  puts a mode of working into the designer's mouth that they cannot defend when asked
  how they found them.

Two adjustments the rewrite forced, both worth keeping:

- **Approach's "quantitative first, qualitative second" does invert here**, and that is
  fine. The order of evidence is a claim about how you worked, not a rule.
- **A defence metric is not always available.** Freemium has none: Support's workload
  went up, and no counter-metric was ever collected. Naming the cost in Reflections
  does more for credibility than an omission does, because it is the first thing a
  reader suspects. Prefer an admitted cost to a missing defence.

**Still open: `plo-genius`** — two years, no conversion metrics, no baseline and no
benchmark. Impact has no before/after and therefore nowhere to hang either a defence
metric or an admitted cost. It is the only case study still running four sections.
