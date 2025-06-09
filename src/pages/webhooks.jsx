"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Activity,
  Menu,
  X,
  Search,
  Eye,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"

export default function Webhooks() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [webhooks, setWebhooks] = useState([
    {
      id: "1",
      name: "Slack Notifications",
      url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      events: ["form.submitted", "form.updated"],
      status: "active",
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      successRate: 98.5,
      totalCalls: 1247,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "CRM Integration",
      url: "https://api.mycrm.com/webhooks/formwise",
      events: ["form.submitted"],
      status: "active",
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      successRate: 95.2,
      totalCalls: 856,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Analytics Tracker",
      url: "https://analytics.example.com/webhook",
      events: ["form.submitted", "form.viewed"],
      status: "paused",
      lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
      successRate: 89.7,
      totalCalls: 432,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [webhookLogs, setWebhookLogs] = useState([])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const availableEvents = [
    { id: "form.submitted", label: "Form Submitted", description: "Triggered when a form is submitted" },
    { id: "form.updated", label: "Form Updated", description: "Triggered when a form is updated" },
    { id: "form.viewed", label: "Form Viewed", description: "Triggered when a form is viewed" },
    { id: "form.created", label: "Form Created", description: "Triggered when a new form is created" },
    { id: "form.deleted", label: "Form Deleted", description: "Triggered when a form is deleted" },
  ]

  const filteredWebhooks = webhooks.filter((webhook) => {
    const matchesSearch =
      webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.url.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || webhook.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateWebhook = (webhookData) => {
    const newWebhook = {
      id: Date.now().toString(),
      ...webhookData,
      status: "active",
      lastTriggered: null,
      successRate: 100,
      totalCalls: 0,
      createdAt: new Date(),
    }
    setWebhooks([...webhooks, newWebhook])
    setShowCreateModal(false)
  }

  const handleEditWebhook = (webhookData) => {
    setWebhooks(webhooks.map((w) => (w.id === selectedWebhook.id ? { ...w, ...webhookData } : w)))
    setShowEditModal(false)
    setSelectedWebhook(null)
  }

  const handleDeleteWebhook = (webhookId) => {
    if (window.confirm("Are you sure you want to delete this webhook?")) {
      setWebhooks(webhooks.filter((w) => w.id !== webhookId))
    }
  }

  const handleToggleStatus = (webhookId) => {
    setWebhooks(
      webhooks.map((w) => (w.id === webhookId ? { ...w, status: w.status === "active" ? "paused" : "active" } : w)),
    )
  }

  const handleTestWebhook = async (webhook) => {
    // Simulate webhook test
    console.log("Testing webhook:", webhook.name)
    // In a real app, you would make an API call here
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    // You could show a toast notification here
  }

  const handleViewLogs = (webhook) => {
    // Generate mock logs
    const mockLogs = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "success",
        statusCode: 200,
        responseTime: 245,
        event: "form.submitted",
        payload: { formId: "form_123", responseId: "resp_456" },
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: "success",
        statusCode: 200,
        responseTime: 189,
        event: "form.submitted",
        payload: { formId: "form_123", responseId: "resp_455" },
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "error",
        statusCode: 500,
        responseTime: 5000,
        event: "form.submitted",
        payload: { formId: "form_123", responseId: "resp_454" },
        error: "Internal Server Error",
      },
    ]
    setWebhookLogs(mockLogs)
    setSelectedWebhook(webhook)
    setShowLogsModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "paused":
        return <Pause className="w-4 h-4" />
      case "error":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (date) => {
    if (!date) return "Never"
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

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
              <h1 className="text-lg font-bold text-gray-900">Webhooks</h1>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Webhooks</h1>
                <p className="text-gray-600 mt-1">Manage webhook endpoints for real-time form notifications</p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Webhooks</p>
                  <p className="text-2xl font-bold text-gray-900">{webhooks.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {webhooks.filter((w) => w.status === "active").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {webhooks.reduce((sum, w) => sum + w.totalCalls, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {webhooks.length > 0
                      ? (webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-yellow-600" />
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
                    placeholder="Search webhooks..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="error">Error</option>
                </select>

                {isMobile && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Webhooks List */}
          <div className="space-y-4">
            {filteredWebhooks.map((webhook) => (
              <motion.div
                key={webhook.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}
                      >
                        {getStatusIcon(webhook.status)}
                        <span className="ml-1 capitalize">{webhook.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-mono truncate">{webhook.url}</span>
                      <button
                        onClick={() => handleCopyUrl(webhook.url)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        {webhook.totalCalls} calls
                      </span>
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        {webhook.successRate}% success
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Last: {formatTimeAgo(webhook.lastTriggered)}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <span key={event} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewLogs(webhook)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Logs"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTestWebhook(webhook)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Test Webhook"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWebhook(webhook)
                        setShowEditModal(true)
                      }}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(webhook.id)}
                      className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title={webhook.status === "active" ? "Pause" : "Activate"}
                    >
                      {webhook.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredWebhooks.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks found</h3>
              <p className="text-gray-600 mb-6">Create your first webhook to start receiving real-time notifications</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Webhook
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Webhook Modal */}
      <WebhookModal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
          setSelectedWebhook(null)
        }}
        onSave={showCreateModal ? handleCreateWebhook : handleEditWebhook}
        webhook={selectedWebhook}
        availableEvents={availableEvents}
        isEdit={showEditModal}
      />

      {/* Logs Modal */}
      <LogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        webhook={selectedWebhook}
        logs={webhookLogs}
      />

      {isMobile && <MobileNavigation activePath="/webhooks" />}
    </div>
  )
}

// Webhook Modal Component
const WebhookModal = ({ isOpen, onClose, onSave, webhook, availableEvents, isEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    events: [],
    headers: {},
    secret: "",
  })

  useEffect(() => {
    if (webhook && isEdit) {
      setFormData({
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        headers: {},
        secret: "",
      })
    } else {
      setFormData({
        name: "",
        url: "",
        events: [],
        headers: {},
        secret: "",
      })
    }
  }, [webhook, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleEventToggle = (eventId) => {
    setFormData({
      ...formData,
      events: formData.events.includes(eventId)
        ? formData.events.filter((e) => e !== eventId)
        : [...formData.events, eventId],
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{isEdit ? "Edit Webhook" : "Create Webhook"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My Webhook"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://your-webhook-url.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableEvents.map((event) => (
                  <label key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event.id)}
                      onChange={() => handleEventToggle(event.id)}
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.label}</div>
                      <div className="text-xs text-gray-500">{event.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret (Optional)</label>
              <input
                type="password"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Webhook secret for verification"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                {isEdit ? "Update Webhook" : "Create Webhook"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Logs Modal Component
const LogsModal = ({ isOpen, onClose, webhook, logs }) => {
  if (!isOpen) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Webhook Logs</h2>
              <p className="text-sm text-gray-600">{webhook?.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${getStatusColor(log.status)}`}>
                      {log.status === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>
                    <span className="text-sm font-medium">{log.event}</span>
                    <span className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{log.statusCode}</span>
                    <span>•</span>
                    <span>{log.responseTime}ms</span>
                  </div>
                </div>

                {log.error && <div className="text-sm text-red-600 mb-2">{log.error}</div>}

                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">View Payload</summary>
                  <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </details>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No logs available</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
