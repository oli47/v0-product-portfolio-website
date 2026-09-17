'use client'

import { ScrambleText } from '@/components/scramble-text'

/**
 * The one-sentence claim a project makes, on the home row and under the
 * case-study hero.
 *
 * The sentence carries its own accents: anything inside `[[ ]]` renders in
 * the accent colour. Two per sentence is the ceiling, and the second one is
 * always the number — past that the accent stops meaning "here is the result"
 * and turns into decoration.
 *
 * Splitting on the marker is what lets an accent sit mid-sentence; before
 * this the accent phrase was a separate field and could only be the tail.
 * Each segment scrambles on its own, so the hover decode still runs across
 * the whole line.
 */
export function CardSentence({
  text,
  scramble = false,
  active = false,
}: {
  text: string
  scramble?: boolean
  active?: boolean
}) {
  const segments = text.split(/(\[\[[^\]]*\]\])/g).filter(Boolean)

  return (
    <>
      {segments.map((segment, i) => {
        const accent = segment.startsWith('[[') && segment.endsWith(']]')
        const body = accent ? segment.slice(2, -2) : segment
        const inner = scramble ? <ScrambleText text={body} active={active} /> : body

        return accent ? (
          <span key={i} className="text-[var(--accent)] font-[450]">
            {inner}
          </span>
        ) : (
          <span key={i}>{inner}</span>
        )
      })}
    </>
  )
}
