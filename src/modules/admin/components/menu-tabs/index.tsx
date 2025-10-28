"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NeuButton } from "../neu-button"

interface TabData {
  id: string
  title: string
  href: string
  pattern: RegExp
}

const TAB_DATA: TabData[] = [
  {
    id: "menu",
    title: "Menu",
    href: "/admin/menu",
    pattern: /\/admin\/menu/,
  },
  {
    id: "categories",
    title: "Categorias",
    href: "/admin/categories",
    pattern: /\/admin\/categories/,
  },
  {
    id: "dish",
    title: "Platos",
    href: "/admin/dish",
    pattern: /\/admin\/dish/,
  },
]

export const MenuTabs = () => {
  const pathname = usePathname()

  return (
    <div className="bg-light-sm-darker">
      <div className="px-2 mx-auto max-w-7xl sm:px-2 lg:px-8">
        <div className="flex gap-1 py-2">
          {TAB_DATA.map((tab) => {
            const isActive = tab.pattern.test(pathname)
            return (
              <Link key={tab.id} href={tab.href}>
                <NeuButton
                  size="sm"
                  variant={isActive ? "secondary" : "neutral"}
                  active={isActive}
                >
                  {tab.title}
                </NeuButton>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
