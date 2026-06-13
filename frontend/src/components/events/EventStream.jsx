import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Search, Filter, CheckCircle2, MessageCircle, MousePointerClick, DollarSign, Send, Play } from "lucide-react"
import { useMockData } from "../../hooks/useMockData"

const EVENT_ICONS = {
  'Campaign Started':   <Play className="w-3.5 h-3.5 text-primary" />,
  'Message Sent':       <Send className="w-3.5 h-3.5 text-textMuted" />,
  'Message Delivered':  <CheckCircle2 className="w-3.5 h-3.5 text-textSecondary" />,
  'Message Opened':     <MessageCircle className="w-3.5 h-3.5 text-aiAccent" />,
  'Link Clicked':       <MousePointerClick className="w-3.5 h-3.5 text-aiAccent" />,
  'Sale Recorded':      <DollarSign className="w-3.5 h-3.5 text-success" />,
}

export function EventStream() {
  const { data } = useMockData()
  const events = data.EVENT_STREAM
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = events.filter(e =>
    e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="shadow-card overflow-hidden p-0">
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border mb-0 rounded-t-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <CardTitle className="text-sm font-semibold">What's happening right now</CardTitle>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg text-xs pl-8 pr-3 py-2 text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-input"
              />
            </div>
            <button className="px-3 py-2 bg-background border border-border rounded-lg text-xs flex items-center gap-1.5 hover:bg-card transition-colors text-textPrimary shadow-xs font-medium">
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-textMuted sticky top-0 bg-background/95 backdrop-blur border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider">When</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider">What happened</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-background/60 transition-colors">
                  <td className="px-6 py-3.5 text-textMuted whitespace-nowrap font-medium">
                    {event.time}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 font-medium text-textPrimary">
                      {EVENT_ICONS[event.type] || <CheckCircle2 className="w-3.5 h-3.5 text-textMuted" />}
                      {event.type}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-textSecondary">{event.campaign}</td>
                  <td className="px-6 py-3.5 text-textSecondary font-medium">{event.user}</td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-textMuted">
                    {searchTerm
                      ? "No activity matches your search."
                      : "No activity yet — launch a campaign to see live events here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
