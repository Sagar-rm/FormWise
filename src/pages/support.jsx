"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Paperclip, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../hooks/use-auth"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Support() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
    email: user?.email || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { value: "general", label: "General Question" },
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "account", label: "Account Issues" },
  ]

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "urgent", label: "Urgent", color: "text-red-600" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "supportTickets"), {
        ...formData,
        userId: user.uid,
        status: "open",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting support ticket:", error)
      alert("Failed to submit support ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="flex h-screen bg-gray-50">
        {!isMobile && <Sidebar />}

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We've received your support request and will get back to you within 24 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    subject: "",
                    category: "general",
                    priority: "medium",
                    message: "",
                    email: user?.email || "",
                  })
                }}
                className="w-full text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Submit Another Ticket
              </button>
            </div>
          </motion.div>
        </div>

        {isMobile && <MobileNavigation activePath="/support" />}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            {isMobile && (
              <button onClick={() => navigate("/help")} className="p-2 hover:bg-gray-100 rounded-lg mr-4">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Support</h1>
              <p className="text-gray-600 mt-1">Get help from our support team</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">support@formwise.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Response Times</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">General Questions</span>
                    <span className="text-sm font-medium text-gray-900">24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Technical Issues</span>
                    <span className="text-sm font-medium text-gray-900">12 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Urgent Issues</span>
                    <span className="text-sm font-medium text-gray-900">4 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Submit a Support Ticket</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Please provide as much detail as possible about your issue..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button type="button" className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach Files (Coming Soon)
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Ticket
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation activePath="/support" />}
    </div>
  )
}
