export function Footer() {
  return (
    <footer className="py-12 text-center">
      <p className="text-[14px] font-medium text-text-caption mb-2">
        Olaf Otrząsek · Senior Product Designer
      </p>
      <div className="flex items-center justify-center gap-4 text-[14px] font-medium text-text-caption">
        <a
          href="https://www.linkedin.com/in/olafotrzasek/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline transition-colors"
        >
          LinkedIn
        </a>
        <span>·</span>
        <a
          href="https://dribbble.com/olvsky"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline transition-colors"
        >
          Dribbble
        </a>
        <span>·</span>
        <a
          href="mailto:olafotrzasek@gmail.com"
          className="hover:text-foreground hover:underline transition-colors"
        >
          olafotrzasek@gmail.com
        </a>
      </div>
    </footer>
  )
}
