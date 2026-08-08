# dither-kit — local patches

Installed with `npx @dither-kit/cli add bar-chart`. These files are vendored, so
they are ours to edit, but **`@dither-kit/cli update` will overwrite them** and
silently undo the first patch below. Re-apply after any update.

## 1. React 19 context JSX → `.Provider` (breaks the build without it)

Upstream writes `<SomeContext value={…}>`, which is React 19 only. This app is on
React 18.3, where that is not a valid component: the page 500s and `tsc` reports
`TS2604: JSX element type 'ChartContext' does not have any construct or call
signatures`.

Patched in `bar.tsx`, `cartesian-root.tsx`, `polar-root.tsx` — every
`<XContext value=…>` / `</XContext>` rewritten to `<XContext.Provider …>`.

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
