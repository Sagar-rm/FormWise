"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./use-auth"

export const useUserProfile = () => {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setUserProfile(null)
      setLoading(false)
      return
    }

    // Listen to real-time updates of user profile
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data())
        } else {
          setUserProfile(null)
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching user profile:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  return { userProfile, loading }
}
