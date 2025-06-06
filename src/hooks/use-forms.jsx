"use client"

import { useState, useEffect } from "react"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
} from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./use-auth"

export const useForms = () => {
  const { user } = useAuth()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setForms([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "forms"), where("userId", "==", user.uid), orderBy("updatedAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const formsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))

        setForms(formsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching forms:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const createForm = async (formData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const newForm = {
        ...formData,
        userId: user.uid,
        responseCount: 0,
        views: 0,
        status: formData.status || "draft",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, "forms"), newForm)
      return docRef.id
    } catch (error) {
      console.error("Error creating form:", error)
      console.log(newForm)
      throw error
    }
  }

  const updateForm = async (formId, updates) => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log(updates) // Log the updates object

      const validUpdates = Object.fromEntries(Object.entries(updates).filter(([key, value]) => value !== undefined))

      const formRef = doc(db, "forms", formId)
      await updateDoc(formRef, {
        ...validUpdates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error updating form:", error)
      throw error
    }
  }

  const deleteForm = async (formId) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Delete all responses for this form first
      const responsesQuery = query(collection(db, "formResponses"), where("formId", "==", formId))
      const responsesSnapshot = await getDocs(responsesQuery)

      const deletePromises = responsesSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Then delete the form
      await deleteDoc(doc(db, "forms", formId))
    } catch (error) {
      console.error("Error deleting form:", error)
      throw error
    }
  }

const getForm = async (formId) => {
  try {
    const formRef = doc(db, "forms", formId);
    const formSnap = await getDoc(formRef);

    if (formSnap.exists()) {
      const data = formSnap.data();
      return {
        id: formSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    }
    return null; // Return null if the form does not exist
  } catch (error) {
    console.error("Error getting form:", error);
    throw error;
  }
};


  const duplicateForm = async (formId) => {
    try {
      const form = await getForm(formId)
      if (!form) throw new Error("Form not found")

      const duplicatedForm = {
        ...form,
        title: `${form.title} (Copy)`,
        status: "draft",
        responseCount: 0,
        views: 0,
      }

      // Remove the id and timestamps
      delete duplicatedForm.id
      delete duplicatedForm.createdAt
      delete duplicatedForm.updatedAt

      return await createForm(duplicatedForm)
    } catch (error) {
      console.error("Error duplicating form:", error)
      throw error
    }
  }

  const incrementFormViews = async (formId) => {
    try {
      const formRef = doc(db, "forms", formId)
      await updateDoc(formRef, {
        views: increment(1),
      })
    } catch (error) {
      console.error("Error incrementing form views:", error)
    }
  }

  return {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    duplicateForm,
    incrementFormViews,
  }
}

export const useFormResponses = (formId) => {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!formId) {
      setResponses([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "formResponses"), where("formId", "==", formId), orderBy("submittedAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const responsesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate(),
        }))

        setResponses(responsesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching responses:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [formId])

  const submitResponse = async (formId, responseData, metadata = {}) => {
    try {
      const response = {
        formId,
        responses: responseData,
        submittedAt: Timestamp.now(),
        userAgent: navigator.userAgent,
        ipAddress: null, // Would need server-side implementation
        ...metadata,
      }

      // Add the response
      await addDoc(collection(db, "formResponses"), response)

      // Increment the form's response count
      const formRef = doc(db, "forms", formId)
      await updateDoc(formRef, {
        responseCount: increment(1),
        lastResponseAt: Timestamp.now(),
      })

      return true
    } catch (error) {
      console.error("Error submitting response:", error)
      throw error
    }
  }

  const deleteResponse = async (responseId) => {
    try {
      await deleteDoc(doc(db, "formResponses", responseId))
    } catch (error) {
      console.error("Error deleting response:", error)
      throw error
    }
  }

  const getResponseStats = () => {
    if (!responses.length) return null

    const totalResponses = responses.length
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayResponses = responses.filter(
      (r) => r.submittedAt && r.submittedAt.toDateString() === today.toDateString(),
    ).length

    const yesterdayResponses = responses.filter(
      (r) => r.submittedAt && r.submittedAt.toDateString() === yesterday.toDateString(),
    ).length

    return {
      total: totalResponses,
      today: todayResponses,
      yesterday: yesterdayResponses,
      change:
        yesterdayResponses > 0 ? (((todayResponses - yesterdayResponses) / yesterdayResponses) * 100).toFixed(1) : 0,
    }
  }

  return {
    responses,
    loading,
    submitResponse,
    deleteResponse,
    getResponseStats,
  }
}

// Hook for getting all forms analytics
export const useFormsAnalytics = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        // Get all user's forms
        const formsQuery = query(collection(db, "forms"), where("userId", "==", user.uid))
        const formsSnapshot = await getDocs(formsQuery)

        // Get all responses for user's forms
        const formIds = formsSnapshot.docs.map((doc) => doc.id)
        if (formIds.length === 0) {
          setAnalytics({
            totalForms: 0,
            totalResponses: 0,
            activeForms: 0,
            totalViews: 0,
          })
          setLoading(false)
          return
        }

        const responsesQuery = query(collection(db, "formResponses"), where("formId", "in", formIds))
        const responsesSnapshot = await getDocs(responsesQuery)

        const forms = formsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const totalForms = forms.length
        const activeForms = forms.filter((form) => form.status === "published").length
        const totalResponses = responsesSnapshot.docs.length
        const totalViews = forms.reduce((sum, form) => sum + (form.views || 0), 0)

        setAnalytics({
          totalForms,
          totalResponses,
          activeForms,
          totalViews,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  return { analytics, loading }
}
