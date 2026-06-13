import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { CheckCircle2, Circle } from "lucide-react"

const ALL_STAGES = ["Created", "Queued", "Sending", "Delivered", "Opened", "Clicked", "Converted"]

function getStageStatus(stageName, campaignStatus) {
  const statusOrder = ["draft", "queued", "sending", "delivered", "opened", "clicked", "completed"]
  const stageOrder = ["created", "queued", "sending", "delivered", "opened", "clicked", "converted"]

  const currentIdx = statusOrder.indexOf((campaignStatus || "draft").toLowerCase())
  const stageIdx = stageOrder.indexOf(stageName.toLowerCase())

  if (stageIdx < currentIdx) return "complete"
  if (stageIdx === currentIdx) return "partial"
  return "pending"
}

export function CampaignTimeline({ campaign }) {
  const status = campaign?.status || "draft"

  const stages = ALL_STAGES.map(name => ({
    name,
    status: getStageStatus(name, status),
  }))

  const completedCount = stages.filter(s => s.status === "complete").length
  const progressPct = Math.round((completedCount / ALL_STAGES.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mt-8 mb-4 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          ></div>

          <div className="relative flex justify-between">
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-card p-1 rounded-full relative z-10">
                  {stage.status === "complete" ? (
                    <CheckCircle2 className="w-5 h-5 text-primary bg-card rounded-full" />
                  ) : stage.status === "partial" ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-card flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-textMuted bg-card rounded-full" />
                  )}
                </div>
                <div className="mt-3 flex flex-col items-center gap-1">
                  <span className={`text-sm font-medium ${stage.status === 'pending' ? 'text-textMuted' : 'text-textPrimary'}`}>
                    {stage.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {status === "draft" && (
          <p className="text-center text-xs text-textMuted mt-6">This campaign hasn't launched yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
