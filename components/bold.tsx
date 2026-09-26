import Image from 'next/image'
import { Fragment } from 'react'
import { noOrphans } from '@/lib/no-orphans'

/** Tools that can sit in copy as `{{key|Name}}`: the logo, then the name,
 *  kept on one line the way the home page keeps its logos with their names.
 *  `dark` is the variant for the dark theme, where the mark needs one. */
const LOGOS: Record<string, { src: string; dark?: string }> = {
  amplitude: { src: '/logos/amplitude.svg', dark: '/logos/amplitude-white.svg' },
  codex: { src: '/logos/codex.svg', dark: '/logos/codex-white.svg' },
  tableau: { src: '/logos/tableau.svg' },
  vitally: { src: '/logos/vitally.webp' },
}

const LOGO_CLASS = 'align-middle mr-1 -mt-0.5'

function Logos({ text }: { text: string }) {
  const parts = text.split(/(\{\{[\w-]+\|[^}]+\}\})/)
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{\{([\w-]+)\|([^}]+)\}\}$/)
        const logo = match && LOGOS[match[1]]
        if (!match || !logo) return <Fragment key={i}>{part}</Fragment>
        return (
          <span key={i} className="whitespace-nowrap">
            <Image src={logo.src} alt="" width={14} height={14} className={`${LOGO_CLASS} ${logo.dark ? 'inline-block dark:hidden' : 'inline-block'}`} />
            {logo.dark && <Image src={logo.dark} alt="" width={14} height={14} className={`${LOGO_CLASS} hidden dark:inline-block`} />}
            {match[2]}
          </span>
        )
      })}
    </>
  )
}

export function Bold({ text }: { text: string }) {
  const parts = noOrphans(text).split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ fontWeight: 'var(--font-weight-bold)' }}><Logos text={part.slice(2, -2)} /></strong>
          : <Logos key={i} text={part} />
      )}
    </>
  )
}
