import { noOrphans } from '@/lib/no-orphans'

export function Bold({ text }: { text: string }) {
  const parts = noOrphans(text).split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 'var(--font-weight-bold)' }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
  )
}
