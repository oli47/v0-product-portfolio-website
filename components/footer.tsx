export function Footer() {
  return (
    <footer>
      <div className="max-w-[var(--measure)] mx-auto px-5">
        <div className="py-10 flex items-center justify-between">
          <p className="text-eyebrow text-[var(--color-300)]">
            <span className="font-display text-[1.25rem] leading-[1.25rem] align-middle text-[var(--accent)]">©</span> 2026 Olaf Otrząsek
          </p>
          <p className="text-eyebrow text-[var(--color-300)]">
            Built with Claude Code <span className="font-display text-[1.25rem] leading-[1.25rem] align-middle text-[var(--accent)]">✨</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
