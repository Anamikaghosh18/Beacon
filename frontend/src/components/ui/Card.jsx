import { cn } from "../../lib/utils"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-6 shadow-card transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-5", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-sm font-semibold leading-tight tracking-tight text-textPrimary", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}
