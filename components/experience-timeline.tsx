import Image from 'next/image'
import { experiences } from '@/lib/experience'

export function ExperienceTimeline() {
  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.company} className="flex items-center gap-4">
          {/* Date - body-2: 14/160 */}
          <div className="w-[90px] shrink-0">
            <span className="text-[14px] text-text-caption leading-[160%]">
              {exp.dateRange}
            </span>
          </div>

          {/* Logo */}
          <div className="w-[32px] h-[32px] rounded-[8px] overflow-hidden shrink-0 flex items-center justify-center bg-fill-subtle">
            {exp.logo ? (
              <Image
                src={exp.logo}
                alt={exp.company}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-medium text-text-caption">
                {exp.company.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Company and role - body-1: 16/160 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[16px] text-foreground leading-[160%]">
              {exp.company}
            </span>
            <span className="text-[16px] text-text-caption leading-[160%]">·</span>
            <span className="text-[16px] font-semibold text-foreground leading-[160%]">
              {exp.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
