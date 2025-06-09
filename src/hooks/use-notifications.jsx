"use client"

import { useState, useEffect } from "react"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
} from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./use-auth"

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    )

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          readAt: doc.data().readAt?.toDate(),
        }))

        setNotifications(notifs)
        setUnreadCount(notifs.filter((n) => !n.read).length)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const createNotification = async (notificationData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const notification = {
        userId: user.uid,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || "info", // success, warning, error, info
        read: false,
        createdAt: Timestamp.now(),
        formId: notificationData.formId || null,
        formTitle: notificationData.formTitle || null,
        actionUrl: notificationData.actionUrl || null,
        actionText: notificationData.actionText || null,
        metadata: notificationData.metadata || {},
      }

      const docRef = await addDoc(collection(db, "notifications"), notification)
      return docRef.id
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
        readAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read)

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          updateDoc(doc(db, "notifications", notification.id), {
            read: true,
            readAt: Timestamp.now(),
          }),
        ),
      )
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  const getRecentActivity = (limitCount = 10) => {
    return notifications.slice(0, limitCount).map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      formTitle: notification.formTitle,
      createdAt: notification.createdAt,
      actionUrl: notification.actionUrl,
    }))
  }

  return {
    notifications,
    loading,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getRecentActivity,
  }
}

// Notification helper functions for common actions
export const NotificationHelpers = {
  formCreated: (formTitle, formId) => ({
    title: "Form Created",
    message: `Successfully created "${formTitle}"`,
    type: "success",
    formTitle,
    formId,
    actionUrl: `/builder/${formId}`,
    actionText: "Edit Form",
  }),

  formPublished: (formTitle, formId) => ({
    title: "Form Published",
    message: `"${formTitle}" is now live and accepting responses`,
    type: "success",
    formTitle,
    formId,
    actionUrl: `/form/${formId}`,
    actionText: "View Form",
  }),

  responseReceived: (formTitle, formId, responseCount) => ({
    title: "New Response Received",
    message: `New response submitted for "${formTitle}" (Total: ${responseCount})`,
    type: "info",
    formTitle,
    formId,
    actionUrl: `/form-responses/${formId}`,
    actionText: "View Responses",
  }),

  formUpdated: (formTitle, formId) => ({
    title: "Form Updated",
    message: `Successfully updated "${formTitle}"`,
    type: "info",
    formTitle,
    formId,
    actionUrl: `/builder/${formId}`,
    actionText: "View Form",
  }),

  formDeleted: (formTitle) => ({
    title: "Form Deleted",
    message: `"${formTitle}" has been permanently deleted`,
    type: "warning",
    formTitle,
  }),

  formDuplicated: (originalTitle, newFormId) => ({
    title: "Form Duplicated",
    message: `Created a copy of "${originalTitle}"`,
    type: "success",
    formTitle: `${originalTitle} (Copy)`,
    formId: newFormId,
    actionUrl: `/builder/${newFormId}`,
    actionText: "Edit Copy",
  }),

  formShared: (formTitle, formId) => ({
    title: "Form Shared",
    message: `Share link copied for "${formTitle}"`,
    type: "info",
    formTitle,
    formId,
  }),

  welcomeMessage: () => ({
    title: "Welcome to FormWise!",
    message: "Get started by creating your first form or exploring our templates",
    type: "success",
    actionUrl: "/builder/new",
    actionText: "Create Form",
  }),
}
