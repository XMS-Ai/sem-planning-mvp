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
        {/* Ajuste #1 — Titulos solicitados por SEM Team */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Presupuesto semanal del cliente */}
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-[11px] leading-tight text-muted-foreground">Client weekly budget</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.weeklyBudget)}</p>
          </div>
          {/* Presupuesto mensual del cliente */}
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-[11px] leading-tight text-muted-foreground">Client monthly budget</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.monthlyBudget)}</p>
          </div>
          {/* Mínimo requerido por Google */}
          <div className="rounded-xl border bg-white px-2 py-3">
            <p className="text-[11px] leading-tight text-muted-foreground">Min. req. budget from Google</p>
            <p className="text-sm font-semibold">{formatCurrency(budget.minimumRequiredBudget)}</p>
          </div>
        </div>
        {/* Nota de recomendación por XMS */}
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
            Budget Recommendation note by XMS
          </p>
          <p className="text-sm text-slate-700">{budget.recommendationNote}</p>
        </div>
      </CardContent>
    </Card>
  );
}
