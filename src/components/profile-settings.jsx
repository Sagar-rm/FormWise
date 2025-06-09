"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Building, Save, Camera } from "lucide-react"
import { useAuth } from "../hooks/use-auth"
import { useUserProfile } from "../hooks/use-user-profile"

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth()
  const { userProfile, loading } = useUserProfile()
  const [formData, setFormData] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    phone: "",
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Initialize form data when userProfile loads
  useState(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        firstName: userProfile.profile?.firstName || "",
        lastName: userProfile.profile?.lastName || "",
        company: userProfile.profile?.company || "",
        role: userProfile.profile?.role || "",
        phone: userProfile.profile?.phone || "",
      })
    }
  }, [userProfile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          role: formData.role,
          phone: formData.phone,
        },
      })
      setMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Error updating profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div className="animate-pulse">Loading profile...</div>
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-xl">{formData.displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your display name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={user?.email || ""}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your role"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
