import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Compass } from "lucide-react"

export function AIAnalysisPanel() {
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
        <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
          <div className="shrink-0 mt-0.5">
            <div className="w-6 h-6 rounded bg-success/10 flex items-center justify-center">
              <span className="text-success text-xs font-bold">+</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-textPrimary font-semibold">Outperforming control group.</p>
            <p className="text-sm text-textSecondary mt-1 leading-relaxed">The subject line "We miss you" outperformed the control group by 24%. Recommended to make this the default variant.</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
          <div className="shrink-0 mt-0.5">
            <div className="w-6 h-6 rounded bg-warning/10 flex items-center justify-center">
              <span className="text-warning text-xs font-bold">!</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-textPrimary font-semibold">Post-click drop-off detected.</p>
            <p className="text-sm text-textSecondary mt-1 leading-relaxed">There is a 65% drop-off rate on the landing page despite high engagement.</p>
          </div>
        </div>

        <div className="p-5 bg-aiAccent/5 border border-aiAccent/20 rounded-xl">
          <p className="text-xs text-aiAccent font-semibold mb-2 uppercase tracking-wider">Recommendation</p>
          <p className="text-sm text-textPrimary leading-relaxed">Increase urgency on the landing page and shorten the checkout flow. Set up an A/B test adding a countdown timer to the cart. Would you like me to draft this A/B test?</p>
        </div>
      </CardContent>
    </Card>
  )
}
