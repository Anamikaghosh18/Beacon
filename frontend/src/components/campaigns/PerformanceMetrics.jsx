import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"

export function PerformanceMetrics({ campaign }) {
  // If campaign has real metrics, use them. Otherwise show empty/zero state.
  const m = campaign?.metrics || {}

  const metrics = [
    {
      label: "Delivery Rate",
      value: m.delivery_rate != null ? `${m.delivery_rate}%` : "—",
      subtext: m.delivered != null ? `${m.delivered.toLocaleString()} delivered` : "No data yet",
    },
    {
      label: "Open Rate",
      value: m.open_rate != null ? `${m.open_rate}%` : "—",
      subtext: m.opened != null ? `${m.opened.toLocaleString()} opened` : "No data yet",
    },
    {
      label: "Click Rate",
      value: m.click_rate != null ? `${m.click_rate}%` : "—",
      subtext: m.clicked != null ? `${m.clicked.toLocaleString()} clicked` : "No data yet",
    },
    {
      label: "Conversion Rate",
      value: m.conversion_rate != null ? `${m.conversion_rate}%` : "—",
      subtext: m.converted != null ? `${m.converted.toLocaleString()} converted` : "No data yet",
    },
    {
      label: "Revenue",
      value: m.revenue != null ? `$${m.revenue.toLocaleString()}` : "—",
      subtext: m.avg_order != null ? `$${m.avg_order} avg. order` : "No data yet",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-border">
          {metrics.map((item, i) => (
            <div key={i} className={`flex flex-col ${i > 0 ? 'pl-4' : ''}`}>
              <span className="text-sm text-textSecondary mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-textPrimary">{item.value}</span>
              <span className="text-xs text-textMuted mt-1">{item.subtext}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
