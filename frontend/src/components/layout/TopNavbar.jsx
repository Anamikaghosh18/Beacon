import { Bell, Search } from "lucide-react"
import { useUser, UserButton } from "@clerk/clerk-react"

export function TopNavbar() {
  const { user, isLoaded } = useUser()

  const displayName = isLoaded && user
    ? user.firstName || user.fullName?.split(" ")[0] || "there"
    : ""

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 shadow-navbar relative z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            placeholder="Search campaigns, customers..."
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Greeting — real user's first name */}
        {displayName && (
          <span className="text-sm text-textSecondary hidden lg:block">
            Hi, <span className="font-semibold text-textPrimary">{displayName}</span> 👋
          </span>
        )}

        {/* Notification bell */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background text-textSecondary hover:text-textPrimary transition-colors relative border border-transparent hover:border-border hover:shadow-xs">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-card"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Clerk UserButton — handles avatar, profile, sign out */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-full border border-border shadow-xs",
              userButtonPopoverCard: "shadow-xl border border-border rounded-xl",
              userButtonPopoverActionButton: "text-textPrimary hover:bg-background text-sm rounded-lg",
              userButtonPopoverActionButtonText: "text-textPrimary font-medium",
              userButtonPopoverFooter: "hidden",
            }
          }}
        />
      </div>
    </div>
  )
}
