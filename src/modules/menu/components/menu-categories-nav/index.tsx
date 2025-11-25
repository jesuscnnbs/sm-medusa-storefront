"use client"

import React, { useEffect, useState } from "react"
import { MenuCategoryType } from "types/global"
import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"

interface MenuCategoriesNavProps {
  categories: MenuCategoryType[]
}

export const MenuCategoriesNav = ({ categories }: MenuCategoriesNavProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const navRef = React.useRef<HTMLDivElement>(null)

  // Check scroll position to show/hide scroll buttons
  const checkScrollButtons = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener('resize', checkScrollButtons)
    return () => window.removeEventListener('resize', checkScrollButtons)
  }, [categories])

  // Scroll navigation buttons
  const scroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 200
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Intersection Observer to detect active category
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all category sections
    categories.forEach((category) => {
      const element = document.getElementById(`category-${category.id}`)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [categories])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      const offset = 150 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (categories.length === 0) return null

  return (
    <div className="sticky z-20 top-16" style={{ isolation: 'isolate' }}>
      <nav className="border-b-2 shadow-md bg-light-sm-lighter border-secondary-sm-darker">
      <div className="relative w-full mx-auto">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute top-0 left-0 z-10 h-full px-2 bg-gradient-to-r from-light-sm to-transparent hover:from-light-sm-darker"
            aria-label="Scroll left"
          >
            <ChevronLeftMini className="w-6 h-6 text-dark-sm" />
          </button>
        )}

        {/* Categories navigation */}
        <div
          ref={navRef}
          className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={checkScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          data-testid="menu-categories-nav"
        >
          {categories.map((category) => {
            const isActive = activeCategory === `category-${category.id}`
            return (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg border-2 font-medium
                  transition-all duration-200 text-sm whitespace-nowrap
                  font-lemonMilk
                  ${
                    isActive
                      ? 'bg-light-sm text-dark-sm border-dark-sm shadow-lg scale-[102%]'
                      : 'bg-light-sm-lighter text-dark-sm-lighter border-dark-sm hover:bg-light-sm hover:scale-105'
                  }
                `}
              >
                {category.title}
              </button>
            )
          })}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute top-0 right-0 z-10 h-full px-2 bg-gradient-to-l from-light-sm to-transparent hover:from-light-sm-darker"
            aria-label="Scroll right"
          >
            <ChevronRightMini className="w-6 h-6 text-dark-sm" />
          </button>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </nav>
    </div>
  )
}
