import { KPICards } from "../components/dashboard/KPICards"
import { FunnelChart } from "../components/dashboard/FunnelChart"
import { AIInsights } from "../components/dashboard/AIInsights"
import { RecentCampaigns } from "../components/dashboard/RecentCampaigns"
import { useUser } from "@clerk/clerk-react"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function Dashboard() {
  const { user, isLoaded } = useUser()

  const firstName = isLoaded && user
    ? user.firstName || user.fullName?.split(" ")[0] || "there"
    : "there"

  const avatarUrl = isLoaded && user ? user.imageUrl : null

  return (
    <div className="space-y-8 pb-8">
      {/* Real user welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-textSecondary mt-1 text-sm">
            Here's a snapshot of how your business is connecting with customers today.
          </p>
        </div>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={firstName}
            className="w-10 h-10 rounded-full border border-border shadow-sm object-cover hidden md:block"
          />
        )}
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
