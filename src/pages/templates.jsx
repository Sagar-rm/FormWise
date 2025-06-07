"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Star,
  Eye,
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Heart,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  MessageSquare,
  Zap,
  Plus,
  Grid3X3,
  List,
  Menu,
  X,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"
import { useForms } from "../hooks/use-forms"

export default function Templates() {
  const navigate = useNavigate()
  const { createForm } = useForms()
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { id: "all", label: "All Templates", icon: <Grid3X3 className="w-4 h-4" /> },
    { id: "contact", label: "Contact Forms", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "survey", label: "Surveys", icon: <FileText className="w-4 h-4" /> },
    { id: "event", label: "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "business", label: "Business", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "ecommerce", label: "E-commerce", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "hr", label: "HR & Recruitment", icon: <Users className="w-4 h-4" /> },
  ]

  const templates = [
    {
      id: "1",
      title: "Contact Form",
      description: "Simple contact form with name, email, and message fields",
      category: "contact",
      fields: 4,
      uses: 12500,
      rating: 4.8,
      preview: ["Name", "Email", "Subject", "Message"],
      isPremium: false,
      tags: ["basic", "contact", "simple"],
    },
    {
      id: "2",
      title: "Customer Satisfaction Survey",
      description: "Comprehensive survey to measure customer satisfaction",
      category: "survey",
      fields: 12,
      uses: 8900,
      rating: 4.9,
      preview: ["Rating", "Experience", "Recommendations", "Comments"],
      isPremium: false,
      tags: ["survey", "feedback", "rating"],
    },
    {
      id: "3",
      title: "Event Registration",
      description: "Complete event registration with payment integration",
      category: "event",
      fields: 15,
      uses: 6700,
      rating: 4.7,
      preview: ["Personal Info", "Ticket Type", "Dietary Requirements", "Payment"],
      isPremium: true,
      tags: ["event", "registration", "payment"],
    },
    {
      id: "4",
      title: "Job Application Form",
      description: "Professional job application with resume upload",
      category: "hr",
      fields: 18,
      uses: 5400,
      rating: 4.6,
      preview: ["Personal Details", "Experience", "Skills", "Resume Upload"],
      isPremium: false,
      tags: ["job", "application", "hr", "resume"],
    },
    {
      id: "5",
      title: "Product Feedback",
      description: "Collect detailed feedback about your products",
      category: "business",
      fields: 10,
      uses: 4200,
      rating: 4.5,
      preview: ["Product Rating", "Usage Frequency", "Improvements", "Testimonial"],
      isPremium: false,
      tags: ["product", "feedback", "business"],
    },
    {
      id: "6",
      title: "Course Evaluation",
      description: "Student course evaluation and feedback form",
      category: "education",
      fields: 14,
      uses: 3800,
      rating: 4.4,
      preview: ["Course Rating", "Instructor Feedback", "Content Quality", "Suggestions"],
      isPremium: false,
      tags: ["education", "course", "evaluation"],
    },
    {
      id: "7",
      title: "Order Form",
      description: "E-commerce order form with product selection",
      category: "ecommerce",
      fields: 12,
      uses: 7200,
      rating: 4.7,
      preview: ["Product Selection", "Quantity", "Shipping Info", "Payment"],
      isPremium: true,
      tags: ["ecommerce", "order", "payment", "shipping"],
    },
    {
      id: "8",
      title: "Newsletter Signup",
      description: "Simple newsletter subscription form",
      category: "contact",
      fields: 3,
      uses: 15600,
      rating: 4.9,
      preview: ["Email", "Name", "Preferences"],
      isPremium: false,
      tags: ["newsletter", "subscription", "email"],
    },
  ]

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.uses - a.uses
        case "rating":
          return b.rating - a.rating
        case "newest":
          return 0 // Would sort by creation date
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleUseTemplate = async (template) => {
    try {
      // Create a new form based on the template
      const formData = {
        title: template.title,
        description: template.description,
        fields: [], // Would populate with actual template fields
        settings: {
          theme: "modern",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          submitButtonText: "Submit",
          thankYouMessage: "Thank you for your submission!",
          collectEmail: false,
          allowMultipleSubmissions: true,
        },
        status: "draft",
      }

      const newFormId = await createForm(formData)
      navigate(`/builder/${newFormId}`)
    } catch (error) {
      console.error("Error creating form from template:", error)
    }
  }

  const renderTemplateCard = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {template.isPremium && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1">
          <Zap className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{template.description}</p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {template.fields} fields
              </span>
              <span className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {template.uses.toLocaleString()} uses
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 fill-current" />
                {template.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview Fields:</h4>
          <div className="space-y-1">
            {template.preview.slice(0, 3).map((field, index) => (
              <div key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {field}
              </div>
            ))}
            {template.preview.length > 3 && (
              <div className="text-xs text-gray-400">+{template.preview.length - 3} more fields</div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUseTemplate(template)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
            Use Template
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderTemplateList = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
            {template.isPremium && (
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full w-fit">
                <Zap className="w-3 h-3 inline mr-1" />
                Premium
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-3">{template.description}</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {template.fields} fields
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {template.uses.toLocaleString()} uses
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              {template.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUseTemplate(template)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Use Template
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 shadow-sm">
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Templates</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Form Templates</h1>
                <p className="text-gray-600 mt-1">Choose from our collection of professionally designed forms</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` in ${categories.find((c) => c.id === selectedCategory)?.label}`}
            </p>
          </div>

          {/* Templates Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          ) : (
            <div className="space-y-4">{filteredTemplates.map(renderTemplateList)}</div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      {isMobile && <MobileNavigation activePath="/templates" />}
    </div>
  )
}
