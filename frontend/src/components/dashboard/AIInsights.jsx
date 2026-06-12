import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Compass, ArrowRight } from "lucide-react"
import { useMockData } from "../../hooks/useMockData"

export function AIInsights() {
  const { data } = useMockData()
  const insights = data.AI_INSIGHTS

  return (
    <Card className="h-full border-t-[3px] border-t-aiAccent shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-aiAccent/10 text-aiAccent rounded-md shadow-xs ring-1 ring-aiAccent/20">
            <Compass className="w-4 h-4" />
          </div>
          <CardTitle className="text-sm font-semibold text-textPrimary">Beacon Strategist</CardTitle>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">
          Your personal business advisor spotted something worth your attention today.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 bg-background border border-border rounded-xl shadow-xs hover:shadow-sm transition-shadow space-y-4"
          >
            <div className="flex items-start gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Advisor"
                className="w-9 h-9 rounded-full border border-border object-cover shrink-0 shadow-xs"
              />
              <p className="text-sm text-textPrimary leading-relaxed">{insight.text}</p>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-[10px] text-aiAccent font-bold mb-1.5 uppercase tracking-widest">
                What we suggest
              </p>
              <p className="text-xs text-textSecondary leading-relaxed">{insight.recommendation}</p>
            </div>

            <Button variant="ai" className="w-full justify-between group text-sm">
              See the full plan
              <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
