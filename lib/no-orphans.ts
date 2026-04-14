/**
 * Replaces the space after short connector words with a non-breaking space
 * to prevent typographic orphans at line endings.
 * Build-time/render-time only — no DOM traversal.
 */
export function noOrphans(text: string): string {
  return text.replace(
    /\b(a|I|in|at|to|of|by|is|it|or|on|an|no|do|if|as|so|we|be|he|me|my|she|her|him|us|our|you|they|them|its|vs)\s/g,
    '$1\u00A0',
  )
}
