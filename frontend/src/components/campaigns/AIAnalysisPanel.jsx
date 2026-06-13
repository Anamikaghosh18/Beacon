import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Compass } from "lucide-react"

export function AIAnalysisPanel({ campaign }) {
  // Only show if the campaign has real metrics
  const hasData = campaign?.metrics && Object.keys(campaign.metrics).length > 0

  if (!hasData) {
    return (
      <Card className="h-full bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-textPrimary text-lg">
            <div className="p-1.5 bg-aiAccent/10 text-aiAccent rounded-md shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            Strategist Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <Compass className="w-8 h-8 text-textMuted opacity-30" />
            <p className="text-sm text-textMuted">
              Analysis will appear once this campaign is live and has real data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-textPrimary text-lg">
          <div className="p-1.5 bg-aiAccent/10 text-aiAccent rounded-md shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          Strategist Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {campaign.metrics.open_rate >= 30 && (
          <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
            <div className="shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded bg-success/10 flex items-center justify-center">
                <span className="text-success text-xs font-bold">+</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-textPrimary font-semibold">Strong open rate.</p>
              <p className="text-sm text-textSecondary mt-1 leading-relaxed">
                Your open rate of {campaign.metrics.open_rate}% is above industry average. Your subject line is resonating well.
              </p>
            </div>
          </div>
        )}

        {campaign.metrics.click_rate < 5 && (
          <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
            <div className="shrink-0 mt-0.5">
              <div className="w-6 h-6 rounded bg-warning/10 flex items-center justify-center">
                <span className="text-warning text-xs font-bold">!</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-textPrimary font-semibold">Low click-through rate.</p>
              <p className="text-sm text-textSecondary mt-1 leading-relaxed">
                Only {campaign.metrics.click_rate}% clicked. Consider a stronger call-to-action or a more prominent button.
              </p>
            </div>
          </div>
        )}

        <div className="p-5 bg-aiAccent/5 border border-aiAccent/20 rounded-xl">
          <p className="text-xs text-aiAccent font-semibold mb-2 uppercase tracking-wider">Recommendation</p>
          <p className="text-sm text-textPrimary leading-relaxed">
            Based on your current results, try A/B testing a different subject line and a more prominent CTA button on your next send.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
