"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/use-auth"
import LandingPage from "./pages/landing-page"
import Dashboard from "./pages/dashboard"
import FormBuilder from "./pages/form-builder"
import Analytics from "./pages/analytics"
import Templates from "./pages/templates"
import Settings from "./pages/settings"
import Billing from "./pages/billing"
import AuthPage from "./pages/auth"
import FormViewer from "./pages/form-viewer"
import FormResponses from "./pages/form-responses"
import ContactPage from "./pages/contact"
import Forms from "./pages/forms"
import Notifications from "./pages/notifications"
import NotFoundPage from "./pages/404"
import Help from "./pages/help"
import Support from "./pages/support"
import ProfileSettings from "./components/profile-settings"
import Integrations from "./pages/integrations"
import Webhooks from "./pages/webhooks"
import Import from "./pages/import"

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" />
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/:formId?"
        element={
          <ProtectedRoute>
            <FormBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:formId?"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route path="/form/:formId" element={<FormViewer />} />
      <Route path="/form-responses/:formId" element={
                  <ProtectedRoute>
                    <FormResponses />
                  </ProtectedRoute>
                    } />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
                        <Route path="/support" element={<Support />} />


            <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <Forms />
          </ProtectedRoute>
        }
      />

                  <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
                        <Route
        path="/import"
        element={
          <ProtectedRoute>
            <Import />
          </ProtectedRoute>
        }
      />
                        <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        }
      />
                        <Route
        path="/webhooks"
        element={
          <ProtectedRoute>
            <Webhooks />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
