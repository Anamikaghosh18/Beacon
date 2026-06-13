import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { CampaignTimeline } from "../components/campaigns/CampaignTimeline"
import { PerformanceMetrics } from "../components/campaigns/PerformanceMetrics"
import { AIAnalysisPanel } from "../components/campaigns/AIAnalysisPanel"
import { Badge } from "../components/ui/Badge"
import { api } from "../services/api"

export function CampaignDetails() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getCampaign(id)
        setCampaign(data)
      } catch {
        // If fetch fails, set a minimal placeholder
        setCampaign({ id, name: "Campaign", status: "draft", channel: "email", segment_id: null, metrics: {} })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-textMuted">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading campaign...</span>
      </div>
    )
  }

  const statusVariant =
    campaign.status === 'sending' || campaign.status === 'queued' ? 'success' :
    campaign.status === 'completed' ? 'default' : 'outline'

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link to="/app/campaigns" className="p-2 hover:bg-secondary rounded-lg transition-colors text-textSecondary hover:text-textPrimary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant={statusVariant}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <p className="text-textSecondary">
            {campaign.segment_id
              ? <>Targeting <span className="text-textPrimary font-medium">Segment #{campaign.segment_id}</span> via <span className="text-textPrimary font-medium uppercase">{campaign.channel}</span></>
              : <span className="text-textMuted">No audience assigned yet.</span>
            }
          </p>
        </div>
      </div>

      <PerformanceMetrics campaign={campaign} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignTimeline campaign={campaign} />
        </div>
        <div className="lg:col-span-1">
          <AIAnalysisPanel campaign={campaign} />
        </div>
      </div>
    </div>
  )
}
