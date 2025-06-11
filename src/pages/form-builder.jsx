"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import {
  Type,
  AlignLeft,
  CheckSquare,
  Circle,
  Star,
  Calendar,
  Upload,
  Hash,
  Mail,
  Phone,
  Link,
  ImageIcon,
  FileText,
  Save,
  Eye,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  ChevronDown,
  X,
  Palette,
  MousePointer,
  Layers,
  ArrowLeft,
  Globe,
  Zap,
  MoreVertical,
  ChevronLeft,
  Layout,
  Edit2,
  Sliders,
} from "lucide-react"
import Sidebar from "../components/sidebar"
import MobileNavigation from "../components/mobile-navigation"
import { useForms } from "../hooks/use-forms"
import { useAuth } from "../hooks/use-auth"

export default function FormBuilder() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createForm, updateForm, getForm } = useForms()

  // Responsive states
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState("desktop")
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [mobileEditMode, setMobileEditMode] = useState("fields") // fields, design, logic, settings
  const [showMobileFieldOptions, setShowMobileFieldOptions] = useState(false)
  const [showMobileContextMenu, setShowMobileContextMenu] = useState(null)

  // Mobile FAB states
  const [showMobileFAB, setShowMobileFAB] = useState(false)
  const [isFABOpen, setIsFABOpen] = useState(false)

  // Form states
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formSettings, setFormSettings] = useState({
    theme: "modern",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    submitButtonText: "Submit",
    thankYouMessage: "Thank you for your submission!",
    collectEmail: false,
    allowMultipleSubmissions: true,
  })

  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const fieldContainerRef = useRef(null)

  // Enhanced responsive detection with more breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      let newScreenSize = "desktop"
      const isMobileView = width < 768

      if (width < 480) {
        newScreenSize = "mobile-sm"
      } else if (width < 640) {
        newScreenSize = "mobile"
      } else if (width < 768) {
        newScreenSize = "tablet-sm"
      } else if (width < 1024) {
        newScreenSize = "tablet"
      } else if (width < 1280) {
        newScreenSize = "desktop-sm"
      } else {
        newScreenSize = "desktop"
      }

      setScreenSize(newScreenSize)
      setIsMobile(isMobileView)
      setShowMobileFAB(isMobileView)

      // Auto-close panels on larger screens
      if (newScreenSize.includes("desktop")) {
        setShowLeftPanel(false)
        setShowRightPanel(false)
        setShowMobilePreview(false)
        setIsFABOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Load form data if editing
  useEffect(() => {
    if (formId && formId !== "new") {
      loadForm()
    }
  }, [formId])

  const loadForm = async () => {
    if (!formId || formId === "new") return

    try {
      const form = await getForm(formId)
      if (form) {
        setFormTitle(form.title || "Untitled Form")
        setFormDescription(form.description || "")
        setFields(
          form.fields?.map((field) => ({
            ...field,
            options: field.options || [],
          })) || [],
        )
        setFormSettings(
          form.settings || {
            theme: "modern",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            submitButtonText: "Submit",
            thankYouMessage: "Thank you for your submission!",
            collectEmail: false,
            allowMultipleSubmissions: true,
          },
        )
      }
    } catch (error) {
      console.error("Error loading form:", error)
    }
  }

  const fieldTypes = [
    { type: "text", label: "Short Text", icon: <Type className="w-4 h-4" />, category: "basic" },
    { type: "textarea", label: "Long Text", icon: <AlignLeft className="w-4 h-4" />, category: "basic" },
    { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, category: "basic" },
    { type: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, category: "basic" },
    { type: "number", label: "Number", icon: <Hash className="w-4 h-4" />, category: "basic" },
    { type: "url", label: "Website URL", icon: <Link className="w-4 h-4" />, category: "basic" },
    { type: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, category: "basic" },
    { type: "checkbox", label: "Checkboxes", icon: <CheckSquare className="w-4 h-4" />, category: "choice" },
    { type: "radio", label: "Multiple Choice", icon: <Circle className="w-4 h-4" />, category: "choice" },
    { type: "select", label: "Dropdown", icon: <ChevronDown className="w-4 h-4" />, category: "choice" },
    { type: "rating", label: "Rating", icon: <Star className="w-4 h-4" />, category: "advanced" },
    { type: "file", label: "File Upload", icon: <Upload className="w-4 h-4" />, category: "advanced" },
    { type: "image", label: "Image Upload", icon: <ImageIcon className="w-4 h-4" />, category: "advanced" },
  ]

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: `${fieldTypes.find((f) => f.type === type)?.label || "Field"}`,
      required: false,
      options: type === "checkbox" || type === "radio" || type === "select" ? ["Option 1", "Option 2"] : [],
    }
    setFields([...fields, newField])
    setSelectedField(newField.id)

    // Close mobile panels after adding field
    if (screenSize !== "desktop") {
      setShowLeftPanel(false)
      setIsFABOpen(false)

      // Auto-scroll to the new field in mobile view
      setTimeout(() => {
        if (fieldContainerRef.current) {
          fieldContainerRef.current.scrollTop = fieldContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }

  const updateField = (id, updates) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id))
    if (selectedField === id) {
      setSelectedField(null)
    }
    setShowMobileContextMenu(null)
  }

  const duplicateField = (id) => {
    const field = fields.find((f) => f.id === id)
    if (field) {
      const newField = { ...field, id: `field_${Date.now()}`, label: `${field.label} (Copy)` }
      const index = fields.findIndex((f) => f.id === id)
      const newFields = [...fields]
      newFields.splice(index + 1, 0, newField)
      setFields(newFields)
    }
    setShowMobileContextMenu(null)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields,
        settings: formSettings,
        status: "draft",
      }

      if (formId && formId !== "new") {
        await updateForm(formId, formData)
      } else {
        const newFormId = await createForm(formData)
        navigate(`/builder/${newFormId}`)
      }
    } catch (error) {
      console.error("Error saving form:", error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!user) return

    setSaving(true)
    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields,
        settings: formSettings,
        status: "published",
      }

      if (formId && formId !== "new") {
        await updateForm(formId, formData)
      } else {
        const newFormId = await createForm(formData)
        navigate(`/builder/${newFormId}`)
      }
    } catch (error) {
      console.error("Error publishing form:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (index) => {
    dragItem.current = index
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedItem = fields[dragItem.current]
      const newFields = [...fields]
      newFields.splice(dragItem.current, 1)
      newFields.splice(dragOverItem.current, 0, draggedItem)
      setFields(newFields)
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  // Mobile touch drag handlers
  const handleTouchDragStart = (index) => {
    dragItem.current = index
    // Add visual feedback for drag start
    const element = document.getElementById(`field-${fields[index].id}`)
    if (element) {
      element.classList.add("bg-purple-50", "border-purple-300", "shadow-lg")
    }
  }

  const handleTouchDragMove = (e, index) => {
    e.preventDefault()
    if (dragItem.current === null) return

    dragOverItem.current = index

    // Visual feedback for potential drop target
    const elements = document.querySelectorAll(".field-item")
    elements.forEach((el, i) => {
      if (i === index && i !== dragItem.current) {
        el.classList.add("border-blue-300", "bg-blue-50")
      } else if (i !== dragItem.current) {
        el.classList.remove("border-blue-300", "bg-blue-50")
      }
    })
  }

  const handleTouchDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const draggedItem = fields[dragItem.current]
      const newFields = [...fields]
      newFields.splice(dragItem.current, 1)
      newFields.splice(dragOverItem.current, 0, draggedItem)
      setFields(newFields)
    }

    // Remove all visual feedback
    const elements = document.querySelectorAll(".field-item")
    elements.forEach((el) => {
      el.classList.remove("bg-purple-50", "border-purple-300", "shadow-lg", "border-blue-300", "bg-blue-50")
    })

    dragItem.current = null
    dragOverItem.current = null
  }

  // Mobile FAB actions
  const mobileActions = [
    {
      id: "add-field",
      label: "Add Field",
      icon: <Plus className="w-5 h-5" />,
      color: "bg-purple-600",
      action: () => setShowLeftPanel(true),
    },
    {
      id: "preview",
      label: "Preview",
      icon: <Eye className="w-5 h-5" />,
      color: "bg-blue-600",
      action: () => setShowMobilePreview(!showMobilePreview),
    },
    {
      id: "design",
      label: "Design",
      icon: <Palette className="w-5 h-5" />,
      color: "bg-pink-600",
      action: () => setMobileEditMode("design"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-gray-600",
      action: () => setMobileEditMode("settings"),
    },
  ]

  const renderField = (field, isPreview = false) => {
    const baseClasses = isPreview
      ? "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      : "w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
      case "url":
        return (
          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseClasses}
            disabled={!isPreview}
          />
        )
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={`${baseClasses} h-24 resize-none`}
            disabled={!isPreview}
          />
        )
      case "date":
        return <input type="date" className={baseClasses} disabled={!isPreview} />
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={!isPreview}
                />
                <span className={isPreview ? "text-gray-700" : "text-sm text-gray-600"}>{option}</span>
              </label>
            ))}
          </div>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  className="border-gray-300 text-purple-600 focus:ring-purple-500"
                  disabled={!isPreview}
                />
                <span className={isPreview ? "text-gray-700" : "text-sm text-gray-600"}>{option}</span>
              </label>
            ))}
          </div>
        )
      case "select":
        return (
          <select className={baseClasses} disabled={!isPreview}>
            <option>Choose an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer ${isPreview ? "" : "pointer-events-none"}`}
              />
            ))}
          </div>
        )
      case "file":
        return (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${isPreview ? "hover:border-purple-400" : ""}`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      case "image":
        return (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${isPreview ? "hover:border-purple-400" : ""}`}
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        )
      default:
        return <div className="text-gray-400 text-sm">Unknown field type</div>
    }
  }

  const selectedFieldData = fields.find((f) => f.id === selectedField)

  const renderLeftPanel = () => (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Mobile/Tablet header */}
      {screenSize !== "desktop" && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Add Fields</h3>
          <button onClick={() => setShowLeftPanel(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Tabs for mobile/tablet */}
      {screenSize !== "desktop" && (
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: "fields", label: "Fields", icon: <Layers className="w-4 h-4" /> },
            { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
            { id: "logic", label: "Logic", icon: <Zap className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 px-4 py-3 text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {(screenSize === "desktop" || activeTab === "fields") && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Field Types</h3>

            {/* Basic Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Basic</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "basic")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Choice Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Choice</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "choice")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Advanced Fields */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced</h4>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes
                  .filter((f) => f.category === "advanced")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600 mb-2">{fieldType.icon}</div>
                      <span className="text-xs font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>
          </>
        )}

        {screenSize !== "desktop" && activeTab === "design" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Design Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={formSettings.theme}
                onChange={(e) => setFormSettings({ ...formSettings, theme: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        {screenSize !== "desktop" && activeTab === "logic" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Logic & Rules</h3>
            <p className="text-sm text-gray-600">Conditional logic features coming soon!</p>
          </div>
        )}

        {screenSize !== "desktop" && activeTab === "settings" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
              <input
                type="text"
                value={formSettings.submitButtonText}
                onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thank You Message</label>
              <textarea
                value={formSettings.thankYouMessage}
                onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.collectEmail}
                  onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Collect email addresses</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.allowMultipleSubmissions}
                  onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow multiple submissions</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderRightPanel = () => (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      {screenSize !== "desktop" && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Properties</h3>
          <button onClick={() => setShowRightPanel(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Field Properties</h3>

        {selectedFieldData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={selectedFieldData.description || ""}
                onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                rows={2}
                placeholder="Optional field description"
              />
            </div>

            {(selectedFieldData.type === "text" ||
              selectedFieldData.type === "textarea" ||
              selectedFieldData.type === "email") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            {(selectedFieldData.type === "checkbox" ||
              selectedFieldData.type === "radio" ||
              selectedFieldData.type === "select") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedFieldData.options || [])]
                          newOptions[index] = e.target.value
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter((_, i) => i !== index)
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedFieldData.options || []),
                        `Option ${(selectedFieldData.options?.length || 0) + 1}`,
                      ]
                      updateField(selectedFieldData.id, { options: newOptions })
                    }}
                    className="w-full p-2 border border-dashed border-gray-300 rounded text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={selectedFieldData.required}
                onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                Required field
              </label>
            </div>

            {/* Validation Rules */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Validation</h4>

              {selectedFieldData.type === "text" && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Length</label>
                    <input
                      type="number"
                      value={selectedFieldData.validation?.minLength || ""}
                      onChange={(e) =>
                        updateField(selectedFieldData.id, {
                          validation: {
                            ...selectedFieldData.validation,
                            minLength: Number.parseInt(e.target.value) || undefined,
                          },
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Length</label>
                    <input
                      type="number"
                      value={selectedFieldData.validation?.maxLength || ""}
                      onChange={(e) =>
                        updateField(selectedFieldData.id, {
                          validation: {
                            ...selectedFieldData.validation,
                            maxLength: Number.parseInt(e.target.value) || undefined,
                          },
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MousePointer className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Select a field to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  )

  // Desktop design panel
  const renderDesignPanel = () => (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Design Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {["modern", "classic", "minimal"].map((theme) => (
                <button
                  key={theme}
                  className={`p-3 border rounded-lg text-center text-sm capitalize ${
                    formSettings.theme === theme
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormSettings({ ...formSettings, theme: theme })}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={formSettings.backgroundColor}
                onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={formSettings.textColor}
                onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
            <input
              type="text"
              value={formSettings.submitButtonText}
              onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thank You Message</label>
            <textarea
              value={formSettings.thankYouMessage}
              onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Desktop logic panel
  const renderLogicPanel = () => (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Logic & Rules</h3>

        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h4 className="text-sm font-medium text-purple-800 mb-2">Coming Soon</h4>
            <p className="text-sm text-purple-700">
              Conditional logic will allow you to show or hide fields based on user responses.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Example Logic Rule</h4>
            <div className="space-y-2 opacity-60">
              <div className="flex items-center space-x-2">
                <span className="text-sm">If</span>
                <select disabled className="text-sm p-1 border border-gray-300 rounded">
                  <option>Question 1</option>
                </select>
                <select disabled className="text-sm p-1 border border-gray-300 rounded">
                  <option>is equal to</option>
                </select>
                <select disabled className="text-sm p-1 border border-gray-300 rounded">
                  <option>Yes</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Then</span>
                <select disabled className="text-sm p-1 border border-gray-300 rounded">
                  <option>show</option>
                </select>
                <select disabled className="text-sm p-1 border border-gray-300 rounded">
                  <option>Question 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Desktop settings panel
  const renderSettingsPanel = () => (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Submission Settings</h4>
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.collectEmail}
                  onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Collect email addresses</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formSettings.allowMultipleSubmissions}
                  onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow multiple submissions</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notifications</h4>
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm font-medium text-gray-700">Email notifications on submission</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Privacy</h4>
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm font-medium text-gray-700">Enable GDPR compliance features</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile field editor
  const renderMobileFieldEditor = () => {
    if (!selectedFieldData) return null

    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={() => setShowMobileFieldOptions(false)} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold">Edit {selectedFieldData.label}</h3>
            <button
              onClick={() => {
                setShowMobileFieldOptions(false)
                setSelectedField(null)
              }}
              className="p-2 text-purple-600 font-medium"
            >
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                {fieldTypes.find((f) => f.type === selectedFieldData.type)?.icon}
                <span className="ml-2 text-gray-700">
                  {fieldTypes.find((f) => f.type === selectedFieldData.type)?.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={selectedFieldData.description || ""}
                onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={2}
                placeholder="Add a description (optional)"
              />
            </div>

            {(selectedFieldData.type === "text" ||
              selectedFieldData.type === "textarea" ||
              selectedFieldData.type === "email") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={selectedFieldData.placeholder || ""}
                  onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {(selectedFieldData.type === "checkbox" ||
              selectedFieldData.type === "radio" ||
              selectedFieldData.type === "select") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedFieldData.options || [])]
                          newOptions[index] = e.target.value
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter((_, i) => i !== index)
                          updateField(selectedFieldData.id, { options: newOptions })
                        }}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedFieldData.options || []),
                        `Option ${(selectedFieldData.options?.length || 0) + 1}`,
                      ]
                      updateField(selectedFieldData.id, { options: newOptions })
                    }}
                    className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Required field</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={() => deleteField(selectedFieldData.id)}
                className="w-full p-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Field
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile context menu
  const renderMobileContextMenu = () => {
    if (!showMobileContextMenu) return null

    const fieldId = showMobileContextMenu
    const field = fields.find((f) => f.id === fieldId)
    if (!field) return null

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-30" onClick={() => setShowMobileContextMenu(null)}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

          <h3 className="font-medium text-gray-900 mb-2">{field.label}</h3>

          <button
            onClick={() => {
              setSelectedField(fieldId)
              setShowMobileFieldOptions(true)
              setShowMobileContextMenu(null)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg"
          >
            <Edit2 className="w-5 h-5 mr-3 text-gray-600" />
            <span>Edit field</span>
          </button>

          <button
            onClick={() => {
              duplicateField(fieldId)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg"
          >
            <Copy className="w-5 h-5 mr-3 text-gray-600" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => {
              deleteField(fieldId)
            }}
            className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-red-600"
          >
            <Trash2 className="w-5 h-5 mr-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    )
  }

  // Mobile design editor
  const renderMobileDesignEditor = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={() => setMobileEditMode("fields")} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold">Design</h3>
            <button onClick={() => setMobileEditMode("fields")} className="p-2 text-purple-600 font-medium">
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {["modern", "classic", "minimal"].map((theme) => (
                  <button
                    key={theme}
                    className={`p-4 border rounded-lg text-center ${
                      formSettings.theme === theme
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormSettings({ ...formSettings, theme: theme })}
                  >
                    <div className="h-12 mb-2 flex items-center justify-center">
                      <Layout className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="text-sm capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Colors</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Background</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: formSettings.backgroundColor }}
                    ></div>
                    <input
                      type="color"
                      value={formSettings.backgroundColor}
                      onChange={(e) => setFormSettings({ ...formSettings, backgroundColor: e.target.value })}
                      className="sr-only"
                      id="bg-color-picker"
                    />
                    <label
                      htmlFor="bg-color-picker"
                      className="flex-1 p-3 border border-gray-200 rounded-lg text-sm text-gray-700"
                    >
                      {formSettings.backgroundColor}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2">Text</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: formSettings.textColor }}
                    ></div>
                    <input
                      type="color"
                      value={formSettings.textColor}
                      onChange={(e) => setFormSettings({ ...formSettings, textColor: e.target.value })}
                      className="sr-only"
                      id="text-color-picker"
                    />
                    <label
                      htmlFor="text-color-picker"
                      className="flex-1 p-3 border border-gray-200 rounded-lg text-sm text-gray-700"
                    >
                      {formSettings.textColor}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Button</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Submit Button Text</label>
                <input
                  type="text"
                  value={formSettings.submitButtonText}
                  onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Confirmation</h4>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Thank You Message</label>
                <textarea
                  value={formSettings.thankYouMessage}
                  onChange={(e) => setFormSettings({ ...formSettings, thankYouMessage: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile settings editor
  const renderMobileSettingsEditor = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={() => setMobileEditMode("fields")} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold">Settings</h3>
            <button onClick={() => setMobileEditMode("fields")} className="p-2 text-purple-600 font-medium">
              Done
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Submission Settings</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formSettings.collectEmail}
                    onChange={(e) => setFormSettings({ ...formSettings, collectEmail: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">Collect email addresses</span>
                    <span className="text-xs text-gray-500">Require respondents to sign in</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 pt-2 border-t border-gray-200 mt-2">
                  <input
                    type="checkbox"
                    checked={formSettings.allowMultipleSubmissions}
                    onChange={(e) => setFormSettings({ ...formSettings, allowMultipleSubmissions: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">Allow multiple submissions</span>
                    <span className="text-xs text-gray-500">Users can submit more than once</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Notifications</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">Email notifications</span>
                    <span className="text-xs text-gray-500">Get notified when someone submits your form</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Privacy</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">GDPR compliance</span>
                    <span className="text-xs text-gray-500">Add privacy policy and consent checkboxes</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Floating Action Button
  const renderMobileFAB = () => {
    if (!showMobileFAB || !isMobile) return null

    return (
      <>
        {/* FAB Backdrop */}
        <AnimatePresence>
          {isFABOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFABOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* FAB Container */}
        <div className="fixed bottom-20 right-4 z-50">
          {/* Action Buttons */}
          <AnimatePresence>
            {isFABOpen && (
              <motion.div
                className="flex flex-col space-y-3 mb-3"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {mobileActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    className={`${action.color} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center min-w-[48px] h-12`}
                    onClick={() => {
                      action.action()
                      setIsFABOpen(false)
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.icon}
                    <span className="ml-2 text-sm font-medium whitespace-nowrap">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all ${
              isFABOpen ? "rotate-45" : "rotate-0"
            }`}
            onClick={() => setIsFABOpen(!isFABOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isFABOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Responsive Header */}
        <div className="bg-white border-b border-gray-200 p-2 sm:p-3 lg:p-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
              {isMobile && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={`font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1 min-w-0 ${
                  screenSize === "mobile-sm"
                    ? "text-sm"
                    : screenSize === "mobile"
                      ? "text-base"
                      : screenSize.includes("tablet")
                        ? "text-lg"
                        : "text-lg lg:text-xl"
                }`}
                placeholder="Form Title"
              />
              <span
                className={`text-gray-500 flex-shrink-0 whitespace-nowrap ${
                  screenSize === "mobile-sm" ? "text-xs" : "text-xs lg:text-sm"
                }`}
              >
                • Draft
              </span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Desktop controls */}
              {!isMobile && (
                <>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      className={`p-2 rounded ${previewMode === "desktop" ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setPreviewMode("desktop")}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded ${previewMode === "tablet" ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setPreviewMode("tablet")}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded ${previewMode === "mobile" ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setPreviewMode("mobile")}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      showPreview ? "bg-gray-200 text-gray-700" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                </>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0 ${
                  screenSize === "mobile-sm"
                    ? "px-2 py-1.5 text-xs"
                    : screenSize === "mobile"
                      ? "px-3 py-2 text-sm"
                      : "px-3 lg:px-4 py-2 text-sm"
                }`}
              >
                <Save className={`mr-1 lg:mr-2 inline ${screenSize === "mobile-sm" ? "w-3 h-3" : "w-4 h-4"}`} />
                <span className={screenSize.includes("mobile") ? "hidden sm:inline" : "hidden lg:inline"}>
                  {saving ? "Saving..." : "Save"}
                </span>
              </button>

              <button
                onClick={handlePublish}
                disabled={saving}
                className={`bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 flex-shrink-0 ${
                  screenSize === "mobile-sm"
                    ? "px-2 py-1.5 text-xs"
                    : screenSize === "mobile"
                      ? "px-3 py-2 text-sm"
                      : "px-3 lg:px-4 py-2 text-sm"
                }`}
              >
                <Globe className={`mr-1 lg:mr-2 inline ${screenSize === "mobile-sm" ? "w-3 h-3" : "w-4 h-4"}`} />
                <span className={screenSize.includes("mobile") ? "hidden sm:inline" : "hidden lg:inline"}>Publish</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Desktop with responsive width */}
          {!isMobile && (
            <div className={`flex-shrink-0 ${screenSize === "desktop-sm" ? "w-56" : "w-64"}`}>{renderLeftPanel()}</div>
          )}

          {/* Form Canvas with responsive width */}
          <div className="flex-1 overflow-auto min-w-0">
            {/* Mobile/Tablet: Show preview or builder */}
            {isMobile ? (
              <div className="h-full">
                {showMobilePreview ? (
                  // Mobile/Tablet Preview Mode
                  <div className={`bg-gray-50 h-full ${screenSize.includes("mobile") ? "p-2 sm:p-4" : "p-4 lg:p-6"}`}>
                    <div
                      className={`mx-auto bg-white rounded-lg shadow-sm border border-gray-200 ${
                        screenSize === "mobile-sm"
                          ? "max-w-full"
                          : screenSize === "mobile"
                            ? "max-w-sm"
                            : screenSize.includes("tablet")
                              ? "max-w-2xl"
                              : "max-w-3xl"
                      }`}
                    >
                      <div className={`${screenSize.includes("mobile") ? "p-4 sm:p-6" : "p-6 lg:p-8"}`}>
                        <div className="mb-6">
                          <h1
                            className={`font-bold mb-2 ${
                              screenSize === "mobile-sm"
                                ? "text-lg"
                                : screenSize === "mobile"
                                  ? "text-xl"
                                  : "text-xl lg:text-2xl"
                            }`}
                            style={{ color: formSettings.textColor }}
                          >
                            {formTitle}
                          </h1>
                          {formDescription && (
                            <p
                              className={`text-gray-600 ${
                                screenSize.includes("mobile") ? "text-sm" : "text-sm lg:text-base"
                              }`}
                            >
                              {formDescription}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4">
                          {fields.length === 0 ? (
                            <div className="text-center py-8">
                              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-600 text-sm">No fields added yet</p>
                            </div>
                          ) : (
                            fields.map((field) => (
                              <div key={field.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-900">
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {field.description && <p className="text-xs text-gray-600">{field.description}</p>}
                                {renderField(field, true)}
                              </div>
                            ))
                          )}
                        </div>

                        {fields.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold">
                              {formSettings.submitButtonText}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile/Tablet Builder Mode
                  <div className="p-4 h-full">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                      <div className="p-4 h-full overflow-y-auto" ref={fieldContainerRef}>
                        <div className="mb-6">
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className={`font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 mb-2 ${
                              screenSize === "mobile" ? "text-xl" : "text-2xl"
                            }`}
                            placeholder="Form Title"
                          />
                          <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none text-sm"
                            placeholder="Add a description..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-4">
                          {fields.length === 0 ? (
                            <div className="text-center py-8">
                              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <h3
                                className={`font-medium text-gray-900 mb-2 ${
                                  screenSize === "mobile" ? "text-lg" : "text-xl"
                                }`}
                              >
                                Start building
                              </h3>
                              <p className="text-gray-600 mb-4 text-sm">Tap the + button to add your first field</p>
                              <button
                                onClick={() => setIsFABOpen(true)}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                              >
                                <Plus className="w-4 h-4 mr-2 inline" />
                                Add Field
                              </button>
                            </div>
                          ) : (
                            fields.map((field, index) => (
                              <motion.div
                                key={field.id}
                                id={`field-${field.id}`}
                                className={`field-item relative p-3 border-2 rounded-lg transition-all ${
                                  selectedField === field.id ? "border-purple-300 bg-purple-50" : "border-gray-200"
                                }`}
                                onClick={() => setSelectedField(field.id)}
                                onTouchStart={() => handleTouchDragStart(index)}
                                onTouchMove={(e) => handleTouchDragMove(e, index)}
                                onTouchEnd={handleTouchDragEnd}
                                layout
                              >
                                <div className="mb-2">
                                  <label className="block text-sm font-medium text-gray-900 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                  {field.description && (
                                    <p className="text-xs text-gray-600 mb-2">{field.description}</p>
                                  )}
                                </div>

                                {renderField(field, false)}

                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button
                                    className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedField(field.id)
                                      setShowMobileFieldOptions(true)
                                    }}
                                  >
                                    <Edit2 className="w-3 h-3 text-gray-600" />
                                  </button>
                                  <button
                                    className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setShowMobileContextMenu(field.id)
                                    }}
                                  >
                                    <MoreVertical className="w-3 h-3 text-gray-600" />
                                  </button>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Desktop Layout
              <div className={`${screenSize === "desktop-sm" ? "p-3 lg:p-6" : "p-4 lg:p-8"} h-full overflow-y-auto`}>
                <div
                  className={`mx-auto bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ${
                    previewMode === "mobile"
                      ? "max-w-sm"
                      : previewMode === "tablet"
                        ? "max-w-2xl"
                        : screenSize === "desktop-sm"
                          ? "max-w-5xl"
                          : "max-w-6xl"
                  }`}
                  style={{
                    backgroundColor: formSettings.backgroundColor,
                    color: formSettings.textColor,
                  }}
                >
                  {/* Form Header */}
                  <div className="p-4 lg:p-8">
                    {/* Form Header */}
                    <div className="mb-8">
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="text-2xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 mb-2"
                        placeholder="Form Title"
                        style={{ color: formSettings.textColor }}
                      />
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none"
                        placeholder="Add a description for your form..."
                        rows={2}
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      {fields.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your form</h3>
                          <p className="text-gray-600 mb-4">Add fields from the left panel to get started</p>
                        </div>
                      ) : (
                        fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            className={`group relative p-4 border-2 rounded-lg transition-all ${
                              selectedField === field.id
                                ? "border-purple-300 bg-purple-50"
                                : "border-transparent hover:border-gray-200"
                            }`}
                            onClick={() => setSelectedField(field.id)}
                            draggable={!showPreview}
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            layout
                          >
                            {!showPreview && (
                              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                              </div>
                            )}

                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-900 mb-1">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {field.description && <p className="text-sm text-gray-600 mb-2">{field.description}</p>}
                            </div>

                            {renderField(field, showPreview)}

                            {!showPreview && selectedField === field.id && (
                              <div className="absolute top-2 right-2 flex space-x-1">
                                <button
                                  className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    duplicateField(field.id)
                                  }}
                                >
                                  <Copy className="w-3 h-3 text-gray-600" />
                                </button>
                                <button
                                  className="p-1 bg-white border border-gray-200 rounded hover:bg-red-50 hover:border-red-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteField(field.id)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>

                    {showPreview && fields.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                          style={{
                            backgroundColor:
                              formSettings.backgroundColor === "#ffffff" ? undefined : formSettings.textColor,
                          }}
                        >
                          {formSettings.submitButtonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Desktop with responsive width */}
          {!isMobile && !showPreview && (
            <div className={`flex-shrink-0 ${screenSize === "desktop-sm" ? "w-72" : "w-80"}`}>
              {/* Desktop tabs */}
              <div className="bg-white border-l border-gray-200 h-full">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: "properties", label: "Properties", icon: <Sliders className="w-4 h-4" /> },
                    { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
                    { id: "logic", label: "Logic", icon: <Zap className="w-4 h-4" /> },
                    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {activeTab === "properties" && renderRightPanel()}
                {activeTab === "design" && renderDesignPanel()}
                {activeTab === "logic" && renderLogicPanel()}
                {activeTab === "settings" && renderSettingsPanel()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Panels with responsive widths */}
      <AnimatePresence>
        {isMobile && showLeftPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLeftPanel(false)}
          >
            <motion.div
              className={`absolute left-0 top-0 bottom-0 ${
                screenSize === "mobile-sm"
                  ? "w-full max-w-[95vw]"
                  : screenSize === "mobile"
                    ? "w-80 max-w-[90vw]"
                    : "w-96 max-w-[85vw]"
              }`}
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderLeftPanel()}
            </motion.div>
          </motion.div>
        )}

        {isMobile && showRightPanel && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRightPanel(false)}
          >
            <motion.div
              className={`absolute right-0 top-0 bottom-0 ${
                screenSize === "mobile-sm"
                  ? "w-full max-w-[95vw]"
                  : screenSize === "mobile"
                    ? "w-80 max-w-[90vw]"
                    : "w-96 max-w-[85vw]"
              }`}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderRightPanel()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}

      {/* Mobile Floating Action Button */}
      {renderMobileFAB()}

      {/* Mobile-specific overlays */}
      {isMobile && showMobileFieldOptions && renderMobileFieldEditor()}
      {isMobile && mobileEditMode === "design" && renderMobileDesignEditor()}
      {isMobile && mobileEditMode === "settings" && renderMobileSettingsEditor()}
      {isMobile && renderMobileContextMenu()}
    </div>
  )
}
