import { cn } from "../../lib/utils"

export function Button({ className, variant = "default", size = "default", children, ...props }) {
  const variants = {
    default:  "bg-primary text-white hover:bg-blue-700 shadow-button-primary ring-1 ring-blue-700/30 hover:shadow-md",
    outline:  "border border-border bg-card hover:bg-background text-textPrimary shadow-button ring-1 ring-black/5 hover:shadow-md",
    ghost:    "bg-transparent hover:bg-background text-textSecondary hover:text-textPrimary",
    ai:       "bg-aiAccent text-white hover:bg-purple-700 shadow-button ring-1 ring-purple-700/30 hover:shadow-md",
    danger:   "bg-error text-white hover:bg-red-700 shadow-button ring-1 ring-red-700/20",
  }

  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    sm:      "h-7 rounded-md px-3 text-xs",
    lg:      "h-11 rounded-lg px-8 text-sm",
    icon:    "h-9 w-9",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
