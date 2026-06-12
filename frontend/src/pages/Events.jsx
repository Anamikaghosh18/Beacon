import { EventStream } from "../components/events/EventStream"
import { Card, CardContent } from "../components/ui/Card"
import { CheckCircle2, MessageCircle, MousePointerClick, DollarSign } from "lucide-react"

export function Events() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Live Activity</h1>
          <p className="text-textSecondary mt-1 text-sm">
            Watch in real time as your messages reach customers and they take action. Every open, click, and purchase shows up here the moment it happens.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-success font-medium text-sm">Everything running smoothly</span>
        </div>
      </div>

      {/* Quick summary cards — no tech jargon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2 text-textMuted text-xs font-medium uppercase mb-1">
              <MessageCircle className="w-3.5 h-3.5" /> Messages sent today
            </div>
            <div className="text-2xl font-bold text-textPrimary">12,450</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2 text-textMuted text-xs font-medium uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Messages read
            </div>
            <div className="text-2xl font-bold text-textPrimary">5,803</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2 text-textMuted text-xs font-medium uppercase mb-1">
              <MousePointerClick className="w-3.5 h-3.5" /> Links clicked
            </div>
            <div className="text-2xl font-bold text-textPrimary">1,241</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2 text-textMuted text-xs font-medium uppercase mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Sales from messages
            </div>
            <div className="text-2xl font-bold text-textPrimary">$4,210</div>
          </CardContent>
        </Card>
      </div>

      <EventStream />
    </div>
  )
}
