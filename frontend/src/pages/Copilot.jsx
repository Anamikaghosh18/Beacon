import { useState } from "react"
import { ChatMessage } from "../components/copilot/ChatMessage"
import { ExecutionPanels } from "../components/copilot/ExecutionPanels"
import { Send, Compass, Loader2 } from "lucide-react"
import { api } from "../services/api"

export function Copilot() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Good morning! Tell us what you want to achieve — we'll figure out the how." }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [strategyResult, setStrategyResult] = useState(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const response = await api.generateStrategy(userMsg)
      setStrategyResult(response)
      
      const aiResponse = `I've put together a strategy for you.\n\nAudience: ${response.audience_match?.segment_name || 'Your segment'}\nChannel: ${(response.channel_data?.channel || response.channel_rec?.channel || 'email').toUpperCase()}\n\nReview the execution panel on the right and launch when ready!`
      setMessages(prev => [...prev, { role: "ai", content: aiResponse }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I had trouble connecting to the backend. Is the server running?" }])
    } finally {
      setIsLoading(false)
    }
  }
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
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} message={msg.content} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-textSecondary text-sm p-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Beacon Strategist is thinking...
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border bg-card rounded-b-2xl">
          <div className="relative max-w-4xl mx-auto flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full border border-border bg-aiAccent/10 flex items-center justify-center hidden md:flex shrink-0">
              <span className="text-aiAccent font-bold text-sm">B</span>
            </div>
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none shadow-input transition-shadow"
                placeholder="Tell Beacon what you want to do — e.g. 'Send a thank you to my top 100 customers'..."
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panels */}
      <div className="w-full lg:w-[400px] flex-shrink-0 overflow-y-auto pb-8">
        <ExecutionPanels strategy={strategyResult} />
      </div>
    </div>
  )
}
