import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useMockData } from "../../hooks/useMockData";

export function RecentCampaigns() {
  const { data } = useMockData();

  const campaigns = data.campaigns
    ? data.campaigns.slice(0, 4).map((c) => ({
        id: c.id,
        name: c.name,
        audience: `Segment #${c.segment_id}`,
        channel: c.channel || "Email",
        status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
        revenue: c.metrics?.revenue ? `$${c.metrics.revenue}` : "—",
      }))
    : data.RECENT_CAMPAIGNS;

  return (
    <Card className="shadow-card overflow-hidden p-0">
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border mb-0 bg-background/40">
        <CardTitle className="text-sm font-semibold text-textPrimary">
          Recent Campaigns
        </CardTitle>
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
                      <div className="w-6 h-6 rounded-full border border-border bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                        {campaign.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-textPrimary text-sm">
                        {campaign.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-textSecondary text-sm">
                    {campaign.audience}
                  </td>
                  <td className="px-6 py-3.5 text-textSecondary text-sm">
                    {campaign.channel}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      variant={
                        campaign.status === "Running" ||
                        campaign.status === "Sending" ||
                        campaign.status === "Launched"
                          ? "success"
                          : campaign.status === "Completed"
                            ? "default"
                            : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-textPrimary font-semibold text-sm">
                    {campaign.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
