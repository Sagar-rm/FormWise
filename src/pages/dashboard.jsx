"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react"
import Sidebar from "../components/sidebar"

// Import the analytics hook
import { useForms, useFormsAnalytics } from "../hooks/use-forms"

// Replace the mock stats with real data
export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const { forms, loading: formsLoading, deleteForm, duplicateForm } = useForms()
  const { analytics, loading: analyticsLoading } = useFormsAnalytics()

  // Filter forms based on search
  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    {
      title: "Total Forms",
      value: analytics?.totalForms?.toString() || "0",
      change: "+12%",
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Responses",
      value: analytics?.totalResponses?.toLocaleString() || "0",
      change: "+23%",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Forms",
      value: analytics?.activeForms?.toString() || "0",
      change: "+8%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Views",
      value: analytics?.totalViews?.toLocaleString() || "0",
      change: "+15%",
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
  ]

  const recentForms = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      responses: 234,
      status: "Active",
      lastModified: "2 hours ago",
      type: "Survey",
    },
    {
      id: 2,
      title: "Event Registration Form",
      responses: 89,
      status: "Active",
      lastModified: "1 day ago",
      type: "Registration",
    },
    {
      id: 3,
      title: "Product Feedback",
      responses: 156,
      status: "Draft",
      lastModified: "3 days ago",
      type: "Feedback",
    },
    {
      id: 4,
      title: "Newsletter Signup",
      responses: 445,
      status: "Active",
      lastModified: "1 week ago",
      type: "Lead Gen",
    },
    {
      id: 5,
      title: "Job Application Form",
      responses: 67,
      status: "Paused",
      lastModified: "2 weeks ago",
      type: "Application",
    },
  ]

  const templates = [
    {
      title: "Contact Form",
      description: "Simple contact form with name, email, and message",
      category: "Basic",
      uses: 1200,
    },
    {
      title: "Event Registration",
      description: "Comprehensive event registration with payment",
      category: "Events",
      uses: 890,
    },
    {
      title: "Customer Survey",
      description: "Detailed customer satisfaction survey",
      category: "Survey",
      uses: 756,
    },
    {
      title: "Job Application",
      description: "Professional job application form",
      category: "HR",
      uses: 634,
    },
  ]

  const handleShareForm = (formId) => {
  const shareableLink = `http://localhost:5173/form/${formId}`;
  
  // Copy the link to the clipboard
  navigator.clipboard.writeText(shareableLink)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch((error) => {
      console.error("Error copying link: ", error);
      alert("Failed to copy link. Please try again.");
    });
};


  const handleDeleteForm = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      try {
        await deleteForm(formId)
      } catch (error) {
        console.error("Error deleting form:", error)
        alert("Failed to delete form. Please try again.")
      }
    }
  }

  const handleDuplicateForm = async (formId) => {
    try {
      const newFormId = await duplicateForm(formId)
      navigate(`/builder/${newFormId}`)
    } catch (error) {
      console.error("Error duplicating form:", error)
      alert("Failed to duplicate form. Please try again.")
    }
  }

  if (formsLoading || analyticsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your forms.</p>
            </div>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/builder/new")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Form
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Forms */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
                    <button
                      className="text-purple-600 hover:text-purple-700 font-medium"
                      onClick={() => navigate("/builder")}
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search forms..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredForms.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                      <p className="text-gray-600 mb-4">
                        {forms.length === 0
                          ? "Create your first form to get started"
                          : "Try adjusting your search criteria"}
                      </p>
                      <button
                        onClick={() => navigate("/builder/new")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Create Your First Form
                      </button>
                    </div>
                  ) : (
                    filteredForms.slice(0, 10).map((form, index) => (
                      <motion.div
                        key={form.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{form.title}</h3>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {form.fields?.length || 0} fields
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  form.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : form.status === "draft"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {form.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                {form.responseCount || 0} responses
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {form.views || 0} views
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {form.updatedAt ? form.updatedAt.toLocaleDateString() : "Unknown"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              onClick={() => navigate(`/analytics/${form.id}`)}
                              title="View Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              onClick={() => navigate(`/builder/${form.id}`)}
                              title="Edit Form"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              onClick={() => handleDuplicateForm(form.id)}
                              title="Duplicate Form"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                onClick={() => handleShareForm(form.id)} // Pass the form ID here
                              title="Share Form"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteForm(form.id)}
                              title="Delete Form"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Templates</h2>
                <div className="space-y-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate("/templates")}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{template.title}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 mr-1" />
                          {template.uses}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {template.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <button
                  className="w-full mt-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                  onClick={() => navigate("/templates")}
                >
                  View All Templates
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New response received</p>
                      <p className="text-xs text-gray-500">Customer Feedback Survey • 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Form updated</p>
                      <p className="text-xs text-gray-500">Event Registration Form • 1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Form shared</p>
                      <p className="text-xs text-gray-500">Product Feedback • 3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
