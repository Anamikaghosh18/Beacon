import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { CampaignTimeline } from "../components/campaigns/CampaignTimeline"
import { PerformanceMetrics } from "../components/campaigns/PerformanceMetrics"
import { AIAnalysisPanel } from "../components/campaigns/AIAnalysisPanel"
import { useMockData } from "../hooks/useMockData"
import { Badge } from "../components/ui/Badge"

export function CampaignDetails() {
  const { id } = useParams()
  const { data } = useMockData()
  const campaigns = data.RECENT_CAMPAIGNS
  const campaign = campaigns.find(c => c.id === id) || campaigns[0] // fallback for mock

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link to="/campaigns" className="p-2 hover:bg-secondary rounded-lg transition-colors text-textSecondary hover:text-textPrimary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant="success">Running</Badge>
          </div>
          <p className="text-textSecondary">
            Targeting <span className="text-textPrimary font-medium">{campaign.audience}</span> via <span className="text-textPrimary font-medium">{campaign.channel}</span>
          </p>
        </div>
      </div>

      <PerformanceMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignTimeline />
        </div>
        <div className="lg:col-span-1">
          <AIAnalysisPanel />
        </div>
      </div>
    </div>
  )
}
