import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Users, TrendingUp, TrendingDown, DollarSign, ArrowRight } from "lucide-react"

export function SegmentCard({ segment }) {
  const isPositive = segment.trend.startsWith('+')

  const avatarSeeds = [segment.id + "a", segment.id + "b", segment.id + "c"]

  return (
    <Card className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group shadow-card">
      <CardHeader className="mb-3 pb-3 border-b border-border">
        <CardTitle className="flex items-center justify-between">
          <span className="group-hover:text-primary transition-colors text-base text-textPrimary font-semibold">{segment.name}</span>
          <div className="flex -space-x-2">
            {avatarSeeds.map((seed, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/150?u=${seed}`}
                alt="Customer"
                className="w-6 h-6 rounded-full border-2 border-card object-cover shadow-xs"
              />
            ))}
          </div>
        </CardTitle>
        {segment.desc && (
          <p className="text-xs text-textSecondary leading-relaxed mt-1">{segment.desc}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-textSecondary">
              <Users className="w-3.5 h-3.5 text-textMuted" />
              <span className="text-sm">People in this group</span>
            </div>
            <span className="font-semibold text-textPrimary text-sm">{segment.size.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-textSecondary">
              <DollarSign className="w-3.5 h-3.5 text-textMuted" />
              <span className="text-sm">Revenue from this group</span>
            </div>
            <span className="font-semibold text-textPrimary text-sm">{segment.revenue}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-xs text-textSecondary font-medium">Growth this month</span>
            <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {segment.trend}
            </div>
          </div>

          <button className="mt-1 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:text-blue-700 transition-colors py-2 border border-primary/20 rounded-lg hover:bg-primary/5 shadow-xs">
            Send a message to this group <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
