import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { useMockData } from "../../hooks/useMockData"

export function RecentCampaigns() {
  const { data } = useMockData()
  const campaigns = data.RECENT_CAMPAIGNS

  return (
    <Card className="shadow-card overflow-hidden p-0">
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border mb-0 bg-background/40">
        <CardTitle className="text-sm font-semibold text-textPrimary">Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-textMuted uppercase tracking-wider bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Campaign</th>
                <th className="px-6 py-3 font-semibold">Audience</th>
                <th className="px-6 py-3 font-semibold">Channel</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, idx) => (
                <tr
                  key={campaign.id}
                  className="border-b border-border last:border-0 hover:bg-background/60 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?u=camp${idx}`}
                        className="w-6 h-6 rounded-full border border-border shadow-xs object-cover"
                        alt=""
                      />
                      <span className="font-medium text-textPrimary text-sm">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-textSecondary text-sm">{campaign.audience}</td>
                  <td className="px-6 py-3.5 text-textSecondary text-sm">{campaign.channel}</td>
                  <td className="px-6 py-3.5">
                    <Badge variant={
                      campaign.status === 'Running'   ? 'success' :
                      campaign.status === 'Completed' ? 'default' : 'outline'
                    }>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-textPrimary font-semibold text-sm">{campaign.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
