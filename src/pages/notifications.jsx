"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Bell, Check, Trash2, Settings, ArrowLeft, CheckCircle, AlertCircle, Info, Search } from "lucide-react"
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../hooks/use-auth"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!user) return

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }))
      setNotifications(notifs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: new Date(),
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read)

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          updateDoc(doc(db, "notifications", notification.id), {
            read: true,
            readAt: new Date(),
          }),
        ),
      )
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read) ||
      notification.type === filter

    return matchesSearch && matchesFilter
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
        {isMobile && <MobileNavigation activePath="/notifications" />}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with your form activity</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Mark All Read
              </button>
              <button onClick={() => navigate("/settings")} className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="success">Success</option>
                <option value="warning">Warnings</option>
                <option value="error">Errors</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 ${
                    !notification.read ? "border-l-4 border-l-purple-500" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                          {!notification.read && <span className="w-2 h-2 bg-purple-500 rounded-full"></span>}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            {notification.createdAt?.toLocaleDateString()} at{" "}
                            {notification.createdAt?.toLocaleTimeString()}
                          </span>
                          {notification.formTitle && (
                            <span className="px-2 py-1 bg-gray-100 rounded">{notification.formTitle}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {notification.actionUrl && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(notification.actionUrl)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {notification.actionText || "View Details"}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activePath="/notifications" />}
    </div>
  )
}
