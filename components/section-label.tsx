interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    // eyebrow: 12/160
    <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-caption leading-[160%] mb-6">
      {children}
    </h2>
  )
}
