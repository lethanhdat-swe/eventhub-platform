import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function SettingsCheckboxField({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <Label htmlFor={id} className="font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

export default SettingsCheckboxField;