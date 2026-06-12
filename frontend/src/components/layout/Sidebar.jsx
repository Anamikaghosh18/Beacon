import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Megaphone,
  Users,
  Activity,
  LogOut,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { cn } from "../../lib/utils";
import logoImg from "../../assets/beaconlogo.png";

const NAV_ITEMS = [
  { name: "Overview", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Beacon Strategist", href: "/app/assistant", icon: Compass },
  { name: "Campaigns", href: "/app/campaigns", icon: Megaphone },
  { name: "Audiences", href: "/app/segments", icon: Users },
  { name: "Live Activity", href: "/app/events", icon: Activity },
];

export function Sidebar() {
  const location = useLocation();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const displayName =
    isLoaded && user
      ? user.fullName ||
        user.firstName ||
        user.emailAddresses?.[0]?.emailAddress ||
        "You"
      : "Loading...";

  const displayEmail =
    isLoaded && user ? user.emailAddresses?.[0]?.emailAddress || "" : "";

  const avatarUrl = isLoaded && user ? user.imageUrl : null;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-60 border-r border-border bg-card flex flex-col h-full shrink-0 shadow-[1px_0_0_0_#E2E8F0] relative z-20">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border shadow-xs">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-textPrimary font-semibold text-base tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 overflow-hidden rounded-lg shadow-button-primary ring-1 ring-blue-700/30 bg-white/5">
            <img
              src={logoImg}
              alt="Beacon"
              className="w-full h-full object-cover scale-125"
            />
          </div>
          Beacon
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-textMuted uppercase tracking-widest mb-2 px-2">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-background text-primary shadow-sm border border-border ring-1 ring-black/5"
                  : "text-textSecondary hover:bg-background/70 hover:text-textPrimary",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-primary" : "text-textMuted",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Real User Profile — from Clerk */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg group">
          {/* Avatar */}
          {avatarUrl ? (
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-7 h-7 rounded-full border border-border object-cover shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border-2 border-card"></span>
            </div>
          ) : (
            <div className="relative shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xs">
              <span className="text-[10px] font-bold text-primary">
                {initials}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border-2 border-card"></span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-textPrimary truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-textMuted truncate">
              {displayEmail}
            </p>
          </div>
          {/* Sign out button */}
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            title="Sign out"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background rounded text-textMuted hover:text-error"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
