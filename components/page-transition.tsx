'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setOpacity(0)
    const t = setTimeout(() => setOpacity(1), 10)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div style={{ opacity, transition: 'opacity 0.25s ease-in-out' }}>
      {children}
    </div>
  )
}
