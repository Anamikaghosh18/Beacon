import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { MockDataProvider } from "./context/MockDataContext"

import { Landing } from "./pages/Landing"
import { Dashboard } from "./pages/Dashboard"
import { Copilot } from "./pages/Copilot"
import { Campaigns } from "./pages/Campaigns"
import { CampaignDetails } from "./pages/CampaignDetails"
import { Segments } from "./pages/Segments"
import { Events } from "./pages/Events"

function App() {
  return (
    <MockDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          
          <Route path="/app/*" element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="assistant" element={<Copilot />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="campaigns/:id" element={<CampaignDetails />} />
                <Route path="segments" element={<Segments />} />
                <Route path="events" element={<Events />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </MockDataProvider>
  )
}

export default App
