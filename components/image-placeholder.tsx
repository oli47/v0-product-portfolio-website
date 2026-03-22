import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  height?: number
  className?: string
  label?: string
}

export function ImagePlaceholder({
  height = 320,
  className,
  label = 'image placeholder',
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full bg-fill-subtle rounded-[10px] flex items-center justify-center',
        className
      )}
      style={{ height }}
    >
      <span className="text-[14px] font-medium text-text-caption">{label}</span>
    </div>
  )
}

export function ImageRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImagePlaceholder height={240} />
      <ImagePlaceholder height={240} />
    </div>
  )
}
