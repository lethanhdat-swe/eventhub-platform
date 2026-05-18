import ColorPicker from 'react-pick-color';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { normalizeHexColor } from '@/pages/(admin)/TicketTypes/colorUtils';

const PICKER_THEME = {
  width: '240px',
  borderRadius: '8px',
  background: '#ffffff',
  inputBackground: '#f4f4f5',
  color: '#27272a',
  borderColor: '#e4e4e7',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
};

function TicketTypeColorField({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const displayColor = normalizeHexColor(value);

  return (
    <div className="space-y-1.5">
      <Label>Màu hiển thị</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <button
              type="button"
              disabled={disabled}
              className={cn(
                'flex h-9 w-full cursor-pointer items-center gap-3 rounded-md border border-input bg-background px-3 text-left text-sm',
                'transition-colors hover:bg-muted/40',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-label="Chọn màu hiển thị"
            />
          }
        >
          <span
            className="size-5 shrink-0 rounded border border-border"
            style={{ backgroundColor: displayColor }}
            aria-hidden
          />
          <span className="font-mono text-xs text-muted-foreground">
            {displayColor}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <ColorPicker
            color={displayColor}
            hideAlpha
            hideInputs={false}
            theme={PICKER_THEME}
            onChange={(colorObj) => {
              onChange(normalizeHexColor(colorObj.hex));
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TicketTypeColorField;
