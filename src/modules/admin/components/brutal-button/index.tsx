"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "neutral"
  size?: "xs" | "sm" | "md" | "lg"
  asChild?: boolean
  active?: boolean
  activeColor?: string
  icon?: boolean
}

const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ children, variant = "primary", size = "md", asChild = false, active = false, activeColor, icon = false, className, ...props }, ref) => {
    const sizeClasses = {
      xs: icon ? "p-1 text-[10px]" : "px-2 py-1 text-[10px]",
      sm: icon ? "p-2 text-xs" : "px-4 py-2 text-xs",
      md: icon ? "p-3 text-sm" : "px-6 py-3 text-sm",
      lg: icon ? "p-4 text-base" : "px-8 py-4 text-base",
    }

    // Default active background colors based on variant
    const defaultActiveColor = {
      primary: "bg-primary-sm",
      secondary: "bg-secondary-sm",
      neutral: "bg-light-sm",
    }

    // Determine text color based on background
    const getTextColor = (bgColor: string) => {
      if (bgColor.includes("primary") || bgColor.includes("secondary") || bgColor.includes("dark")) {
        return "text-light-sm"
      }
      return "text-dark-sm"
    }

    const activeBgColor = activeColor || defaultActiveColor[variant]
    const activeTextColor = getTextColor(activeBgColor)

    const variantClasses = {
      primary: active
        ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
        : "bg-primary-sm text-light-sm border-dark-sm hover:-rotate-2",
      secondary: active
        ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
        : "bg-secondary-sm text-light-sm border-dark-sm hover:-rotate-2",
      neutral: active
        ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
        : "bg-white text-dark-sm border-dark-sm hover:-rotate-2",
    }

    const baseClasses = twMerge(
      "w-full origin-top-left rounded-lg border-2 font-semibold uppercase transition-all duration-100",
      "active:rotate-0 active:shadow-none",
      sizeClasses[size],
      variantClasses[variant],
      active && "translate-y-1",
      props.disabled && "opacity-50 cursor-not-allowed"
    )

    if (asChild) {
      return <span className={baseClasses}>{children}</span>
    }

    return (
      <div
        className={twMerge(
          "rounded-lg transition-colors bg-dark-sm",
          className
        )}
      >
        <button ref={ref} className={baseClasses} {...props}>
          {children}
        </button>
      </div>
    )
  }
)

BrutalButton.displayName = "BrutalButton"

export default BrutalButton