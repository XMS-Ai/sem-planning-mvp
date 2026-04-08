import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BusinessBioOption } from "@/types/planning";

interface BioCategorySelectorProps {
  options: BusinessBioOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

export function BioCategorySelector({
  options,
  selected,
  onChange,
  max = 6
}: BioCategorySelectorProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
      return;
    }

    if (selected.length >= max) return;
    onChange([...selected, id]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Choose up to {max} categories</p>
        <Badge variant={selected.length === max ? "success" : "secondary"}>
          {selected.length}/{max}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          const disabled = !isSelected && selected.length >= max;

          return (
            <Button
              key={option.id}
              type="button"
              variant="outline"
              onClick={() => toggle(option.id)}
              disabled={disabled}
              className={cn(
                "h-auto min-h-11 justify-start rounded-xl px-3 py-2 text-left text-sm",
                isSelected && "border-primary bg-primary/10 text-primary"
              )}
            >
              {isSelected ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-6" />}
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
