'use client'

/**
 * The edrone product palette and the wrapper every demo screen sits in.
 *
 * This is the app's design language, not the portfolio's, so it deliberately
 * sits outside the tokens in globals.css. It is shared rather than per-demo
 * because the signup form and the contacts dashboard are the same product:
 * one ink, one border grey, one yellow.
 */

export const C = {
  ink:      '#050505',
  body:     '#545454',
  /** The app's one muted grey: input placeholders, and the fraction digits a
   *  dashboard metric sets back from its integer. */
  muted:    '#A3A3A3',
  border:   '#E5E5E5',
  focus:    '#006CFA',
  yellow:   '#FFFF8C',
  surface:  '#FAFAFA',

  /**
   * Status ramp. Every state in the product is a fill / mark / ink triple: a
   * tinted chip or icon tile, the glyph drawn on it, and the text that reads on
   * the tint. Sampled from ci-dashboard.png (commit 3cead12), a 1x export.
   */
  mint:       '#D3F8E2',
  mintMark:   '#24A850',
  mintInk:    '#06471B',
  blue:       '#E0EEFF',
  blueMark:   '#006CFA',
  blueInk:    '#0A3266',
  amber:      '#FFF1CE',
  amberMark:  '#FFBA08',
  amberInk:   '#997005',
  orange:     '#FFE0CD',
  orangeMark: '#FF6206',
  orangeInk:  '#CC4E05',
  red:        '#FCE3E3',
  redMark:    '#E50000',
  redInk:     '#B70000',
  grey:       '#F2F2F2',
  greyInk:    '#313131',

  /** Near-white panel the sequence flow sits on, inside the mint card. */
  panel:     '#FBFEFC',
  /** The 2px rule that joins one step of a sequence to the next. */
  connector: '#F0F1F0',
}

export const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="demo-screen-in flex flex-col">{children}</div>
)
