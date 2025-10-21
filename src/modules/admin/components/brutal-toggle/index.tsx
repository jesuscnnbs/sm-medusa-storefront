"use client"

import React from "react"
import {motion} from "framer-motion"
import { twMerge } from "tailwind-merge"

interface BrutalToggleProps {
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export const BrutalToggle = ({
  isActive,
  onToggle,
  disabled = false,
  size = "md",
  className,
}: BrutalToggleProps) => {
  const sizeClasses = {
    sm: {
      container: "w-16 h-8 p-1",
      handle: "w-5 h-5",
    },
    md: {
      container: "w-20 h-10 p-1",
      handle: "w-8 h-8",
    },
    lg: {
      container: "w-24 h-12 p-1.5",
      handle: "w-9 h-9",
    },
  }

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={twMerge(
        "flex border-2 rounded-lg border-dark-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative hover:bg-light-sm-lighter",
        sizeClasses[size].container,
        isActive
          ? "bg-primary-sm justify-end hover:bg-primary-sm-lighter"
          : "bg-light-sm justify-start",
        className
      )}
    >
      <motion.div
        className={twMerge(
          "border-2 border-dark-sm rounded-md",
          sizeClasses[size].handle,
          isActive ? "bg-light-sm" : "bg-dark-sm"
        )}
        layout
        transition={{
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  )
}
