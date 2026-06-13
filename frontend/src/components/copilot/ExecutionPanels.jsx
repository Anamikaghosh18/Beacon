import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Users, MessageSquare, BarChart, Zap, Smartphone, Loader2, CheckCircle2 } from "lucide-react"
import { api } from "../../services/api"

export function ExecutionPanels({ strategy }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  if (!strategy) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card/50">
        <p className="text-textMuted text-sm">Waiting for strategy...</p>
      </div>
    )
  }

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const c = await api.createCampaign({
        name: "AI Campaign: " + (strategy.campaign_data?.subject || "Outreach"),
        segment_id: 1, // Fallback segment id if we don't have a real one mapped
        channel: strategy.channel_data?.channel || "email"
      });
      await api.launchCampaign(c.id);
      setHasLaunched(true);
    } catch (err) {
      console.error("Failed to launch", err);
      alert("Failed to launch campaign.");
    } finally {
      setIsLaunching(false);
    }
  }
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
            <span className="text-sm font-semibold text-textPrimary uppercase">{strategy.channel_data?.channel || "Email"}</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed bg-background border border-border rounded-lg p-3">
            {strategy.channel_data?.reason || "This is the optimal channel for this segment."}
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
          <div className="p-4 bg-background border border-border rounded-lg text-sm text-textPrimary leading-relaxed italic whitespace-pre-wrap">
            {strategy.campaign_data?.body || "Message content."}
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
              <p className="text-xl font-bold text-textPrimary">{strategy.projected?.expected_delivery_rate || "95%"}</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Will open it</p>
              <p className="text-xl font-bold text-textPrimary">{strategy.projected?.expected_open_rate || "45%"}</p>
            </div>
            <div className="space-y-1 pl-4">
              <p className="text-xs text-textSecondary">Expected Rev</p>
              <p className="text-xl font-bold text-textPrimary">{strategy.projected?.expected_revenue || "$2500"}</p>
            </div>
          </div>
          <p className="text-xs text-textMuted">Based on how similar campaigns performed for businesses like yours.</p>
          
          {hasLaunched ? (
            <div className="flex items-center justify-center gap-2 w-full py-2 bg-success/10 text-success rounded-lg font-semibold border border-success/20">
              <CheckCircle2 className="w-5 h-5" /> Campaign Launched
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
