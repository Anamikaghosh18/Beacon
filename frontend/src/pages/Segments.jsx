import { useMockData } from "../hooks/useMockData"
import { SegmentCard } from "../components/segments/SegmentCard"
import { RuleBuilderMockup } from "../components/segments/RuleBuilderMockup"
import { Button } from "../components/ui/Button"
import { Plus } from "lucide-react"

export function Segments() {
  const { data } = useMockData()
  const segments = data.SEGMENTS

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Your Customers</h1>
          <p className="text-textSecondary mt-1 text-sm">
            Beacon automatically groups your customers based on their behaviour. You can send targeted messages to any of these groups in one click.
          </p>
        </div>
        <Button className="gap-2 shadow-button-primary shrink-0">
          <Plus className="w-4 h-4" /> Create a Group
        </Button>
      </div>

      <div>
        <h2 className="text-base font-semibold text-textPrimary mb-4">
          Active Customer Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {segments.map(segment => (
            <SegmentCard key={segment.id} segment={segment} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-textPrimary mb-1">Build Your Own Group</h2>
        <p className="text-sm text-textSecondary mb-4">
          Want to target a specific type of customer? Use the simple builder below — no technical knowledge needed.
        </p>
        <RuleBuilderMockup />
      </div>
    </div>
  )
}
