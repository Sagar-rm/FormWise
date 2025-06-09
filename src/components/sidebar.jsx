"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react"
import { useAuth } from "../hooks/use-auth"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText className="w-5 h-5" />, label: "Forms", path: "/builder" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/analytics" },
    { icon: <Palette className="w-5 h-5" />, label: "Templates", path: "/templates" },
    { icon: <Users className="w-5 h-5" />, label: "Team", path: "/team" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Billing", path: "/billing" },
  ]

  const bottomItems = [
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help & Support", path: "/help" },
    { icon: <LogOut className="w-5 h-5" />, label: "Logout", path: "/logout" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("formwise_auth")
    logout()
  }

  return (
    <motion.div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FormWise
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/builder" && location.pathname.startsWith("/builder")) ||
              (item.path === "/analytics" && location.pathname.startsWith("/analytics"))

            return (
              <li key={index}>
                <motion.button
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </motion.button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          {bottomItems.map((item, index) => (
            <li key={index}>
              <motion.button
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={item.label === "Logout" ? handleLogout : () => navigate(item.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </motion.button>
            </li>
          ))}
        </ul>

        {!isCollapsed && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Pro Plan</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">2,847 / 5,000 responses used</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                style={{ width: "57%" }}
              ></div>
            </div>
            <button
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              onClick={() => navigate("/billing")}
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
