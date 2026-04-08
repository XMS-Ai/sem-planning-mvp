import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GeoTargetSelectorProps {
  locations: string[];
  selected: string[];
  onToggle: (location: string) => void;
}

export function GeoTargetSelector({
  locations,
  selected,
  onToggle
}: GeoTargetSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {locations.map((location) => {
        const active = selected.includes(location);
        return (
          <Button
            key={location}
            type="button"
            variant="outline"
            onClick={() => onToggle(location)}
            className={cn(
              "h-auto rounded-full px-3 py-2 text-xs",
              active && "border-primary bg-primary/10 text-primary"
            )}
          >
            {active ? <Check className="mr-1 h-3.5 w-3.5" /> : null}
            {location}
          </Button>
        );
      })}
    </div>
  );
}
