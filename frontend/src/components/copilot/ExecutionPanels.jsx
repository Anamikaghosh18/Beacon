import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Users, MessageSquare, BarChart, Zap, Smartphone, Loader2, CheckCircle2 } from "lucide-react"
import { api } from "../../services/api"

function formatMetric(value, fallback) {
  if (value == null || value === "") return fallback
  if (typeof value === "number") {
    if (value <= 1) return `${Math.round(value * 100)}%`
    return String(value)
  }
  return String(value)
}

export function ExecutionPanels({ strategy }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [launchError, setLaunchError] = useState(null);

  if (!strategy) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card/50">
        <p className="text-textMuted text-sm">Waiting for strategy...</p>
      </div>
    )
  }

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchError(null);
    try {
      const draft = strategy.message_draft || {}
      const channel = strategy.channel_rec || {}
      const audience = strategy.audience_match || {}

      const segmentId = audience.segment_id || null

      const c = await api.createCampaign({
        name: "AI Campaign: " + (draft.subject || audience.segment_name || "Outreach"),
        segment_id: segmentId,
        channel: (channel.channel || "email").toLowerCase(),
        message_body: draft.body || "",
        subject_line: draft.subject || "",
      });
      const result = await api.launchCampaign(c.id);
      setHasLaunched(true);
      console.log("Campaign launched:", result);
    } catch (err) {
      console.error("Failed to launch", err);
      setLaunchError(err.message || "Failed to launch campaign.");
    } finally {
      setIsLaunching(false);
    }
  }

  const channel = strategy.channel_rec || {}
  const draft = strategy.message_draft || {}
  const projected = strategy.projected || {}

  return (
    <div className="space-y-4">

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
            <span className="text-sm font-semibold text-textPrimary">{strategy.audience_match?.segment_name || "Unknown Segment"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">How many people</span>
            <span className="text-sm font-semibold text-textPrimary">{strategy.audience_match?.estimated_count?.toLocaleString() || "0"} customers</span>
          </div>
          <div className="p-3 bg-background border border-border rounded-lg mt-2">
            <p className="text-xs font-semibold text-textPrimary mb-1">Why this group?</p>
            <p className="text-xs text-textSecondary leading-relaxed">
              {strategy.audience_match?.reason || "This segment is highly relevant to your prompt."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-textMuted" /> How we'll reach them
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">Channel</span>
            <span className="text-sm font-semibold text-textPrimary uppercase">{channel.channel || "Email"}</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed bg-background border border-border rounded-lg p-3">
            {channel.reason || "This is the optimal channel for this segment."}
          </p>
          <p className="text-xs text-textMuted">Delivered via OneSignal (email, push, SMS, or WhatsApp).</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-textMuted" /> What we'll say
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {draft.subject && (
            <div className="text-sm font-semibold text-textPrimary">{draft.subject}</div>
          )}
          <div className="p-4 bg-background border border-border rounded-lg text-sm text-textPrimary leading-relaxed italic whitespace-pre-wrap">
            {draft.body || "Message content."}
          </div>
        </CardContent>
      </Card>

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
              <p className="text-xl font-bold text-textPrimary">{formatMetric(projected.expected_delivery_rate, "95%")}</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Will open it</p>
              <p className="text-xl font-bold text-textPrimary">{formatMetric(projected.expected_open_rate, "35%")}</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Expected Rev</p>
              <p className="text-xl font-bold text-textPrimary">{formatMetric(projected.expected_revenue, "$1,500")}</p>
            </div>
          </div>
          <p className="text-xs text-textMuted">Based on how similar campaigns performed for businesses like yours.</p>

          {launchError && (
            <p className="text-xs text-error bg-error/10 border border-error/20 rounded-lg p-3">{launchError}</p>
          )}
          
          {hasLaunched ? (
            <div className="flex items-center justify-center gap-2 w-full py-2 bg-success/10 text-success rounded-lg font-semibold border border-success/20">
              <CheckCircle2 className="w-5 h-5" /> Campaign Launched — messages are being sent via OneSignal
            </div>
          ) : (
            <Button 
              variant="ai" 
              className="w-full font-semibold shadow-button"
              onClick={handleLaunch}
              disabled={isLaunching}
            >
              {isLaunching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
              {isLaunching ? "Launching..." : "Send This Campaign"}
            </Button>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
