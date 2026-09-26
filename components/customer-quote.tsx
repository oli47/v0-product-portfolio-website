/**
 * A customer's own words: the quote, then who said it and where to hear it.
 * Its own card, so it reads as evidence beside the screens rather than as the
 * case study's voice. From lg it sits in a tile as short as a 16:9 screenshot,
 * so its type and padding tighten there to keep the row from growing.
 */
export function CustomerQuote({ text, author, href }: { text: string; author: string; href?: string }) {
  return (
    <figure className="m-0 flex flex-col gap-4 lg:gap-2 rounded-sm p-6 sm:p-8 lg:p-4 xl:p-5" style={{ backgroundColor: 'var(--color-000)' }}>
      <span aria-hidden="true" className="font-display leading-none text-[var(--accent)] text-[3rem] h-6 lg:text-[2rem] lg:h-4">“</span>
      <blockquote className="m-0 text-pretty text-[var(--color-500)] text-base leading-[1.625rem] lg:text-[0.8125rem] lg:leading-[1.2rem] xl:text-[0.875rem] xl:leading-[1.3rem]">
        {text}
      </blockquote>
      <figcaption className="text-body-2 text-[var(--color-300)] lg:text-[0.75rem] lg:leading-[1.1rem]">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">{author}</a>
        ) : author}
      </figcaption>
    </figure>
  )
}
