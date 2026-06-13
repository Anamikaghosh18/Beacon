import { Card, CardContent } from "../ui/Card"
import { Users, TrendingUp, DollarSign, Megaphone } from "lucide-react"
import { useMockData } from "../../hooks/useMockData"

export function KPICards() {
  const { data } = useMockData()
  
  const kpiData = data.kpis || {
    total_customers: data.MOCK_KPIS.totalCustomers,
    active_segments: data.MOCK_KPIS.activeSegments,
    campaigns_sent: data.MOCK_KPIS.campaignsSent,
    revenue_influenced: data.MOCK_KPIS.revenueInfluenced
  }
  const { total_customers, active_segments, campaigns_sent, revenue_influenced } = kpiData

  const kpis = [
    {
      title:   "Total Customers",
      subline: "People in your contact list",
      value:   total_customers?.toLocaleString() || "0",
      icon:    Users,
      trend:   "+12% this month",
      trendUp: true,
    },
    {
      title:   "Customer Groups",
      subline: "Active customer categories",
      value:   active_segments || 0,
      icon:    TrendingUp,
      trend:   "+2 new groups",
      trendUp: true,
    },
    {
      title:   "Messages Sent",
      subline: "Across all campaigns",
      value:   campaigns_sent || 0,
      icon:    Megaphone,
      trend:   "+24% this month",
      trendUp: true,
    },
    {
      title:   "Revenue from Campaigns",
      subline: "Sales directly linked to messages",
      value:   `$${((revenue_influenced || 0) / 1000).toFixed(1)}k`,
      icon:    DollarSign,
      trend:   "+8% this month",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <Card
            key={i}
            className="shadow-card hover:shadow-card-hover transition-all duration-200 group cursor-default"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 border border-border bg-background rounded-lg shadow-xs group-hover:shadow-sm transition-shadow">
                  <Icon className="w-4 h-4 text-textSecondary" />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${kpi.trendUp ? "bg-success/8 text-success border-success/20" : "bg-error/8 text-error border-error/20"}`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-xs font-medium text-textMuted mb-0.5">{kpi.subline}</p>
              <h3 className="text-2xl font-bold text-textPrimary tracking-tight">{kpi.value}</h3>
              <p className="text-xs text-textSecondary mt-1 font-medium">{kpi.title}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
