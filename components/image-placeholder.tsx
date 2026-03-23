import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImagePlaceholderProps {
  height?: number
  className?: string
  label?: string
  src?: string
  alt?: string
}

export function ImagePlaceholder({
  height = 320,
  className,
  label = 'image placeholder',
  src,
  alt,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <figure className={cn('w-full', className)}>
        <div className={cn('relative w-full overflow-hidden rounded-[10px] border border-border')} style={{ height }}>
          <Image
            src={src}
            alt={alt || label}
            fill
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {label && (
          <figcaption className="text-[14px] font-medium text-text-caption mt-3">
            {label}
          </figcaption>
        )}
      </figure>
    )
  }

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

interface ImageRowProps {
  images?: Array<{ src: string; label: string; alt?: string }>
}

export function ImageRow({ images }: ImageRowProps) {
  if (images && images.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <ImagePlaceholder
            key={idx}
            height={300}
            src={img.src}
            label={img.label}
            alt={img.alt || img.label}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImagePlaceholder height={240} />
      <ImagePlaceholder height={240} />
    </div>
  )
}
