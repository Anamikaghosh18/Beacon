import { CampaignTable } from "../components/campaigns/CampaignTable"
import { Button } from "../components/ui/Button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Campaigns() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Your Campaigns</h1>
          <p className="text-textSecondary mt-1 text-sm">
            Everything you've sent — or plan to send — to your customers. Track results and see what's working.
          </p>
        </div>
        <Button 
          className="gap-2 shadow-button-primary"
          onClick={() => navigate('/app/assistant')}
        >
          <Plus className="w-4 h-4" /> Start a Campaign
        </Button>
      </div>

      <CampaignTable />
    </div>
  )
}
