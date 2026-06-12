import { KPICards } from "../components/dashboard/KPICards"
import { FunnelChart } from "../components/dashboard/FunnelChart"
import { AIInsights } from "../components/dashboard/AIInsights"
import { RecentCampaigns } from "../components/dashboard/RecentCampaigns"

export function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      {/* Welcome header — warm and human */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Good morning, Sarah 👋
          </h1>
          <p className="text-textSecondary mt-1 text-sm">
            Here's a snapshot of how your business is connecting with customers today.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
          alt="Sarah"
          className="w-10 h-10 rounded-full border border-border shadow-sm object-cover hidden md:block"
        />
      </div>

      <KPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <FunnelChart />
          <RecentCampaigns />
        </div>
        <div className="xl:col-span-1">
          <AIInsights />
        </div>
      </div>
    </div>
  )
}
