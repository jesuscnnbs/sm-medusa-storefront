"use client"

import React from "react"
import { motion } from "framer-motion"

interface CircularTextProps {
  text: string
  id: string
  x?: number | string
  y?: number | string
  scale?: number
  duration?: number
  width?: number
  height?: number
  className?: string
  textClassName?: string
}

export const CircularText = ({
  text,
  id,
  x = "0%",
  y = "-40%",
  scale = 1,
  duration = 50,
  width = 200,
  height = 200,
  className = "",
  textClassName = "text-xl font-black uppercase opacity-70 fill-dark-sm",
}: CircularTextProps) => {
  const radius = Math.min(width, height) / 2

  return (
    <div className="relative">
      <motion.svg
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{
          top: "0",
          right: "0",
          x,
          y,
          scale,
        }}
        width={width}
        height={height}
        className={`absolute pointer-events-none -z-0 ${className}`}
      >
        <path
          id={`circlePath-${id}`}
          d={`M${radius},${radius} m-${radius},0 a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 -${radius * 2},0`}
          fill="none"
        />
        <text>
          <textPath href={`#circlePath-${id}`} className={textClassName}>
            {text}
          </textPath>
        </text>
      </motion.svg>
    </div>
  )
}
