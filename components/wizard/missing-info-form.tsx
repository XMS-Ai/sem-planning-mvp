import { MissingInfoItem, MissingInfoResponseValue } from "@/types/planning";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MissingInfoFormProps {
  items: MissingInfoItem[];
  values: Record<string, MissingInfoResponseValue>;
  acknowledged: string[];
  onValueChange: (id: string, value: MissingInfoResponseValue) => void;
  onAcknowledgedChange: (items: string[]) => void;
}

export function MissingInfoForm({
  items,
  values,
  acknowledged,
  onValueChange,
  onAcknowledgedChange
}: MissingInfoFormProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const acknowledgedItem = acknowledged.includes(item.id);
        return (
          <div key={item.id} className="space-y-2 rounded-xl border bg-white p-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id={`ack-${item.id}`}
                checked={acknowledgedItem}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onAcknowledgedChange([...acknowledged, item.id]);
                    return;
                  }
                  onAcknowledgedChange(acknowledged.filter((value) => value !== item.id));
                }}
              />
              <Label htmlFor={`ack-${item.id}`} className="leading-snug">
                {item.label}
                {item.required ? <span className="text-destructive"> *</span> : null}
              </Label>
            </div>

            {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}

            {item.fieldType === "number" ? (
              <Input
                type="number"
                value={String(values[item.id] ?? "")}
                onChange={(event) => onValueChange(item.id, Number(event.target.value))}
                placeholder="Enter number"
              />
            ) : null}

            {item.fieldType === "text" ? (
              <Textarea
                value={String(values[item.id] ?? "")}
                onChange={(event) => onValueChange(item.id, event.target.value)}
                placeholder="Add details"
              />
            ) : null}

            {item.fieldType === "multiselect" ? (
              <Textarea
                value={String(values[item.id] ?? "")}
                onChange={(event) => onValueChange(item.id, event.target.value)}
                placeholder="List selected options separated by commas"
              />
            ) : null}

            {item.fieldType === "checkbox" ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-2">
                <Checkbox
                  id={`value-${item.id}`}
                  checked={Boolean(values[item.id])}
                  onCheckedChange={(checked) => onValueChange(item.id, Boolean(checked))}
                />
                <Label htmlFor={`value-${item.id}`} className="text-xs text-muted-foreground">
                  Mark as provided
                </Label>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
