"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import { MotionConfig, motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"
import Link from "next/link"

interface SpringCardProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  buttonText?: string
  circularText?: string
  className?: string
  bgColor?: string
  borderColor?: string
  textColor?: string
  buttonBgColor?: string
  buttonTextColor?: string
}

export const SpringCard = ({
  title,
  subtitle,
  icon,
  href,
  onClick,
  buttonText = "VER MAS",
  circularText = "CLICK AQUI • CLICK AQUI • CLICK AQUI • CLICK AQUI •",
  className = "bg-primary-sm",
  bgColor,
  borderColor = "border-dark-sm",
  textColor = "text-light-sm",
  buttonBgColor = "bg-light-sm",
  buttonTextColor = "text-dark-sm",
}: SpringCardProps) => {
  const cardContent = (
    <MotionConfig
      transition={{
        type: "spring",
        bounce: 0.5,
      }}
    >
      <motion.div
        whileHover="hovered"
        className={twMerge(
          "group w-full border-2",
          borderColor,
          bgColor || className
        )}
      >
        <motion.div
          initial={{
            y: 0,
          }}
          variants={{
            hovered: {
              y: -2,
            },
          }}
          className={twMerge(
            "-m-0.5 border-2",
            borderColor,
            bgColor || className
          )}
        >
          <motion.div
            initial={{
              y: 0,
            }}
            variants={{
              hovered: {
                y: -2,
              },
            }}
            className={twMerge(
              "relative -m-0.5 flex h-72 flex-col justify-between overflow-hidden border-2 p-8",
              borderColor,
              bgColor || className
            )}
          >
            {icon && (
              <div className="absolute top-4 right-4 opacity-20">
                {icon}
              </div>
            )}

            <p className={twMerge(
              "flex items-center text-2xl font-bold uppercase",
              textColor
            )}>
              <FiArrowRight className="mr-2 -ml-8 transition-all duration-300 ease-in-out opacity-0 group-hover:ml-0 group-hover:opacity-100" />
              {title}
            </p>

            <div>
              <p className={twMerge(
                "transition-[margin] duration-300 ease-in-out group-hover:mb-10",
                textColor
              )}>
                {subtitle}
              </p>
              <button className={twMerge(
                "absolute bottom-2 left-2 right-2 translate-y-full border-2 px-4 py-2 font-medium opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100",
                borderColor,
                buttonBgColor,
                buttonTextColor
              )}>
                {buttonText}
              </button>
            </div>

            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              style={{
                top: "0",
                right: "0",
                x: "50%",
                y: "-50%",
                scale: 0.75,
              }}
              width="200"
              height="200"
              className="absolute z-10 rounded-full pointer-events-none"
            >
              <path
                id={`circlePath-${title.replace(/\s+/g, '-')}`}
                d="M100,100 m-100,0 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0"
                fill="none"
              />
              <text>
                <textPath
                  href={`#circlePath-${title.replace(/\s+/g, '-')}`}
                  className={twMerge(
                    "text-2xl font-black uppercase opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100",
                    textColor
                  )}
                >
                  {circularText}
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {cardContent}
      </button>
    )
  }

  return cardContent
}

interface SpringCardsGridProps {
  children: React.ReactNode
  className?: string
}

export const SpringCardsGrid = ({ children, className }: SpringCardsGridProps) => {
  return (
    <div className={twMerge(
      "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {children}
    </div>
  )
}
