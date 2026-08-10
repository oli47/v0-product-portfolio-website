'use client'

import { ContactsDemo } from '@/components/demos/contacts-demo'
import type { DemoProps } from '@/components/demos/demo-frame'
import { FreemiumDemo } from '@/components/demos/freemium-demo'
import { FreemiumSetupDemo } from '@/components/demos/freemium-setup-demo'
import { SignupDemo } from '@/components/demos/signup-demo'
import { SignupOldDemo } from '@/components/demos/signup-old-demo'
import type { DemoId } from '@/lib/projects'

/**
 * The one place a demo id turns into a component. Three consumers look through
 * it: the in-body process block, the case study hero, and the home page card.
 */
export const DEMOS: Record<DemoId, React.ComponentType<DemoProps>> = {
  'signup': SignupDemo,
  'signup-old': SignupOldDemo,
  'contacts': ContactsDemo,
  'freemium': FreemiumDemo,
  'freemium-setup': FreemiumSetupDemo,
}
