import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdsPreviewCardProps {
  note: string;
}

export function AdsPreviewCard({ note }: AdsPreviewCardProps) {
  return (
    <Card className="overflow-hidden border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-cyan-50 to-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Mock Ads Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl border bg-white p-3">
          <p className="text-xs font-semibold text-primary">Google Guaranteed</p>
          <p className="mt-1 text-sm font-semibold">Gutter Guardians | Top-Rated Gutter Installation</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Licensed local pros. Fast response. Flexible financing available.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
