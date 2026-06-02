import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function AdminFilterDropdown({ label, options, value, onChange, contentClassName }) {
  const selected = options.find((o) => o.value === value);
  const buttonText =
    value && value !== 'all' && selected ? selected.label : label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1.5 px-3 text-sm"
          >
            <span className="truncate">{buttonText}</span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className={contentClassName ?? 'min-w-(--anchor-width)'}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="cursor-pointer"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminFilterDropdown;
