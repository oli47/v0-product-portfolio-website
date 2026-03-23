export function Footer() {
  return (
    <footer className="py-12 text-center">
      {/* Name line - body-2: 14/160 */}
      <p className="text-[14px] text-text-caption leading-[160%] mb-3">
        Olaf Otrząsek · Senior Product Designer
      </p>
      {/* Links - body-2: 14/160 */}
      <div className="flex items-center justify-center gap-2 text-[14px] text-text-caption leading-[160%]">
        <a
          href="https://www.linkedin.com/in/olafotrzasek/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
        <span>·</span>
        <a
          href="https://dribbble.com/olvsky"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Dribbble
        </a>
        <span>·</span>
        <a
          href="mailto:olafotrzasek@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          olafotrzasek@gmail.com
        </a>
      </div>
    </footer>
  )
}
