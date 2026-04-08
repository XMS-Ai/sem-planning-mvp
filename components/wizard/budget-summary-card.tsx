import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BudgetConfig } from "@/types/planning";

export function BudgetSummaryCard({ budget }: { budget: BudgetConfig }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-xs text-muted-foreground">Weekly</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.weeklyBudget)}</p>
          </div>
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.monthlyBudget)}</p>
          </div>
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-xs text-muted-foreground">Minimum LSA</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.minimumRequiredBudget)}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{budget.recommendationNote}</p>
      </CardContent>
    </Card>
  );
}
