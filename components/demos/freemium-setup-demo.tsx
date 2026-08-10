'use client'

import { DemoFrame, type DemoProps } from '@/components/demos/demo-frame'
import { C, TYPEFACE } from '@/components/demos/edrone-tokens'
import { AUTOMATIONS, SETUP_ITEMS } from '@/components/demos/freemium-demo'
import { metricsFor, PreparingScreen } from '@/components/demos/freemium-ui'
import type { DemoState, Step } from '@/components/demos/use-demo-script'

/**
 * Account creation on its own, at the length it deserves.
 *
 * The full walkthrough opens on this beat and then leaves it, because there are
 * four screens after it and a reader waiting through seven stages before the
 * first one would give up. But the Solution section makes a claim about exactly
 * this beat — the store hands over a URL and gets a finished account back — and
 * a still of it cannot show the one thing that matters, which is that all of it
 * happens without anybody choosing anything.
 *
 * So the same screen runs twice on the page at two speeds: compressed inside
 * the walkthrough, and here at a pace where every stage's picture can actually
 * be looked at. Same component, same seven stages, same store; only the timing
 * differs, which is why this file has no UI in it at all.
 */

/** The field the script counts finished stages into. */
const READY = 'ready'

/**
 * Long enough to look at the picture, short enough that the loop comes round.
 *
 * Four stages against the walkthrough's fast pass: there the beat is a door
 * the reader is walking through, here it is the room.
 */
const STAGE_MS = 1800

const SCRIPT: Step[] = [
  { kind: 'set',  field: READY, text: '0' },
  { kind: 'wait', ms: 500 },
  ...SETUP_ITEMS.flatMap((_, i): Step[] => [
    { kind: 'set',  field: READY, text: String(i + 1) },
    // The last one holds through the beat before the loop restarts, so the
    // finished state is a place the demo arrives at rather than a frame it
    // passes through on its way back to the beginning.
    { kind: 'wait', ms: i === SETUP_ITEMS.length - 1 ? STAGE_MS * 1.5 : STAGE_MS },
  ]),
]

/** The poster: nothing built yet, which is where the loop starts anyway. */
const REST: Partial<DemoState> = { screen: 0, values: { [READY]: '0' } }

export function FreemiumSetupDemo(props: DemoProps) {
  return (
    <DemoFrame
      script={SCRIPT}
      restState={REST}
      metrics={metricsFor}
      ink={C.ink}
      typeface={TYPEFACE}
      holdLastFrame
      {...props}
    >
      {(state, m) => (
        <div className="flex h-full w-full items-center justify-center bg-white" style={{ padding: `0 ${m.padX}px` }}>
          <PreparingScreen
            items={SETUP_ITEMS}
            art={AUTOMATIONS.map((a) => a.art)}
            done={Number(state.values[READY] ?? 0)}
            m={m}
          />
        </div>
      )}
    </DemoFrame>
  )
}
