import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { Layout } from "./components/layout/Layout";
import { MockDataProvider } from "./context/MockDataContext";

import { Landing } from "./pages/Landing";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Dashboard } from "./pages/Dashboard";
import { Copilot } from "./pages/Copilot";
import { Campaigns } from "./pages/Campaigns";
import { CampaignDetails } from "./pages/CampaignDetails";
import { Segments } from "./pages/Segments";
import { Events } from "./pages/Events";
import { Integrations } from "./pages/Integrations";

// Protects any route — redirects to login if not signed in
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  return isSignedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <MockDataProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Redirect /app → /app/dashboard */}
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

        {/* Protected app routes */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="assistant" element={<Copilot />} />
                  <Route path="campaigns" element={<Campaigns />} />
                  <Route path="campaigns/:id" element={<CampaignDetails />} />
                  <Route path="segments" element={<Segments />} />
                  <Route path="events" element={<Events />} />
                  <Route path="integrations" element={<Integrations />} />
                  <Route
                    path="*"
                    element={<Navigate to="/app/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MockDataProvider>
  );
}

export default App;
