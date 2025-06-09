"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Search,
  Star,
  Check,
  Plus,
  ExternalLink,
  Settings,
  Zap,
  MessageSquare,
  Database,
  BarChart3,
  FileText,
  Users,
  CreditCard,
  Code,
  CheckCircle,
  Clock,
  Menu,
  X,
  Crown,
  Sparkles,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Integrations() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [connectedIntegrations, setConnectedIntegrations] = useState(new Set(["slack", "google-sheets"]))
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [showConfigModal, setShowConfigModal] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = [
    { id: "all", label: "All Integrations", icon: <Zap className="w-4 h-4" />, count: 24 },
    { id: "communication", label: "Communication", icon: <MessageSquare className="w-4 h-4" />, count: 6 },
    { id: "productivity", label: "Productivity", icon: <FileText className="w-4 h-4" />, count: 5 },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, count: 4 },
    { id: "crm", label: "CRM & Sales", icon: <Users className="w-4 h-4" />, count: 4 },
    { id: "payment", label: "Payments", icon: <CreditCard className="w-4 h-4" />, count: 3 },
    { id: "storage", label: "Storage", icon: <Database className="w-4 h-4" />, count: 2 },
  ]

  const integrations = [
    // Communication
    {
      id: "slack",
      name: "Slack",
      description: "Send form responses directly to Slack channels",
      category: "communication",
      icon: "💬",
      color: "from-purple-500 to-purple-600",
      isPremium: false,
      isPopular: true,
      features: ["Real-time notifications", "Custom channel routing", "Rich message formatting"],
      setupTime: "2 min",
      rating: 4.9,
      users: "50K+",
    },
    {
      id: "discord",
      name: "Discord",
      description: "Post form submissions to Discord servers",
      category: "communication",
      icon: "🎮",
      color: "from-indigo-500 to-indigo-600",
      isPremium: false,
      isPopular: false,
      features: ["Server webhooks", "Embed messages", "Role mentions"],
      setupTime: "3 min",
      rating: 4.7,
      users: "25K+",
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      description: "Collaborate on form responses in Teams",
      category: "communication",
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      isPremium: true,
      isPopular: false,
      features: ["Team notifications", "Adaptive cards", "Channel integration"],
      setupTime: "5 min",
      rating: 4.6,
      users: "30K+",
    },

    // Productivity
    {
      id: "google-sheets",
      name: "Google Sheets",
      description: "Automatically sync responses to Google Sheets",
      category: "productivity",
      icon: "📊",
      color: "from-green-500 to-green-600",
      isPremium: false,
      isPopular: true,
      features: ["Real-time sync", "Custom column mapping", "Multiple sheets"],
      setupTime: "2 min",
      rating: 4.8,
      users: "100K+",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Create database entries from form submissions",
      category: "productivity",
      icon: "📝",
      color: "from-gray-700 to-gray-800",
      isPremium: false,
      isPopular: true,
      features: ["Database creation", "Property mapping", "Template support"],
      setupTime: "4 min",
      rating: 4.7,
      users: "75K+",
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Send form data to Airtable bases",
      category: "productivity",
      icon: "🗂️",
      color: "from-orange-500 to-orange-600",
      isPremium: false,
      isPopular: false,
      features: ["Base integration", "Field mapping", "Attachment support"],
      setupTime: "3 min",
      rating: 4.6,
      users: "40K+",
    },

    // Analytics
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Track form conversions and user behavior",
      category: "analytics",
      icon: "📈",
      color: "from-blue-500 to-blue-600",
      isPremium: false,
      isPopular: true,
      features: ["Event tracking", "Goal conversion", "Custom dimensions"],
      setupTime: "3 min",
      rating: 4.8,
      users: "80K+",
    },
    {
      id: "mixpanel",
      name: "Mixpanel",
      description: "Advanced analytics for form interactions",
      category: "analytics",
      icon: "🔍",
      color: "from-purple-500 to-pink-500",
      isPremium: true,
      isPopular: false,
      features: ["User tracking", "Funnel analysis", "Cohort reports"],
      setupTime: "5 min",
      rating: 4.5,
      users: "15K+",
    },

    // CRM & Sales
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Create contacts and deals from form submissions",
      category: "crm",
      icon: "🎯",
      color: "from-orange-500 to-red-500",
      isPremium: false,
      isPopular: true,
      features: ["Contact creation", "Deal tracking", "Lead scoring"],
      setupTime: "4 min",
      rating: 4.7,
      users: "60K+",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync leads and opportunities with Salesforce",
      category: "crm",
      icon: "☁️",
      color: "from-blue-600 to-indigo-600",
      isPremium: true,
      isPopular: false,
      features: ["Lead management", "Opportunity creation", "Custom objects"],
      setupTime: "10 min",
      rating: 4.6,
      users: "35K+",
    },

    // Payments
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments through your forms",
      category: "payment",
      icon: "💳",
      color: "from-purple-600 to-blue-600",
      isPremium: true,
      isPopular: true,
      features: ["Payment processing", "Subscription billing", "Invoice generation"],
      setupTime: "8 min",
      rating: 4.9,
      users: "45K+",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Collect payments via PayPal",
      category: "payment",
      icon: "💰",
      color: "from-blue-500 to-blue-600",
      isPremium: false,
      isPopular: false,
      features: ["One-time payments", "Recurring billing", "Express checkout"],
      setupTime: "5 min",
      rating: 4.4,
      users: "30K+",
    },

    // Storage
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Save form attachments to Dropbox",
      category: "storage",
      icon: "📦",
      color: "from-blue-500 to-blue-600",
      isPremium: false,
      isPopular: false,
      features: ["File uploads", "Folder organization", "Shared links"],
      setupTime: "3 min",
      rating: 4.5,
      users: "20K+",
    },
  ]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleConnect = (integrationId) => {
    const integration = integrations.find((i) => i.id === integrationId)
    setSelectedIntegration(integration)
    setShowConfigModal(true)
  }

  const handleDisconnect = (integrationId) => {
    const newConnected = new Set(connectedIntegrations)
    newConnected.delete(integrationId)
    setConnectedIntegrations(newConnected)
  }

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      const newConnected = new Set(connectedIntegrations)
      newConnected.add(selectedIntegration.id)
      setConnectedIntegrations(newConnected)
    }
    setShowConfigModal(false)
    setSelectedIntegration(null)
  }

  const renderIntegrationCard = (integration) => (
    <motion.div
      key={integration.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="relative">
        {integration.isPremium && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-2 flex items-center justify-center">
            <Crown className="w-3 h-3 mr-1" />
            Premium Integration
          </div>
        )}

        {integration.isPopular && !integration.isPremium && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium px-3 py-2 flex items-center justify-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Popular
          </div>
        )}

        <div
          className={`${integration.isPremium || integration.isPopular ? "mt-8" : "mt-0"} bg-gray-50 px-4 py-3 flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-r ${integration.color} rounded-lg flex items-center justify-center text-white text-lg`}
            >
              {integration.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{integration.name}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {integration.setupTime}
                </span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                  {integration.rating}
                </span>
                <span>{integration.users} users</span>
              </div>
            </div>
          </div>

          {connectedIntegrations.has(integration.id) ? (
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Not connected</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
          <div className="space-y-1">
            {integration.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <Check className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {connectedIntegrations.has(integration.id) ? (
            <>
              <button
                onClick={() => handleConnect(integration.id)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
              <button
                onClick={() => handleDisconnect(integration.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => handleConnect(integration.id)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4" />
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
              <h1 className="text-lg font-bold text-gray-900">Integrations</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-600 mt-1">Connect FormWise with your favorite tools and services</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {connectedIntegrations.size} of {integrations.length} connected
                </span>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Custom Integration
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Connected</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedIntegrations.size}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Premium</p>
                  <p className="text-2xl font-bold text-gray-900">{integrations.filter((i) => i.isPremium).length}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
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

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map(renderIntegrationCard)}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
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

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && selectedIntegration && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfigModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${selectedIntegration.color} rounded-lg flex items-center justify-center text-white text-lg`}
                    >
                      {selectedIntegration.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedIntegration.name}</h2>
                      <p className="text-sm text-gray-600">Configure integration settings</p>
                    </div>
                  </div>
                  <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your API key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://your-webhook-url.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Settings</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Send notifications for new responses</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Include form metadata</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveConfig}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Save Configuration
                    </button>
                    <button
                      onClick={() => setShowConfigModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && <MobileNavigation activePath="/integrations" />}
    </div>
  )
}
