"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import { getBrutalButtonClasses, getBrutalButtonWrapperClasses, type BrutalButtonVariant, type BrutalButtonSize } from "../brutal-button-styles"

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: BrutalButtonVariant
  size?: BrutalButtonSize
  asChild?: boolean
  active?: boolean
  activeColor?: string
  icon?: boolean
}

const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ children, variant = "primary", size = "md", asChild = false, active = false, activeColor, icon = false, className, ...props }, ref) => {
    const baseClasses = twMerge(
      "w-full",
      getBrutalButtonClasses(variant, size, active, activeColor, icon, props.disabled || false)
    )

    if (asChild) {
      return <span className={baseClasses}>{children}</span>
    }

    return (
      <div className={getBrutalButtonWrapperClasses(variant, className)}>
        <button ref={ref} className={baseClasses} {...props}>
          {children}
        </button>
      </div>
    )
  }
)

BrutalButton.displayName = "BrutalButton"

export default BrutalButton