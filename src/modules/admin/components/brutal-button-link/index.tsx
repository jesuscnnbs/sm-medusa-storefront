"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getBrutalButtonClasses, getBrutalButtonWrapperClasses, type BrutalButtonVariant, type BrutalButtonSize } from "../brutal-button-styles"

interface BrutalButtonLinkProps {
  children: React.ReactNode
  href: string
  variant?: BrutalButtonVariant
  size?: BrutalButtonSize
  className?: string
  active?: boolean
  activeColor?: string
  icon?: boolean
}

export const BrutalButtonLink = ({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  active = false,
  activeColor,
  icon = false,
}: BrutalButtonLinkProps) => {
  return (
    <div className={twMerge("inline-block", getBrutalButtonWrapperClasses(className))}>
      <LocalizedClientLink
        href={href}
        className={twMerge(
          "inline-flex items-center w-full",
          getBrutalButtonClasses(variant, size, active, activeColor, icon)
        )}
      >
        {children}
      </LocalizedClientLink>
    </div>
  )
}
