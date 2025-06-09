"use client"

import { useEffect } from "react"
import { useAuth } from "../hooks/use-auth"
import { useNotifications, NotificationHelpers } from "../hooks/use-notifications"

export const useWelcomeService = () => {
  const { user } = useAuth()
  const { createNotification } = useNotifications()

  useEffect(() => {
    if (!user) return

    // Check if this is a new user (you might want to store this in user metadata)
    const checkAndSendWelcome = async () => {
      try {
        // You can check user creation time or a flag in your database
        const userCreatedRecently =
          user.metadata?.creationTime &&
          Date.now() - new Date(user.metadata.creationTime).getTime() < 24 * 60 * 60 * 1000 // 24 hours

        if (userCreatedRecently) {
          // Send welcome notification
          await createNotification(NotificationHelpers.welcomeMessage())
        }
      } catch (error) {
        console.error("Error sending welcome notification:", error)
      }
    }

    // Delay to ensure user is fully loaded
    const timer = setTimeout(checkAndSendWelcome, 2000)
    return () => clearTimeout(timer)
  }, [user, createNotification])
}

// Hook this into your main App component or dashboard
export default useWelcomeService
