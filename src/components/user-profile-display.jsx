"use client"

import { useUserProfile } from "../hooks/use-user-profile"
import { useAuth } from "../hooks/use-auth"

export default function UserProfileDisplay() {
  const { user } = useAuth()
  const { userProfile, loading } = useUserProfile()

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    )
  }

  const displayName = userProfile?.displayName || user?.displayName || "User"
  const email = userProfile?.email || user?.email || ""
  const photoURL = userProfile?.photoURL || user?.photoURL

  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
        {photoURL ? (
          <img src={photoURL || "/placeholder.svg"} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-semibold text-sm">{displayName.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{displayName}</span>
        <span className="text-xs text-gray-500">{email}</span>
      </div>
    </div>
  )
}
