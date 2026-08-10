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

/**
 * `READY` is the stage that is *running*, not the count of finished ones.
 *
 * It used to be the count, set to `i + 1` before the hold — which meant every
 * picture was on screen during the wait belonging to the stage after it. Stage
 * one got the 500ms lead-in and nothing else, less than the 420ms its own
 * entrance animation takes, and the last stage got two waits instead of one and
 * sat there for four and a half seconds. Four stages, four equal holds.
 */
const SCRIPT: Step[] = [
  ...SETUP_ITEMS.flatMap((_, i): Step[] => [
    { kind: 'set',  field: READY, text: String(i) },
    { kind: 'wait', ms: STAGE_MS },
  ]),
  // Then all four finished: the stepper fills to the end and the last picture
  // holds, so the finished state is a place the demo arrives at rather than a
  // frame it passes through on its way back to the beginning. Shorter than a
  // stage, because the picture does not change here — only the stepper does,
  // and a full stage of it left the last photographs on screen for twice as
  // long as any of the three before them.
  { kind: 'set',  field: READY, text: String(SETUP_ITEMS.length) },
  { kind: 'wait', ms: Math.round(STAGE_MS * 0.6) },
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
            automations={AUTOMATIONS}
            done={Number(state.values[READY] ?? 0)}
            m={m}
          />
        </div>
      )}
    </DemoFrame>
  )
}
