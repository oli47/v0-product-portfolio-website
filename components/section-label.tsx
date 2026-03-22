interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <h2 className="text-[14px] font-medium uppercase tracking-[0.08em] text-text-caption mb-6">
      {children}
    </h2>
  )
}
