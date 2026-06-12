import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"

import { Layout } from "./components/layout/Layout"
import { MockDataProvider } from "./context/MockDataContext"

import { Landing } from "./pages/Landing"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { Dashboard } from "./pages/Dashboard"
import { Copilot } from "./pages/Copilot"
import { Campaigns } from "./pages/Campaigns"
import { CampaignDetails } from "./pages/CampaignDetails"
import { Segments } from "./pages/Segments"
import { Events } from "./pages/Events"

// Protects any route — redirects to sign-in if not logged in
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

function App() {
  return (
    <MockDataProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Redirect /app → /app/dashboard */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

          {/* Protected app routes */}
          <Route path="/app/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="dashboard"       element={<Dashboard />} />
                  <Route path="assistant"        element={<Copilot />} />
                  <Route path="campaigns"        element={<Campaigns />} />
                  <Route path="campaigns/:id"    element={<CampaignDetails />} />
                  <Route path="segments"         element={<Segments />} />
                  <Route path="events"           element={<Events />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </MockDataProvider>
  )
}

export default App
