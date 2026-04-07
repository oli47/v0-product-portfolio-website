# Brand Tokens

## Colors

```css
--beige-50:  #FAF7F2   /* page background */
--beige-100: #F2EDE3   /* card / surface */
--beige-150: #E8E0D0   /* subtle divider */
--beige-200: #D9D0BC   /* border default */
--beige-300: #B5A990   /* muted text, secondary border */
--ink-600:   #1A1714   /* primary text */
--ink-400:   #6B6258   /* secondary text */
--ink-300:   #B5A990   /* placeholder / disabled */
--accent:    #C4521A   /* metrics, highlighted words only */
--status:    #3A800F   /* positive status indicators */
```

Use `--accent` sparingly: numbers, key outcomes, and single highlighted words. Never for decorative purposes.

## Typography

| Role | Typeface | Notes |
|---|---|---|
| Headings | PP Mondwest | Display weight, set in `--ink-600` |
| Body | DM Sans | Regular / Medium, set in `--ink-600` or `--ink-400` |
| Labels / Eyebrow | DM Mono | Uppercase, tracked, set in `--ink-400` |

Font files live in `public/fonts/`.

## Spacing & Shape

- Borders: `0.5px solid` using beige or ink tokens
- Border radius: `4px` (small elements), `8px` (cards, inputs)
- Shadows: none
- Gradients: none

## Voice

- Facts over adjectives: lead with what was built or measured, not how impressive it is
- First person: "I built", "I led", not "Olaf built"
- No buzzwords: avoid "innovative", "cutting-edge", "passionate", "leverage", "synergy"
- Opportunity framing: describe what something enables, not the pain it removes
- No em dashes: use commas, colons, or rewrite the sentence
