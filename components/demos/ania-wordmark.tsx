/**
 * The ANIA KRUK logotype.
 *
 * A CSS mask over a coloured box rather than inline paths: the artwork is one
 * flat shape, so the mask carries it and `background` carries the tint, which
 * is the same `currentColor` trick the inline version needed — without putting
 * six kilobytes of path data into the bundle that every page importing the demo
 * registry has to download.
 *
 * The file is the supplied vector, unedited. If it ever needs updating, replace
 * `public/logos/ania-kruk.svg` and leave this alone.
 */
const SRC = 'url(/logos/ania-kruk.svg)'

/** The artwork's own proportions, so a height is all a caller has to pick. */
const RATIO = 818 / 544

export const AniaWordmark = ({ height }: { height: number }) => (
  <span
    aria-hidden
    className="block shrink-0"
    style={{
      width: Math.round(height * RATIO),
      height,
      background: 'currentColor',
      maskImage: SRC,
      WebkitMaskImage: SRC,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
)
