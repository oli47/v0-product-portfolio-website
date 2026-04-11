import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Olaf Otrząsek',
}

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="max-w-[45rem] mx-auto px-5 text-center">
        <p className="font-display text-[clamp(4rem,15vw,8rem)] leading-none text-[var(--color-100)] select-none mb-6">
          404
        </p>
        <p className="text-body-1 text-[var(--color-300)] mb-8">
          This page does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-eyebrow text-[var(--color-300)] hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out"
        >
          <span className="font-neubit text-[1.25rem] leading-[1]">←</span>
          <span>Back to home</span>
        </Link>
      </div>
    </main>
  )
}
