import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { CheckCircle2, Circle } from "lucide-react"

const STAGES = [
  { name: "Created", status: "complete", time: "Oct 12, 10:00 AM" },
  { name: "Queued", status: "complete", time: "Oct 12, 10:05 AM" },
  { name: "Sending", status: "complete", time: "Oct 12, 10:10 AM" },
  { name: "Delivered", status: "complete", time: "Oct 12, 10:15 AM" },
  { name: "Opened", status: "partial", time: "Ongoing" },
  { name: "Clicked", status: "partial", time: "Ongoing" },
  { name: "Converted", status: "pending", time: "-" },
]

export function CampaignTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mt-8 mb-4 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-[60%] h-0.5 bg-primary -translate-y-1/2 rounded-full"></div>
          
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => (
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
                  <span className="text-xs text-textSecondary hidden md:block">{stage.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
