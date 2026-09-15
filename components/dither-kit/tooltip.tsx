"use client"

import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { useCommonChart } from "./common-context"
import { cn } from "./lib"
import { rgb } from "./palette"

export type TooltipVariant = "default" | "frosted-glass"

const VARIANT: Record<TooltipVariant, string> = {
  default: "bg-popover",
  "frosted-glass": "bg-popover/70 backdrop-blur-sm",
}

/**
 * Floating hover tooltip. Reads the shared common context so it works in every
 * chart family. It glides between points and fades in/out (instead of snapping),
 * and dims unselected series/slices.
 */
export function Tooltip({
  labelKey,
  valueFormatter,
  variant = "default",
  forceIndex,
  order,
}: {
  labelKey?: string
  // PATCHED (site-specific): return type widened from `string` to
  // `ReactNode` — a plain string still works untouched, but a caller that
  // needs part of the value in a different weight/colour (e.g. a muted
  // growth annotation beside the bold rate) can return JSX instead.
  valueFormatter?: (value: number, name: string) => ReactNode
  variant?: TooltipVariant
  // PATCHED (site-specific, not upstream): show/hide and position still
  // follow the real hovered point, but the content pins to this index
  // always — for a chart where only one point's story is worth a tooltip
  // (e.g. a two-point growth curve, where only "after" has a rate to defend),
  // rather than one that reshapes as the cursor crosses each point.
  forceIndex?: number
  // PATCHED (site-specific): row order as an array of series dataKeys.
  // `chart.itemsAt` orders rows by the chart's own `config` key order, which
  // also drives stacking — so a chart that stacks bottom-to-top in one order
  // but wants to *list* top-to-bottom in another needs this to tell them apart.
  order?: string[]
}) {
  const chart = useCommonChart()
  const show = chart.ready && chart.hoverIndex != null

  // Retain the last hovered index so the card keeps its content while fading
  // out — adjust-state-during-render (no refs in render).
  const [lastIndex, setLastIndex] = useState(0)
  if (chart.hoverIndex != null && chart.hoverIndex !== lastIndex) {
    setLastIndex(chart.hoverIndex)
  }
  const index = forceIndex ?? (chart.hoverIndex ?? lastIndex)

  const heading = chart.heading(index, labelKey)
  const itemsAtIndex = chart.itemsAt(index)
  const items = order
    ? order
        .map((name) => itemsAtIndex.find((item) => item.name === name))
        .filter((item): item is (typeof itemsAtIndex)[number] => item != null)
    : itemsAtIndex

  return (
    <AnimatePresence>
      {show && items.length > 0 && (
        <motion.div
          key="dither-tooltip"
          initial={{
            opacity: 0,
            x: "-50%",
            y: "-115%",
            top: chart.tooltipTop,
            left: chart.tooltipLeft,
          }}
          animate={{
            opacity: 1,
            x: "-50%",
            y: "-115%",
            top: chart.tooltipTop,
            left: chart.tooltipLeft,
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 520,
            damping: 38,
            mass: 0.6,
          }}
          className={cn(
            // whitespace-nowrap: the panel is positioned, so without it the
            // label wrapped or not depending on how close the hovered mark sat
            // to the chart edge. The tooltip should be the same shape everywhere.
            "pointer-events-none absolute z-10 w-max whitespace-nowrap rounded-md border px-2 py-1 shadow-sm",
            VARIANT[variant]
          )}
        >
          {heading && (
            <div className="mb-0.5 text-eyebrow text-muted-foreground">
              {heading}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 text-eyebrow text-popover-foreground tabular-nums"
                style={{ opacity: item.dimmed ? 0.4 : 1 }}
              >
                <span
                  className="size-2 rounded-[1px]"
                  style={{ backgroundColor: rgb(item.seed.fill) }}
                />
                <span className="text-muted-foreground">{item.label}</span>
                <span className="ml-auto pl-2 text-foreground">
                  {valueFormatter
                    ? valueFormatter(item.value, item.name)
                    : item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

Tooltip.chartLayer = "dom" as const
