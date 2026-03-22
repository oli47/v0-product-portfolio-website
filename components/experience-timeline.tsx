import { experiences } from '@/lib/experience'

export function ExperienceTimeline() {
  return (
    <div className="relative">
      {experiences.map((exp, index) => (
        <div key={exp.company} className="flex gap-4 md:gap-6">
          {/* Left column: date */}
          <div className="w-[90px] md:w-[110px] shrink-0 text-right pt-0.5">
            <span className="text-[14px] font-medium text-text-caption">
              {exp.dateRange}
            </span>
          </div>

          {/* Timeline line and dot */}
          <div className="relative flex flex-col items-center">
            {/* Dot */}
            <div
              className={`w-[9px] h-[9px] rounded-full shrink-0 mt-1.5 z-10 ${
                exp.isCurrent
                  ? 'bg-foreground'
                  : 'bg-background border-2 border-timeline-dot-border'
              }`}
            />
            {/* Line (only between dots, not extending beyond) */}
            {index < experiences.length - 1 && (
              <div className="w-px bg-timeline-line flex-1 min-h-[60px]" />
            )}
          </div>

          {/* Right column: content */}
          <div className={`flex-1 ${index < experiences.length - 1 ? 'pb-6' : ''}`}>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Logo placeholder */}
              <div className="w-[30px] h-[30px] rounded-[7px] bg-fill-subtle flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-text-caption">
                  {exp.logoText}
                </span>
              </div>

              {/* Company and role */}
              <div className="flex items-center gap-1 flex-wrap">
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] font-semibold text-foreground hover:underline"
                >
                  {exp.company}
                </a>
                <span className="text-[16px] text-text-caption">· {exp.role}</span>
              </div>
            </div>

            {/* Product tags */}
            {exp.products && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {exp.products.map((product) => (
                  <a
                    key={product.name}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-medium text-text-caption bg-fill-subtle px-2.5 py-1 rounded-md transition-colors hover:text-foreground hover:bg-border"
                  >
                    {product.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
