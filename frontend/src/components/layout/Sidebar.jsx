import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Compass, Megaphone, Users, Activity, Settings, Hexagon } from "lucide-react"
import { cn } from "../../lib/utils"

const NAV_ITEMS = [
  { name: "Overview",           href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Beacon Strategist",  href: "/app/assistant",  icon: Compass },
  { name: "Campaigns",          href: "/app/campaigns",  icon: Megaphone },
  { name: "Audiences",          href: "/app/segments",   icon: Users },
  { name: "Event Stream",       href: "/app/events",     icon: Activity },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-60 border-r border-border bg-card flex flex-col h-full shrink-0 shadow-[1px_0_0_0_#E2E8F0] relative z-20">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border shadow-xs">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-textPrimary font-semibold text-base tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-button-primary ring-1 ring-blue-700/30">
            <Hexagon className="w-3.5 h-3.5 text-white" />
          </div>
          Beacon
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-textMuted uppercase tracking-widest mb-2 px-2">Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-background text-primary shadow-sm border border-border ring-1 ring-black/5"
                  : "text-textSecondary hover:bg-background/70 hover:text-textPrimary"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-textMuted")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border shadow-[0_-1px_0_0_#E2E8F0]">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-background transition-colors cursor-pointer group">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
              alt="Sarah Jenks"
              className="w-7 h-7 rounded-full border border-border object-cover shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border-2 border-card"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-textPrimary truncate">Sarah Jenks</p>
            <p className="text-[10px] text-textMuted truncate">Growth Lead</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
