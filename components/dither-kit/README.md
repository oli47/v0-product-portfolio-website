# dither-kit — local patches

Installed with `npx @dither-kit/cli add bar-chart`. These files are vendored, so
they are ours to edit, but **`@dither-kit/cli update` will overwrite them** and
silently undo the first patch below. Re-apply after any update.

## 1. React 19 context JSX → `.Provider` (breaks the build without it)

Upstream writes `<SomeContext value={…}>`, which is React 19 only. This app is on
React 18.3, where that is not a valid component: the page 500s and `tsc` reports
`TS2604: JSX element type 'ChartContext' does not have any construct or call
signatures`.

Patched in `bar.tsx`, `area.tsx`, `cartesian-root.tsx`, `polar-root.tsx` —
every `<XContext value=…>` / `</XContext>` rewritten to `<XContext.Provider …>`.

`dither-kit add` (not just `update`) re-triggers this on any shared file the
new component pulls in — installing `area-chart` after `bar-chart` silently
reverted `cartesian-root.tsx`/`polar-root.tsx` (this patch) and six more
shared files (patch 4 below), none of it mentioned in the install's own
output. Diff `git status`/`git diff` on this whole directory after any
`add`, not just `update`.

## 2. Series colour comes from `--accent`, not from `PALETTE`

`seedOfColor` resolves a series through a static `PALETTE` keyed by name, so the
colour cannot follow the site's theme on its own. Worse, the stock `orange`
(`#FF9632`) contrasts **2.12:1** against the light surface, under the 3:1 floor
for a chart mark.

`components/cohort-chart.tsx` reads `--accent` at runtime and rewrites
`PALETTE.orange`, keyed on `resolvedTheme`, then hands the chart a fresh `config`
object — the chart memoises its colour lookup on `config` identity, so a new
object is what makes the repaint happen. `--accent` clears 3:1 in both themes.

`palette.ts` itself is unmodified.

## 3. Tooltip needs `--color-popover` mapped into `@theme`

The tooltip is styled `bg-popover` / `text-popover-foreground`. Those utilities
compile to nothing unless the token is exposed in Tailwind's colour namespace, and
the panel renders fully transparent. `app/globals.css` now maps
`--color-popover` and `--color-popover-foreground` in `@theme inline`.

`tooltip.tsx` also carries `w-max whitespace-nowrap`: the panel is positioned
against the hovered mark, so without it the label wrapped or not depending on how
close that mark sat to the chart edge.

## 4. Chart chrome text in `text-eyebrow`, not upstream's `font-mono`

Upstream sets every axis tick, legend entry, tooltip row, and reference-line
label in a generic `font-mono text-[10px]`/`text-[11px]`. Swapped for the
site's own `.text-eyebrow` (PPNeueBit) so a chart's numbers read in the same
type as everything else on the page instead of a mismatched system-mono font.

Patched in `x-axis.tsx`, `y-axis.tsx`, `legend.tsx`, `block-legend.tsx`,
`reference-line.tsx`, `tooltip.tsx` (the last two rows above are also this
file). `dot.tsx`'s `var(--card, var(--bg-card))` fallback is the same idea
for a colour rather than type — upstream hardcodes `var(--card, #0b0b0c)`,
which is a dark-mode value baked in regardless of theme.

## 5. `Tooltip` gains `forceIndex` and `order` (site-specific, no upstream equivalent)

`breakdown-chart.tsx`'s two-point growth curve stacks mobile under desktop (so
the smaller, faster-growing channel reads as a thin band becoming a real one)
but *lists* desktop above mobile in the tooltip — the stack order and the
config key order are the same thing upstream (`configKeys` drives both), so
listing them differently needs an explicit override. It also only wants the
tooltip to ever show the "after" point's story, not reshape into a bare
"before" reading as the cursor crosses into that half of the chart.

`forceIndex` pins tooltip *content* to one row regardless of which point the
cursor is nearest (show/hide and position still track the real hover).
`order` re-sorts the rendered rows by dataKey, independent of `config`'s own
key order. Both optional, both no-ops when omitted — safe for `cohort-chart.tsx`'s
existing single-series use.

`valueFormatter`'s return type is widened from `string` to `ReactNode` for the
same reason: a growth annotation next to the rate (`(+100%) 2%`) wants the
parenthetical in a lighter colour than the bold value, which a plain string
can't carry. A formatter that still returns a string works exactly as before.

## 6. `cartesian-canvas.tsx`'s loop refs are never actually null

`startCartesianLoop`'s `state`/`targets`/`stars` params are typed
`RefObject<T>` — `.current: T | null` in this app's React 18 types — but
every ref handed in is created `useRef(ctx)`/`useRef(targets)`/`useRef(stars)`
(a non-null initial value), never `useRef(null)`. That made every
`.current` read fail strict-null-check (~40 sites). Retyped the three
fields to `MutableRefObject<T>` (`.current: T`) instead of asserting `!` at
each one.
