"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { BrutalNotification, Notification, NotificationType } from "@modules/admin/components/brutal-notification"

interface NotificationContextType {
  addNotification: (text: string, type?: NotificationType) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((text: string, type: NotificationType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { id, text, type }])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {notifications.map((notification) => (
            <BrutalNotification
              key={notification.id}
              notification={notification}
              removeNotif={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
