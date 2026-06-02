import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function mergeTicketTypeOptions(options, fallbackType) {
  if (!fallbackType?.id) return options;
  if (options.some((type) => type.id === fallbackType.id)) return options;
  return [
    {
      id: fallbackType.id,
      name: fallbackType.name ?? 'Loại vé',
    },
    ...options,
  ];
}

export function getTicketTypeLabel(options, value, fallbackType) {
  if (!value) return null;
  const match = options.find((type) => type.id === value);
  if (match) return match.name;
  if (fallbackType?.id === value) return fallbackType.name ?? null;
  return null;
}

function TicketTypeSelect({
  id,
  value,
  onValueChange,
  options,
  fallbackType,
  disabled,
  invalid,
}) {
  const mergedOptions = mergeTicketTypeOptions(options, fallbackType);
  const selectedLabel = getTicketTypeLabel(mergedOptions, value, fallbackType);

  return (
    <Select
      value={value || null}
      onValueChange={(next) => onValueChange(next ?? '')}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className="w-full h-9"
        aria-invalid={invalid}
      >
        <SelectValue placeholder="Chọn loại vé">{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {mergedOptions.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TicketTypeSelect;
