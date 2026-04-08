import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCardListProps {
  selected: string[];
  recommended: string[];
}

export function ServiceCardList({ selected, recommended }: ServiceCardListProps) {
  return (
    <div className="grid gap-3">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Services selected by SEM team</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {selected.map((service) => (
            <Badge key={service}>{service}</Badge>
          ))}
        </CardContent>
      </Card>

      <Card className="border-amber-300/50 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Additional recommended services</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {recommended.map((service) => (
            <Badge key={service} variant="secondary" className="bg-amber-100 text-amber-900">
              {service}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
