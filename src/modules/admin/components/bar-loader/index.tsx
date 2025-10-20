"use client"

import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

interface BarLoaderProps {
  barColor?: string
  barCount?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 1,
      ease: "circIn",
    },
  },
}

export const BarLoader = ({
  barColor = "bg-primary-sm",
  barCount = 5,
  size = "md",
  className,
}: BarLoaderProps) => {
  const sizeClasses = {
    sm: "h-8 w-1.5",
    md: "h-12 w-2",
    lg: "h-16 w-3",
  }

  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className={twMerge("flex gap-1 rounded-sm", className)}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          variants={variants}
          className={twMerge(sizeClasses[size], barColor)}
        />
      ))}
    </motion.div>
  )
}

interface LoaderContainerProps {
  children?: React.ReactNode
  bgColor?: string
  className?: string
}

export const LoaderContainer = ({
  children,
  bgColor = "bg-light-sm-darker",
  className,
}: LoaderContainerProps) => {
  return (
    <div
      className={twMerge(
        "grid place-content-center px-4 py-24",
        bgColor,
        className
      )}
    >
      {children || <BarLoader />}
    </div>
  )
}
