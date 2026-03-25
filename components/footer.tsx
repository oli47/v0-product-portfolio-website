export function Footer() {
  return (
    <footer className="py-12 text-center">
      {/* Line 1 - body-2: 14/160 */}
      <p className="text-[14px] text-text-caption leading-[160%] mb-3">
        Olaf Otrząsek · Senior Product Designer
      </p>
      {/* Line 2 - body-2: 14/160 */}
      <div className="flex items-center justify-center gap-2 text-[14px] text-text-caption leading-[160%] flex-wrap">
        <span>Built with Claude & v0.dev</span>
        <span>·</span>
        <a
          href="mailto:olafotrzasek@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          olafotrzasek@gmail.com
        </a>
        <span>·</span>
        <a
          href="https://www.linkedin.com/in/olafotrzasek/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
