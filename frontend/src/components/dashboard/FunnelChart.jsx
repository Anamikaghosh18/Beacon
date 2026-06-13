import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMockData } from "../../hooks/useMockData"

export function FunnelChart() {
  const { data } = useMockData()
  
  // Transform API funnel structure to what the chart expects
  const funnelData = data.funnel 
    ? data.funnel.map(item => ({ name: item.stage, value: item.count }))
    : data.CAMPAIGN_FUNNEL

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Campaign Funnel</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F7CFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F7CFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#26282F" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#17181C', borderColor: '#26282F', borderRadius: '8px' }}
              itemStyle={{ color: '#F5F7FA' }}
            />
            <Area type="monotone" dataKey="value" stroke="#4F7CFF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
