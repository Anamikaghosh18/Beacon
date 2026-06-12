import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"

export function PerformanceMetrics() {
  const metrics = [
    { label: "Delivery Rate", value: "98.5%", subtext: "123,000 delivered" },
    { label: "Open Rate", value: "36.4%", subtext: "44,772 opened" },
    { label: "Click Rate", value: "9.2%", subtext: "11,316 clicked" },
    { label: "Conversion Rate", value: "2.8%", subtext: "3,444 converted" },
    { label: "Revenue", value: "$124,500", subtext: "$36 avg. order" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-border">
          {metrics.map((m, i) => (
            <div key={i} className={`flex flex-col ${i > 0 ? 'pl-4' : ''}`}>
              <span className="text-sm text-textSecondary mb-1">{m.label}</span>
              <span className="text-2xl font-bold text-textPrimary">{m.value}</span>
              <span className="text-xs text-textMuted mt-1">{m.subtext}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
