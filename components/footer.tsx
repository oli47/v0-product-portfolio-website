export function Footer() {
  return (
    <footer className="py-12 text-center">
      {/* Name line - body-2: 14/160 */}
      <p className="text-[14px] text-text-caption leading-[160%] mb-3">
        Olaf Otrząsek · Senior Product Designer
      </p>
      {/* Links - body-2: 14/160 */}
      <div className="flex items-center justify-center gap-2 text-[14px] text-text-caption leading-[160%] flex-wrap">
        <a
          href="mailto:olafotrzasek@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          olafotrzasek@gmail.com
        </a>
        <span>·</span>
        <a
          href="tel:+48732188613"
          className="hover:text-foreground transition-colors"
        >
          732 188 613
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
        <span>·</span>
        <a
          href="/olaf-otrzasek-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Resume
        </a>
      </div>
    </footer>
  )
}
