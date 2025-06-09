"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Star,
  Eye,
  ArrowLeft,
  FileText,
  Users,
  Calendar,
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
  Filter,
  Clock,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
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
  const [favorites, setFavorites] = useState(new Set())
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { id: "all", label: "All Templates", icon: <Grid3X3 className="w-4 h-4" />, count: 24 },
    { id: "contact", label: "Contact Forms", icon: <MessageSquare className="w-4 h-4" />, count: 6 },
    { id: "survey", label: "Surveys & Feedback", icon: <FileText className="w-4 h-4" />, count: 5 },
    { id: "event", label: "Events & Registration", icon: <Calendar className="w-4 h-4" />, count: 4 },
    { id: "business", label: "Business & Marketing", icon: <Briefcase className="w-4 h-4" />, count: 3 },
    { id: "education", label: "Education & Training", icon: <GraduationCap className="w-4 h-4" />, count: 3 },
    { id: "ecommerce", label: "E-commerce & Sales", icon: <ShoppingCart className="w-4 h-4" />, count: 3 },
    { id: "hr", label: "HR & Recruitment", icon: <Users className="w-4 h-4" />, count: 2 },
  ]

  const templates = [
    // Contact Forms
    {
      id: "1",
      title: "Simple Contact Form",
      description: "Clean and minimal contact form perfect for any website",
      category: "contact",
      fields: 4,
      uses: 25600,
      rating: 4.9,
      preview: ["Full Name", "Email Address", "Subject", "Message"],
      isPremium: false,
      tags: ["basic", "contact", "simple", "minimal"],
      difficulty: "Beginner",
      estimatedTime: "2 min",
      features: ["Email notifications", "Auto-response", "Spam protection"],
      industry: ["General", "Business", "Portfolio"],
      responsive: true,
      multiStep: false,
      hasLogic: false,
      hasPayment: false,
    },
    {
      id: "2",
      title: "Advanced Contact Form",
      description: "Feature-rich contact form with file uploads and department routing",
      category: "contact",
      fields: 8,
      uses: 18400,
      rating: 4.8,
      preview: ["Contact Info", "Department", "Priority", "File Upload", "Message"],
      isPremium: true,
      tags: ["advanced", "contact", "upload", "routing"],
      difficulty: "Intermediate",
      estimatedTime: "5 min",
      features: ["File uploads", "Department routing", "Priority levels", "Auto-assignment"],
      industry: ["Business", "Support", "Enterprise"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "3",
      title: "Newsletter Signup",
      description: "Optimized newsletter subscription form with preferences",
      category: "contact",
      fields: 5,
      uses: 32100,
      rating: 4.9,
      preview: ["Email", "First Name", "Interests", "Frequency", "Consent"],
      isPremium: false,
      tags: ["newsletter", "subscription", "email", "marketing"],
      difficulty: "Beginner",
      estimatedTime: "3 min",
      features: ["Email validation", "Preference selection", "GDPR compliant", "Double opt-in"],
      industry: ["Marketing", "Media", "E-commerce"],
      responsive: true,
      multiStep: false,
      hasLogic: false,
      hasPayment: false,
    },

    // Surveys & Feedback
    {
      id: "4",
      title: "Customer Satisfaction Survey",
      description: "Comprehensive survey to measure customer satisfaction and loyalty",
      category: "survey",
      fields: 12,
      uses: 15800,
      rating: 4.8,
      preview: ["Overall Rating", "Service Quality", "Likelihood to Recommend", "Comments"],
      isPremium: false,
      tags: ["survey", "feedback", "rating", "nps"],
      difficulty: "Intermediate",
      estimatedTime: "8 min",
      features: ["Rating scales", "NPS scoring", "Conditional logic", "Analytics dashboard"],
      industry: ["Retail", "Service", "SaaS"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "5",
      title: "Product Feedback Form",
      description: "Collect detailed feedback about your products and features",
      category: "survey",
      fields: 10,
      uses: 12300,
      rating: 4.7,
      preview: ["Product Rating", "Usage Frequency", "Feature Requests", "Testimonial"],
      isPremium: false,
      tags: ["product", "feedback", "features", "improvement"],
      difficulty: "Beginner",
      estimatedTime: "6 min",
      features: ["Star ratings", "Usage tracking", "Feature prioritization", "Testimonial collection"],
      industry: ["SaaS", "Technology", "E-commerce"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "6",
      title: "Employee Engagement Survey",
      description: "Measure employee satisfaction and engagement levels",
      category: "survey",
      fields: 15,
      uses: 8900,
      rating: 4.6,
      preview: ["Job Satisfaction", "Work-Life Balance", "Management Rating", "Suggestions"],
      isPremium: true,
      tags: ["employee", "engagement", "hr", "satisfaction"],
      difficulty: "Advanced",
      estimatedTime: "12 min",
      features: ["Anonymous responses", "Department filtering", "Benchmark scoring", "Action planning"],
      industry: ["HR", "Corporate", "Consulting"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // Events & Registration
    {
      id: "7",
      title: "Event Registration Form",
      description: "Complete event registration with payment and ticket selection",
      category: "event",
      fields: 15,
      uses: 11200,
      rating: 4.8,
      preview: ["Personal Info", "Ticket Type", "Dietary Requirements", "Payment"],
      isPremium: true,
      tags: ["event", "registration", "payment", "tickets"],
      difficulty: "Advanced",
      estimatedTime: "10 min",
      features: ["Payment processing", "Ticket management", "QR codes", "Email confirmations"],
      industry: ["Events", "Conference", "Entertainment"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
    },
    {
      id: "8",
      title: "Workshop Registration",
      description: "Simple workshop signup with session selection",
      category: "event",
      fields: 8,
      uses: 7600,
      rating: 4.5,
      preview: ["Name", "Email", "Workshop Selection", "Experience Level"],
      isPremium: false,
      tags: ["workshop", "training", "education", "signup"],
      difficulty: "Beginner",
      estimatedTime: "4 min",
      features: ["Session selection", "Capacity limits", "Waitlist management", "Reminders"],
      industry: ["Education", "Training", "Professional"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },

    // Business & Marketing
    {
      id: "9",
      title: "Lead Generation Form",
      description: "High-converting lead capture form for marketing campaigns",
      category: "business",
      fields: 6,
      uses: 19400,
      rating: 4.9,
      preview: ["Company Info", "Contact Details", "Budget Range", "Requirements"],
      isPremium: true,
      tags: ["lead", "generation", "marketing", "sales"],
      difficulty: "Intermediate",
      estimatedTime: "5 min",
      features: ["Lead scoring", "CRM integration", "Follow-up automation", "Conversion tracking"],
      industry: ["B2B", "Sales", "Marketing"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "10",
      title: "Quote Request Form",
      description: "Professional quote request form for service businesses",
      category: "business",
      fields: 12,
      uses: 9800,
      rating: 4.6,
      preview: ["Service Type", "Project Details", "Timeline", "Budget"],
      isPremium: false,
      tags: ["quote", "request", "service", "pricing"],
      difficulty: "Intermediate",
      estimatedTime: "7 min",
      features: ["Service selection", "File uploads", "Auto-pricing", "Quote generation"],
      industry: ["Service", "Consulting", "Agency"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // HR & Recruitment
    {
      id: "11",
      title: "Job Application Form",
      description: "Comprehensive job application with resume upload and screening",
      category: "hr",
      fields: 18,
      uses: 14500,
      rating: 4.7,
      preview: ["Personal Details", "Experience", "Skills", "Resume Upload"],
      isPremium: false,
      tags: ["job", "application", "hr", "resume", "recruitment"],
      difficulty: "Advanced",
      estimatedTime: "15 min",
      features: ["Resume parsing", "Skill assessment", "Video interviews", "ATS integration"],
      industry: ["HR", "Recruitment", "Corporate"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "12",
      title: "Employee Onboarding",
      description: "Streamlined onboarding form for new employees",
      category: "hr",
      fields: 20,
      uses: 6700,
      rating: 4.5,
      preview: ["Personal Info", "Emergency Contacts", "Tax Forms", "Equipment Request"],
      isPremium: true,
      tags: ["onboarding", "employee", "hr", "documentation"],
      difficulty: "Advanced",
      estimatedTime: "20 min",
      features: ["Document upload", "E-signatures", "Progress tracking", "Compliance checks"],
      industry: ["HR", "Corporate", "Government"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: false,
    },

    // Education
    {
      id: "13",
      title: "Course Evaluation",
      description: "Student course evaluation and instructor feedback form",
      category: "education",
      fields: 14,
      uses: 8200,
      rating: 4.6,
      preview: ["Course Rating", "Instructor Feedback", "Content Quality", "Suggestions"],
      isPremium: false,
      tags: ["education", "course", "evaluation", "feedback"],
      difficulty: "Intermediate",
      estimatedTime: "8 min",
      features: ["Anonymous feedback", "Rating scales", "Comparative analysis", "Report generation"],
      industry: ["Education", "Training", "University"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },
    {
      id: "14",
      title: "Student Registration",
      description: "Complete student registration with course selection",
      category: "education",
      fields: 16,
      uses: 5900,
      rating: 4.4,
      preview: ["Student Info", "Course Selection", "Prerequisites", "Payment"],
      isPremium: true,
      tags: ["student", "registration", "course", "enrollment"],
      difficulty: "Advanced",
      estimatedTime: "12 min",
      features: ["Course catalog", "Prerequisite checking", "Payment processing", "Schedule conflicts"],
      industry: ["Education", "University", "Training"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
    },

    // E-commerce
    {
      id: "15",
      title: "Order Form",
      description: "Professional order form with product selection and payment",
      category: "ecommerce",
      fields: 12,
      uses: 16800,
      rating: 4.8,
      preview: ["Product Selection", "Quantity", "Shipping Info", "Payment"],
      isPremium: true,
      tags: ["ecommerce", "order", "payment", "shipping"],
      difficulty: "Advanced",
      estimatedTime: "10 min",
      features: ["Product catalog", "Inventory tracking", "Shipping calculator", "Payment gateway"],
      industry: ["E-commerce", "Retail", "B2B"],
      responsive: true,
      multiStep: true,
      hasLogic: true,
      hasPayment: true,
    },
    {
      id: "16",
      title: "Return Request Form",
      description: "Customer return and refund request form",
      category: "ecommerce",
      fields: 10,
      uses: 7300,
      rating: 4.3,
      preview: ["Order Details", "Return Reason", "Condition", "Refund Method"],
      isPremium: false,
      tags: ["return", "refund", "customer service", "ecommerce"],
      difficulty: "Intermediate",
      estimatedTime: "6 min",
      features: ["Order lookup", "Photo upload", "Return tracking", "Automated processing"],
      industry: ["E-commerce", "Retail", "Customer Service"],
      responsive: true,
      multiStep: false,
      hasLogic: true,
      hasPayment: false,
    },
  ]

  const featuredTemplates = templates.filter((t) => t.uses > 15000).slice(0, 3)
  const trendingTemplates = templates.filter((t) => t.rating >= 4.8).slice(0, 4)

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

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId)
    } else {
      newFavorites.add(templateId)
    }
    setFavorites(newFavorites)
  }

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

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderTemplateCard = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Header with Premium Badge */}
      <div className="relative">
        {template.isPremium && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-2 flex items-center justify-center">
            <Zap className="w-3 h-3 mr-1" />
            Premium Template
          </div>
        )}

        {/* Quick Stats Bar */}
        <div
          className={`${template.isPremium ? "mt-8" : "mt-0"} bg-gray-50 px-4 py-2 flex items-center justify-between text-xs text-gray-600`}
        >
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {template.estimatedTime}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {template.hasPayment && <span className="text-green-600">💳</span>}
            {template.multiStep && <span className="text-blue-600">📋</span>}
            {template.hasLogic && <span className="text-purple-600">🔀</span>}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {template.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>

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

        {/* Features Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="text-xs text-gray-400">+{template.features.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Industry Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {template.industry.slice(0, 2).map((industry, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleUseTemplate(template)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
            Use Template
          </button>
          <button
            onClick={() => handlePreviewTemplate(template)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Add to Favorites"
          >
            {favorites.has(template.id) ? (
              <BookmarkCheck className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            ) : (
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderTemplateList = (template) => (
    <motion.div
      key={template.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex-1 mb-4 lg:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {template.title}
            </h3>
            <div className="flex items-center space-x-2">
              {template.isPremium && (
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Premium
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-3">{template.description}</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-3">
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
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {template.estimatedTime}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 4).map((feature, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
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
          <button
            onClick={() => handlePreviewTemplate(template)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(template.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            {favorites.has(template.id) ? (
              <BookmarkCheck className="w-4 h-4 text-red-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
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

          {/* Featured Templates Section */}
          {selectedCategory === "all" && !searchTerm && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Featured Templates</h2>
                <span className="text-sm text-gray-500">Most popular this month</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {featuredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="relative bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Featured</span>
                        <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                      <p className="text-white/80 text-sm mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">{template.uses.toLocaleString()} uses</span>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Templates */}
          {selectedCategory === "all" && !searchTerm && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Trending Templates
                </h2>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {trendingTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Trending</span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        {template.rating}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                    <p className="text-xs text-gray-600 mb-3">{template.uses.toLocaleString()} uses</p>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Use Template
                    </button>
                  </motion.div>
                ))}
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

              {/* Sort and Filters */}
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

                {isMobile && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className={`mt-6 ${isMobile && !showFilters ? "hidden" : ""}`}>
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
                    <span className="text-xs opacity-75">({category.count})</span>
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

      {/* Template Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">{selectedTemplate.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Fields:</span> {selectedTemplate.fields}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Difficulty:</span> {selectedTemplate.difficulty}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time:</span> {selectedTemplate.estimatedTime}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Rating:</span> {selectedTemplate.rating}/5
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Features:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.features.map((feature, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Form Fields Preview:</h3>
                    <div className="space-y-2">
                      {selectedTemplate.preview.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="text-sm font-medium text-gray-700">{field}</div>
                          <div className="mt-1 h-8 bg-white border border-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        handleUseTemplate(selectedTemplate)
                        setShowPreview(false)
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Use This Template
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedTemplate.id)}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {favorites.has(selectedTemplate.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-red-500" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && <MobileNavigation activePath="/templates" />}
    </div>
  )
}
