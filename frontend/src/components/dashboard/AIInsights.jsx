import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Compass, ArrowRight, Sparkles } from "lucide-react"
import { useMockData } from "../../hooks/useMockData"
import { useNavigate } from "react-router-dom"

export function AIInsights() {
  const { data } = useMockData()
  const navigate = useNavigate()
  const insights = data.AI_INSIGHTS || []

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
          Your AI advisor will surface insights once you have campaigns running and customer data loaded.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="p-3 bg-aiAccent/5 rounded-full">
              <Sparkles className="w-6 h-6 text-aiAccent opacity-40" />
            </div>
            <p className="text-sm text-textMuted leading-relaxed max-w-[200px]">
              No insights yet — launch a campaign to get started.
            </p>
            <Button
              variant="ai"
              className="gap-2 text-sm mt-1"
              onClick={() => navigate('/app/assistant')}
            >
              <Compass className="w-3.5 h-3.5" /> Open Strategist
            </Button>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 bg-background border border-border rounded-xl shadow-xs hover:shadow-sm transition-shadow space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full border border-border bg-aiAccent/10 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-aiAccent" />
                </div>
                <p className="text-sm text-textPrimary leading-relaxed">{insight.text}</p>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-aiAccent font-bold mb-1.5 uppercase tracking-widest">
                  What we suggest
                </p>
                <p className="text-xs text-textSecondary leading-relaxed">{insight.recommendation}</p>
              </div>

              <Button
                variant="ai"
                className="w-full justify-between group text-sm"
                onClick={() => navigate('/app/assistant')}
              >
                See the full plan
                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
