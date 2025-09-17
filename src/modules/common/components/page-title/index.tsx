"use client"
import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"
interface Props {
  text: string;
  initialDelay?: number;
  classNames?: string;
}

export default function PageTitle({text, initialDelay=0, classNames=""}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className={classNames}>
        <div className="relative block text-start opacity-0">
          {text}
        </div>
      </span>
    )
  }

  return (
    <span className={classNames}>
      <div className="relative block text-start">
        {text.split("").map((letter, index) => {
          const delayMs = index*50+initialDelay
          return (
            <div
              key={index} 
              className="relative inline-block transition-transform opacity-0 animate-fade-in-bottom"
              style={{animationDelay: `${delayMs}ms`}}
            >
              {letter}
            </div>
          )
        })}
      </div>
    </span>
  )
}
