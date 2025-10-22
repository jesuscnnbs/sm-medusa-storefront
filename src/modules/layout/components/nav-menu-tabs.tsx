"use client"

import React, { useRef, useState, useEffect } from "react"
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
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })

  // Get current path without locale
  const currentPath = pathname.split('/').slice(2).join('/') || '/'

  return (
    <nav
      onMouseLeave={() => {
        // Return to active tab position if exists
        const activeIndex = Object.values(menuItems).findIndex(
          item => {
            const itemPath = item.href === '/' ? '/' : item.href.replace(/^\//, '')
            return currentPath === itemPath || (currentPath === '' && itemPath === '/')
          }
        )

        if (activeIndex !== -1) {
          const activeElement = document.querySelector(`[data-nav-index="${activeIndex}"]`)
          if (activeElement) {
            const { width } = activeElement.getBoundingClientRect()
            setIndicator({
              left: (activeElement as HTMLElement).offsetLeft,
              width,
              opacity: 1,
            })
          }
        } else {
          setIndicator((prev) => ({
            ...prev,
            opacity: 0,
          }))
        }
      }}
      className="relative flex items-center h-full"
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
            setIndicator={setIndicator}
          />
        )
      })}

      <TabIndicator position={indicator} />
    </nav>
  )
}

interface NavTabProps {
  href: string
  name: string
  index: number
  isActive: boolean
  setIndicator: React.Dispatch<React.SetStateAction<{
    left: number
    width: number
    opacity: number
  }>>
}

const NavTab = ({ href, name, index, isActive, setIndicator }: NavTabProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Set initial position for active tab
  useEffect(() => {
    if (isActive && ref.current) {
      const { width } = ref.current.getBoundingClientRect()
      setIndicator({
        left: ref.current.offsetLeft,
        width,
        opacity: 1,
      })
    }
  }, [isActive, setIndicator])

  const handleClick = () => {
    if (!ref?.current) return

    const { width } = ref.current.getBoundingClientRect()

    setIndicator({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    })
  }

  return (
    <div
      ref={ref}
      data-nav-index={index}
      onClick={handleClick}
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
    </div>
  )
}

const TabIndicator = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.div
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className="absolute bottom-0 h-1 bg-dark-sm-lighter rounded-t-md"
      style={{
        opacity: position.opacity,
      }}
    />
  )
}
