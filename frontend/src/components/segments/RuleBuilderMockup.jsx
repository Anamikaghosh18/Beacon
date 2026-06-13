import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Plus, Filter, Calendar, ShoppingCart, Trash2 } from "lucide-react"

export function RuleBuilderMockup() {
  const [rules, setRules] = useState([]);

  const handleAddRule = () => {
    setRules([...rules, { id: Date.now() }]);
  }

  const handleRemoveRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  }
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
          {rules.length === 0 ? (
            <div className="text-sm text-textMuted italic py-4">
              No rules added yet. Click "Add Rule" below.
            </div>
          ) : (
            rules.map((rule, idx) => (
              <div key={rule.id} className="flex items-center gap-3">
                {idx > 0 && <span className="text-xs font-bold text-textMuted uppercase w-8">AND</span>}
                <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-textMuted cursor-pointer hover:bg-secondary transition-colors">
                  <span>Select condition...</span>
                </div>
                <span className="text-sm text-textSecondary">is</span>
                <div className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-textMuted cursor-pointer hover:bg-secondary transition-colors">
                  Enter value...
                </div>
                <button 
                  onClick={() => handleRemoveRule(rule.id)}
                  className="ml-auto p-1.5 text-textMuted hover:text-error hover:bg-error/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 mt-4">
          <Button variant="outline" className="gap-2 border-dashed" onClick={handleAddRule}>
            <Plus className="w-4 h-4" /> Add Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
