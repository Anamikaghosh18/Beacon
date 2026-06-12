import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Users, MessageSquare, BarChart, Zap, Smartphone } from "lucide-react"

export function ExecutionPanels() {
  return (
    <div className="space-y-4">

      {/* Who we'll reach */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-textMuted" /> Who we'll reach</span>
            <Badge variant="ai">Great match</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">Customer group</span>
            <span className="text-sm font-semibold text-textPrimary">Customers who went quiet</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">How many people</span>
            <span className="text-sm font-semibold text-textPrimary">8,400 customers</span>
          </div>
          <div className="p-3 bg-background border border-border rounded-lg mt-2">
            <p className="text-xs font-semibold text-textPrimary mb-1">Why this group?</p>
            <p className="text-xs text-textSecondary leading-relaxed">
              These customers shopped with you before but haven't come back in 90 days. A friendly reminder — especially with a small offer — usually works really well for this group.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How we'll reach them */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-textMuted" /> How we'll reach them
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">Channel</span>
            <span className="text-sm font-semibold text-textPrimary">SMS & WhatsApp</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed bg-background border border-border rounded-lg p-3">
            For customers who haven't opened emails, a text message is 3x more likely to get their attention.
          </p>
        </CardContent>
      </Card>

      {/* The message */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-textMuted" /> What we'll say
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-background border border-border rounded-lg text-sm text-textPrimary leading-relaxed italic">
            "Hey [Name], we miss you! Come back and enjoy 20% off your next order with code WINBACK20. Valid for 48 hours."
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-textSecondary">Button text</span>
            <span className="font-semibold text-textPrimary">Shop Now →</span>
          </div>
        </CardContent>
      </Card>

      {/* Expected results */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-textMuted" /> What to expect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-3 gap-4 divide-x divide-border">
            <div className="space-y-1">
              <p className="text-xs text-textSecondary">Will receive it</p>
              <p className="text-xl font-bold text-textPrimary">8,400</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Will open it</p>
              <p className="text-xl font-bold text-textPrimary">~1,170</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Will buy</p>
              <p className="text-xl font-bold text-textPrimary">~270</p>
            </div>
          </div>
          <p className="text-xs text-textMuted">Based on how similar campaigns performed for businesses like yours.</p>
          <Button variant="ai" className="w-full font-semibold shadow-button">
            <Zap className="w-4 h-4 mr-2" /> Send This Campaign
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}
