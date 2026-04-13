interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <div
      className={`inline-block px-0 py-1.5 text-[11px] font-mono uppercase tracking-wider text-foreground mb-6${className ? ` ${className}` : ''}`}
      style={{ borderBottom: '1px solid var(--accent)' }}
    >
      {children}
    </div>
  )
}
