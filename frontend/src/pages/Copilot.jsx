import { ChatMessage } from "../components/copilot/ChatMessage"
import { ExecutionPanels } from "../components/copilot/ExecutionPanels"
import { Send, Compass } from "lucide-react"

export function Copilot() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Conversation */}
      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-2xl border border-border shadow-card">
        <div className="px-6 py-5 border-b border-border rounded-t-2xl flex items-center gap-3">
          <div className="p-2 bg-aiAccent/10 text-aiAccent rounded-lg shadow-xs ring-1 ring-aiAccent/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-textPrimary">Beacon Strategist</h2>
            <p className="text-xs text-textSecondary">
              Tell us what you want to achieve — we'll figure out the how.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background/40">
          <ChatMessage
            role="user"
            message="I want to bring back customers who haven't bought from us in a while."
          />
          <ChatMessage
            role="ai"
            message={`Good morning, Sarah! That's a great instinct — and the timing is right.

We found 8,400 customers who haven't made a purchase in the last 90 days. Based on what's worked for similar businesses, a friendly text message with a small discount tends to bring a lot of them back.

I've already put together a message and figured out who to send it to. Take a look on the right side — you can review it and launch with one click whenever you're ready.`}
          />
        </div>

        <div className="p-5 border-t border-border bg-card rounded-b-2xl">
          <div className="relative max-w-4xl mx-auto flex gap-3 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
              alt="Sarah"
              className="w-10 h-10 rounded-full border border-border object-cover shadow-xs hidden md:block shrink-0"
            />
            <div className="relative flex-1">
              <textarea
                className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none shadow-input transition-shadow"
                placeholder="Tell Beacon what you want to do — e.g. 'Send a thank you to my top 100 customers'..."
                rows={1}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors shadow-xs">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panels */}
      <div className="w-full lg:w-[400px] flex-shrink-0 overflow-y-auto pb-8">
        <ExecutionPanels />
      </div>
    </div>
  )
}
