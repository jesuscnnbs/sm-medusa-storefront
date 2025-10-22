"use client"

import React from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

interface MenuItem {
  href: string
  name: string
}

interface NavMenuTabsProps {
  menuItems: Record<string, MenuItem>
}

export default function NavMenuTabs({ menuItems }: NavMenuTabsProps) {
  const pathname = usePathname()

  // Get current path without locale
  const currentPath = pathname.split('/').slice(2).join('/') || '/'

  return (
    <nav
      className="relative flex items-center h-full overflow-hidden"
      role="navigation"
    >
      {Object.entries(menuItems).map(([_name, item], index) => {
        const itemPath = item.href === '/' ? '/' : item.href.replace(/^\//, '')
        const isActive = currentPath === itemPath || (currentPath === '' && itemPath === '/')

        return (
          <NavTab
            key={index}
            href={item.href}
            name={item.name}
            index={index}
            isActive={isActive}
          />
        )
      })}
    </nav>
  )
}

interface NavTabProps {
  href: string
  name: string
  index: number
  isActive: boolean
}

const NavTab = ({ href, name, index, isActive }: NavTabProps) => {
  return (
    <div
      data-nav-index={index}
      className="relative h-full"
    >
      <LocalizedClientLink
        href={href}
        className={`
          flex items-center h-full px-4 font-sans text-sm font-medium uppercase
          transition-all duration-200 ease-in-out
          ${isActive
            ? 'text-secondary-sm-darker'
            : 'text-dark-sm hover:text-secondary-sm/70'
          }
          active:scale-95
        `}
        data-testid={`nav-${name}-link`}
      >
        {name}
      </LocalizedClientLink>

      <TabIndicator isActive={isActive} />
    </div>
  )
}

const TabIndicator = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.div
      animate={{
        scaleY: isActive ? 1 : 0,
      }}
      initial={{
        scaleY: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className="absolute left-0 right-0 h-2.5 origin-bottom -bottom-1 bg-secondary-sm rounded-t-3xl border-dark-sm"
    />
  )
}
