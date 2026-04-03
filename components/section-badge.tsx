interface SectionBadgeProps {
  children: React.ReactNode
}

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div className="inline-block px-3 py-1.5 bg-card border border-border-md rounded-sm text-[11px] font-mono uppercase tracking-wider text-foreground mb-6">
      {children}
    </div>
  )
}
