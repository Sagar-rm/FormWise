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
} from "lucide-react"
import Sidebar from "../components/sidebar"
import { useForms } from "../hooks/use-forms"
import { useAuth } from "../hooks/use-auth"

export default function FormBuilder() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createForm, updateForm, getForm } = useForms()

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false)
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")
  const [showMobilePreview, setShowMobilePreview] = useState(false)

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

  // Check if mobile and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setShowLeftPanel(false)
        setShowRightPanel(false)
        setShowMobilePreview(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load form data if editing
  useEffect(() => {
    if (formId && formId !== "new") {
      loadForm()
    }
  }, [formId])

const loadForm = async () => {
  if (!formId || formId === "new") return; // Do not load if it's a new form

  try {
    const form = await getForm(formId);
    if (form) {
      setFormTitle(form.title || "Untitled Form"); // Set default title if undefined
      setFormDescription(form.description || ""); // Set default description if undefined
      setFields(form.fields.map(field => ({
        ...field,
        options: field.options || [] // Ensure options is an array
      })) || []); // Set default fields if undefined
      setFormSettings(form.settings || {
        theme: "modern",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        submitButtonText: "Submit",
        thankYouMessage: "Thank you for your submission!",
        collectEmail: false,
        allowMultipleSubmissions: true,
      }); // Set default settings if undefined
    }
  } catch (error) {
    console.error("Error loading form:", error);
  }
};



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
    if (isMobile) { 
      setShowLeftPanel(false)
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
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Add Fields</h3>
          <button onClick={() => setShowLeftPanel(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Tabs for mobile */}
      {isMobile && (
        <div className="flex border-b border-gray-200">
          {[
            { id: "fields", label: "Fields", icon: <Layers className="w-4 h-4" /> },
            { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
            { id: "logic", label: "Logic", icon: <Zap className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-xs font-medium ${
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
        {(!isMobile || activeTab === "fields") && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Field Types</h3>

            {/* Basic Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Basic</h4>
              <div className="space-y-2">
                {fieldTypes
                  .filter((f) => f.category === "basic")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600">{fieldType.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Choice Fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Choice</h4>
              <div className="space-y-2">
                {fieldTypes
                  .filter((f) => f.category === "choice")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600">{fieldType.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>

            {/* Advanced Fields */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced</h4>
              <div className="space-y-2">
                {fieldTypes
                  .filter((f) => f.category === "advanced")
                  .map((fieldType) => (
                    <motion.button
                      key={fieldType.type}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                      onClick={() => addField(fieldType.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-purple-600">{fieldType.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
                    </motion.button>
                  ))}
              </div>
            </div>
          </>
        )}

        {isMobile && activeTab === "design" && (
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

        {isMobile && activeTab === "logic" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Logic & Rules</h3>
            <p className="text-sm text-gray-600">Conditional logic features coming soon!</p>
          </div>
        )}

        {isMobile && activeTab === "settings" && (
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
      {isMobile && (
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              {isMobile && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-lg md:text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1 min-w-0"
                placeholder="Form Title"
              />
              <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">• Draft</span>
            </div>

            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              {/* Mobile controls */}
              {isMobile && (
                <>
                  <button
                    onClick={() => setShowLeftPanel(true)}
                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                    title="Add Fields"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {selectedField && (
                    <button
                      onClick={() => setShowRightPanel(true)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      title="Field Properties"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setShowMobilePreview(!showMobilePreview)}
                    className={`p-2 rounded-lg font-medium transition-all ${
                      showMobilePreview
                        ? "bg-gray-200 text-gray-700"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </>
              )}

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
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4 mr-1 md:mr-2 inline" />
                <span className="hidden md:inline">{saving ? "Saving..." : "Save"}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={saving}
                className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
              >
                <Globe className="w-4 h-4 mr-1 md:mr-2 inline" />
                <span className="hidden md:inline">Publish</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Panel - Desktop */}
          {!isMobile && <div className="w-64">{renderLeftPanel()}</div>}

          {/* Form Canvas */}
          <div className="flex-1 overflow-auto">
            {/* Mobile: Show preview or builder */}
            {isMobile ? (
              <div className="h-full">
                {showMobilePreview ? (
                  // Mobile Preview Mode
                  <div className="p-4 bg-gray-50 h-full">
                    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-6">
                        <div className="mb-6">
                          <h1 className="text-xl font-bold mb-2" style={{ color: formSettings.textColor }}>
                            {formTitle}
                          </h1>
                          {formDescription && <p className="text-gray-600 text-sm">{formDescription}</p>}
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
                  // Mobile Builder Mode
                  <div className="p-4 h-full">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                      <div className="p-4 h-full overflow-y-auto">
                        <div className="mb-6">
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="text-xl font-bold w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 mb-2"
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
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Start building</h3>
                              <p className="text-gray-600 mb-4 text-sm">Tap the + button to add your first field</p>
                              <button
                                onClick={() => setShowLeftPanel(true)}
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
                                className={`relative p-3 border-2 rounded-lg transition-all ${
                                  selectedField === field.id ? "border-purple-300 bg-purple-50" : "border-gray-200"
                                }`}
                                onClick={() => setSelectedField(field.id)}
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

                                {selectedField === field.id && (
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
                                      className="p-1 bg-white border border-gray-200 rounded hover:bg-red-50"
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
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Desktop Layout
              <div className="p-4 md:p-8">
                <div
                  className={`mx-auto bg-white rounded-lg shadow-sm border border-gray-200 ${
                    previewMode === "mobile" ? "max-w-sm" : previewMode === "tablet" ? "max-w-2xl" : "max-w-4xl"
                  }`}
                  style={{
                    backgroundColor: formSettings.backgroundColor,
                    color: formSettings.textColor,
                  }}
                >
                  {/* Form Header */}
                  <div className="p-4 md:p-8">
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
                          <p className="text-gray-600 mb-4">
                            {isMobile
                              ? "Tap the + button to add fields"
                              : "Add fields from the left panel to get started"}
                          </p>
                          {isMobile && (
                            <button
                              onClick={() => setShowLeftPanel(true)}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                              <Plus className="w-4 h-4 mr-2 inline" />
                              Add Your First Field
                            </button>
                          )}
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
                            onClick={() => {
                              setSelectedField(field.id)
                              if (isMobile) {
                                setShowRightPanel(true)
                              }
                            }}
                            draggable={!showPreview && !isMobile}
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            layout
                          >
                            {!showPreview && !isMobile && (
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

          {/* Right Panel - Desktop */}
          {!isMobile && !showPreview && <div className="w-80">{renderRightPanel()}</div>}
        </div>
      </div>

      {/* Mobile Panels */}
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
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw]"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
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
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw]"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderRightPanel()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>  
  )
}
