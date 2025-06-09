"use client"

import { useState, useEffect, createContext, useContext } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth"
import { auth } from "../lib/firebase"

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password, rememberMe = false) => {
    // Set the persistence type based on the rememberMe checkbox
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email, password) => {
    // For new sign ups, we'll use session persistence by default
    await setPersistence(auth, browserSessionPersistence)
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async (rememberMe = false) => {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
  }

  const signInWithGithub = async (rememberMe = false) => {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)
    const provider = new GithubAuthProvider()
    return await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
