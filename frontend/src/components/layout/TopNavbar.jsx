import { Bell, Search } from "lucide-react"

export function TopNavbar() {
  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 shadow-navbar relative z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search campaigns, segments..."
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background text-textSecondary hover:text-textPrimary transition-colors relative border border-transparent hover:border-border hover:shadow-xs">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-card"></span>
        </button>
        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1"></div>
        {/* Profile */}
        <button className="flex items-center gap-2 hover:bg-background px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-border hover:shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
            alt="Sarah"
            className="w-7 h-7 rounded-full border border-border object-cover shadow-xs"
          />
          <span className="text-sm font-medium text-textSecondary hidden md:block">Sarah</span>
        </button>
      </div>
    </div>
  )
}
