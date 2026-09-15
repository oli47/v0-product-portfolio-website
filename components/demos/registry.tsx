'use client'

import { ContactsDemo } from '@/components/demos/contacts-demo'
import type { DemoProps } from '@/components/demos/demo-frame'
import { FreemiumDemo } from '@/components/demos/freemium-demo'
import { FreemiumSetupDemo } from '@/components/demos/freemium-setup-demo'
import {
  SignupGoogleSignupDemo, SignupPhoneRemoveDemo, SignupSplitArriveDemo, SignupSplitDemo, SignupStoryDemo,
  SignupStoryFixedDemo,
} from '@/components/demos/signup-story-demo'
import type { DemoId } from '@/lib/projects'

/**
 * The one place a demo id turns into a component. Three consumers look through
 * it: the in-body process block, the case study hero, and the home page card.
 */
export const DEMOS: Record<DemoId, React.ComponentType<DemoProps>> = {
  'signup-story': SignupStoryDemo,
  'signup-story-phone': SignupPhoneRemoveDemo,
  'signup-story-google': SignupGoogleSignupDemo,
  'signup-story-split': SignupSplitDemo,
  'signup-story-split-arrive': SignupSplitArriveDemo,
  'signup-story-fixed': SignupStoryFixedDemo,
  'contacts': ContactsDemo,
  'freemium': FreemiumDemo,
  'freemium-setup': FreemiumSetupDemo,
}
