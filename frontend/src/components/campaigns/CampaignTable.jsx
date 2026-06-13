import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useMockData } from "../../hooks/useMockData";

export function CampaignTable() {
  const { data } = useMockData();

  const campaigns = data.campaigns
    ? data.campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        audience: `Segment #${c.segment_id}`,
        channel: c.channel || "Email",
        status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
        revenue: c.metrics?.revenue ? `$${c.metrics.revenue}` : "—",
      }))
    : data.RECENT_CAMPAIGNS;

  const enrichedCampaigns = campaigns.map((c) => ({
    ...c,
    openRate:
      c.status === "Draft" ? "—" : `${(Math.random() * 40 + 10).toFixed(1)}%`,
    clickRate:
      c.status === "Draft" ? "—" : `${(Math.random() * 10 + 1).toFixed(1)}%`,
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersActive, setFiltersActive] = useState(false);
  const itemsPerPage = 5;

  const filteredCampaigns = enrichedCampaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.audience.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Card className="border-border shadow-sm p-0 overflow-hidden">
      <CardHeader className="p-6 border-b border-border bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>All Campaigns</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-sm transition-shadow"
              />
            </div>
            <Button
              variant={filtersActive ? "secondary" : "outline"}
              className={`gap-2 ${filtersActive ? "text-primary border-primary/20 bg-primary/5" : "text-textSecondary bg-card"}`}
              onClick={() => setFiltersActive(!filtersActive)}
            >
              <Filter className="w-4 h-4" /> Filter{" "}
              {filtersActive && "(Active)"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-textSecondary uppercase bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-textPrimary">
                    Campaign <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">CTR</th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-background/50 transition-colors cursor-pointer group"
                  onClick={() =>
                    (window.location.href = `/app/campaigns/${campaign.id}`)
                  }
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-textPrimary group-hover:text-primary transition-colors">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-textSecondary mt-0.5">
                      {campaign.channel}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-full border border-border bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      {campaign.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-textSecondary">
                    {campaign.audience}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-textSecondary">
                    {campaign.openRate}
                  </td>
                  <td className="px-6 py-4 text-textSecondary">
                    {campaign.clickRate}
                  </td>
                  <td className="px-6 py-4 text-textPrimary font-semibold">
                    {campaign.revenue}
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-textSecondary"
                  >
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-background border-t border-border flex items-center justify-between text-sm text-textSecondary">
          <span>
            Showing{" "}
            {paginatedCampaigns.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)}{" "}
            of {filteredCampaigns.length} entries
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
