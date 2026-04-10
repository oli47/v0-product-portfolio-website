interface SectionBadgeProps {
  children: React.ReactNode
}

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div 
      className="inline-block px-0 py-1.5 text-[11px] font-mono uppercase tracking-wider text-foreground mb-6"
      style={{ borderBottom: '1px solid var(--accent)' }}
    >
      {children}
    </div>
  )
}
