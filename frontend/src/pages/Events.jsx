import { Card, CardContent } from "../components/ui/Card"
import { CheckCircle2, MessageCircle, MousePointerClick, DollarSign } from "lucide-react"
import { EventStream } from "../components/events/EventStream"
import { useMockData } from "../hooks/useMockData"

export function Events() {
  const { data } = useMockData()
  const events = data.EVENT_STREAM || []

  const totalSent = events.filter(e => e.event_type === "sent").length
  const totalOpened = events.filter(e => e.event_type === "opened").length
  const totalClicked = events.filter(e => e.event_type === "clicked").length
  const totalRevenue = data.kpis?.revenue_influenced || 0

  const summaryCards = [
    { icon: MessageCircle, label: "Messages sent", value: totalSent > 0 ? totalSent.toLocaleString() : "—" },
    { icon: CheckCircle2, label: "Messages read", value: totalOpened > 0 ? totalOpened.toLocaleString() : "—" },
    { icon: MousePointerClick, label: "Links clicked", value: totalClicked > 0 ? totalClicked.toLocaleString() : "—" },
    { icon: DollarSign, label: "Sales from messages", value: totalRevenue > 0 ? `$${Number(totalRevenue).toLocaleString()}` : "—" },
  ]

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Live Activity</h1>
          <p className="text-textSecondary mt-1 text-sm">
            Real-time delivery and engagement events from OneSignal campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-success font-medium text-sm">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map(({ icon: Icon, label, value }, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 flex flex-col justify-center gap-1">
              <div className="flex items-center gap-2 text-textMuted text-xs font-medium uppercase mb-1">
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
              <div className="text-2xl font-bold text-textPrimary">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventStream />
    </div>
  )
}
