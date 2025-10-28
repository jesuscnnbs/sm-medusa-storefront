"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { XMark, CheckCircle, BellAlert, InformationCircle, XCircle } from "@medusajs/icons"

const NOTIFICATION_TTL = 2000

export type NotificationType = "success" | "error" | "info" | "warning"

export interface Notification {
  id: string
  text: string
  type?: NotificationType
}

interface NotificationProps {
  notification: Notification
  removeNotif: (id: string) => void
}

const typeStyles = {
  success: {
    bg: "bg-green-100",
    border: "border-green-800",
    text: "text-green-900",
    shadow: "shadow-[4px_4px_0px_0px_rgba(22,101,52,1)]",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-100",
    border: "border-red-800",
    text: "text-red-900",
    shadow: "shadow-[4px_4px_0px_0px_rgba(153,27,27,1)]",
    icon: XCircle,
  },
  warning: {
    bg: "bg-amber-100",
    border: "border-amber-800",
    text: "text-amber-900",
    shadow: "shadow-[4px_4px_0px_0px_rgba(146,64,14,1)]",
    icon: BellAlert,
  },
  info: {
    bg: "bg-blue-100",
    border: "border-blue-800",
    text: "text-blue-900",
    shadow: "shadow-[4px_4px_0px_0px_rgba(30,64,175,1)]",
    icon: InformationCircle,
  },
}

export const BrutalNotification = ({ notification, removeNotif }: NotificationProps) => {
  const { id, text, type = "info" } = notification
  const style = typeStyles[type]
  const Icon = style.icon

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id)
    }, NOTIFICATION_TTL)

    return () => clearTimeout(timeoutRef)
  }, [id, removeNotif])

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        p-3 flex items-start gap-3 text-sm font-bold uppercase
        border-2 pointer-events-auto rounded-lg
        ${style.bg} ${style.border} ${style.text} ${style.shadow}
      `}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <span className="flex-1">{text}</span>
      <button
        onClick={() => removeNotif(id)}
        className="mt-0.5 hover:scale-110 transition-transform flex-shrink-0"
        aria-label="Close notification"
      >
        <XMark className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
