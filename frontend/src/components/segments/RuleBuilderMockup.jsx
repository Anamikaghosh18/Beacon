import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Plus, Filter, Calendar, ShoppingCart } from "lucide-react"

export function RuleBuilderMockup() {
  return (
    <Card className="border-dashed border-2 bg-transparent">
      <CardHeader>
        <CardTitle className="text-textSecondary">Segment Rule Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-secondary rounded text-sm text-textPrimary font-medium border border-border">Include</div>
          <span className="text-textSecondary text-sm">users who match</span>
          <div className="px-3 py-1.5 bg-secondary rounded text-sm text-textPrimary font-medium border border-border">All</div>
          <span className="text-textSecondary text-sm">of the following:</span>
        </div>

        <div className="space-y-3 pl-4 border-l-2 border-border ml-2">
          {/* Rule 1 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="text-textPrimary">Has Purchased</span>
            </div>
            <span className="text-sm text-textSecondary">is</span>
            <div className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-textPrimary">
              True
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-textMuted uppercase w-8">AND</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm">
              <Calendar className="w-4 h-4 text-warning" />
              <span className="text-textPrimary">Last Purchase Date</span>
            </div>
            <span className="text-sm text-textSecondary">is before</span>
            <div className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-textPrimary">
              90 days ago
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4">
          <Button variant="outline" className="gap-2 border-dashed">
            <Plus className="w-4 h-4" /> Add Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
