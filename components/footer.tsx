import { DitherWave } from '@/components/dither-wave'

// The dither band runs the full width of the viewport and ends at the bottom
// edge of the page — it *is* the footer rule now, so there is no border-t.
export function Footer() {
  return (
    <footer>
      {/* The band is pulled up past the row's bottom padding, so the type sits
          16px inside it. That only works because the crest is ceilinged at 16px
          from the band's top edge (see CEILING) — and 16px is the *box* bottom;
          half-leading puts the glyphs themselves a few px higher still, ogonek
          included. */}
      <div className="max-w-[var(--measure)] mx-auto px-5 pt-10 pb-4 flex items-center justify-between">
        <p className="font-mono text-[0.75rem] font-medium uppercase leading-[1.25rem] text-[var(--color-300)]">
          <span className="font-display text-[1.25rem] leading-[1.25rem] align-middle text-[var(--accent)]">©</span> 2026 Olaf Otrząsek
        </p>
        <p className="font-mono text-[0.75rem] font-medium uppercase leading-[1.25rem] text-[var(--color-300)]">
          Built with Claude Code <span className="font-display text-[1.25rem] leading-[1.25rem] align-middle text-[var(--accent)]">✨</span>
        </p>
      </div>
      <DitherWave height={160} className="-mt-8" />
    </footer>
  )
}
