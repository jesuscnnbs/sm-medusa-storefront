"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

interface NeuButtonProps {
  children: React.ReactNode
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "neutral"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  active?: boolean
  activeColor?: string
}

export const NeuButton = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  className,
  disabled = false,
  type = "button",
  active = false,
  activeColor,
}: NeuButtonProps) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs md:text-sm",
    md: "px-6 py-3 text-sm md:text-base",
    lg: "px-8 py-4 text-base md:text-lg",
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

  const buttonVariantClasses = {
    primary: active
      ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
      : "border-dark-sm bg-light-sm text-dark-sm hover:rotate-2",
    secondary: active
      ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
      : "border-dark-sm bg-light-sm text-dark-sm hover:rotate-2",
    neutral: active
      ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
      : "border-dark-sm bg-light-sm text-dark-sm hover:rotate-2",
  }

  return (
    <div
      className={twMerge(
        "rounded-lg transition-colors bg-dark-sm",
        className
      )}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={twMerge(
          "w-full origin-top-left rounded-lg border-2 font-medium transition-all",
          sizeClasses[size],
          buttonVariantClasses[variant],
          active && "translate-y-1",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {children}
      </button>
    </div>
  )
}
