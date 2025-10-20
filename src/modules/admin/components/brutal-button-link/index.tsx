"use client"

import React from "react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

interface BrutalButtonLinkProps {
  children: React.ReactNode
  href: string
  variant?: "primary" | "secondary" | "neutral"
  size?: "xs" | "sm" | "md" | "lg"
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

  return (
    <div
      className={twMerge(
        "inline-block rounded-lg transition-colors bg-dark-sm",
        className
      )}
    >
      <Link
        href={href}
        className={twMerge(
          "inline-flex items-center w-full origin-top-left rounded-lg border-2 font-semibold uppercase transition-all duration-100",
          "active:rotate-0 active:shadow-none",
          sizeClasses[size],
          variantClasses[variant],
          active && "translate-y-1"
        )}
      >
        {children}
      </Link>
    </div>
  )
}
