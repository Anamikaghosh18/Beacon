import { cn } from "../../lib/utils"

export function ChatMessage({ role, message, className }) {
  const isAi = role === "ai"

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="shrink-0 pt-1">
        {isAi ? (
          <div className="w-10 h-10 rounded-full bg-aiAccent/10 border border-aiAccent/20 flex items-center justify-center shadow-xs ring-1 ring-aiAccent/10">
            <span className="text-aiAccent font-bold font-serif italic text-lg">B</span>
          </div>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
            alt="You"
            className="w-10 h-10 rounded-full border border-border object-cover shadow-xs"
          />
        )}
      </div>
      <div className="flex-1 space-y-2 pt-2">
        <p className="font-semibold text-xs text-textMuted uppercase tracking-wider">
          {isAi ? "Beacon Strategist" : "You"}
        </p>
        <div className="text-sm text-textPrimary leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </div>
  )
}
