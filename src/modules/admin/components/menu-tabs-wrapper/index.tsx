"use client"

import { usePathname } from "next/navigation"
import { MenuTabs } from "../menu-tabs"

export const MenuTabsWrapper = () => {
  const pathname = usePathname()

  // Show tabs only on menu, dish, and categories routes
  const shouldShowTabs = /\/admin\/(menu|dish|categories)/.test(pathname)

  if (!shouldShowTabs) {
    return null
  }

  return <MenuTabs />
}
