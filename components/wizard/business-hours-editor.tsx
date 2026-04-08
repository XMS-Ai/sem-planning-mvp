import { BusinessHour } from "@/types/planning";
import { DAY_LABELS } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface BusinessHoursEditorProps {
  hours: BusinessHour[];
  onChange: (hours: BusinessHour[]) => void;
}

export function BusinessHoursEditor({ hours, onChange }: BusinessHoursEditorProps) {
  const update = (index: number, patch: Partial<BusinessHour>) => {
    const next = [...hours];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {hours.map((hour, index) => (
        <div key={hour.day} className="rounded-xl border bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{DAY_LABELS[hour.day]}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{hour.isClosed ? "Closed" : "Open"}</span>
              <Switch
                checked={!hour.isClosed}
                onCheckedChange={(checked) =>
                  update(index, {
                    isClosed: !checked,
                    openTime: checked ? hour.openTime || "08:00" : "",
                    closeTime: checked ? hour.closeTime || "17:00" : ""
                  })
                }
              />
            </div>
          </div>

          {!hour.isClosed ? (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="time"
                value={hour.openTime || ""}
                onChange={(event) => update(index, { openTime: event.target.value })}
              />
              <Input
                type="time"
                value={hour.closeTime || ""}
                onChange={(event) => update(index, { closeTime: event.target.value })}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
