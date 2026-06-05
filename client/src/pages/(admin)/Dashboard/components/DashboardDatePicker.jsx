import { CalendarRange, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  createCustomDateRange,
  createPresetDateRange,
  DASHBOARD_DATE_PRESETS,
  formatDisplayDate,
  getDateRangeLabel,
} from '@/pages/(admin)/Dashboard/dateRange';

function DashboardDatePicker({ value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(value.from);
  const [draftTo, setDraftTo] = useState(value.to);

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setDraftFrom(value.from);
      setDraftTo(value.to);
    }
  };

  const handlePresetSelect = (presetId) => {
    onChange(createPresetDateRange(presetId));
    setOpen(false);
  };

  const handleApplyCustom = () => {
    if (!draftFrom || !draftTo) return;
    onChange(createCustomDateRange(draftFrom, draftTo));
    setOpen(false);
  };

  const rangeLabel = getDateRangeLabel(value);
  const customSummary =
    draftFrom && draftTo
      ? `${formatDisplayDate(draftFrom)} – ${formatDisplayDate(draftTo)}`
      : 'Chọn ngày bắt đầu và kết thúc';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn('h-9 shrink-0 gap-2 px-3 font-normal', className)}
          />
        }
      >
        <CalendarRange className="size-4 text-muted-foreground" />
        <span className="truncate max-w-50 sm:max-w-65">
          {rangeLabel}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[min(100vw-2rem,20rem)] p-0">
        <PopoverHeader className="border-b border-border px-3 py-2.5">
          <PopoverTitle>Khoảng thời gian</PopoverTitle>
          <PopoverDescription>
            Chọn mốc thời gian để xem số liệu trên bảng điều khiển.
          </PopoverDescription>
        </PopoverHeader>

        <div className="p-2">
          <div className="grid grid-cols-2 gap-1">
            {DASHBOARD_DATE_PRESETS.filter((preset) => preset.id !== 'custom').map(
              (preset) => {
                const isActive = value.preset === preset.id;

                return (
                  <Button
                    key={preset.id}
                    type="button"
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 justify-start px-2.5 text-xs font-medium',
                      isActive && 'ring-1 ring-border'
                    )}
                    onClick={() => handlePresetSelect(preset.id)}
                  >
                    {preset.label}
                  </Button>
                );
              }
            )}
          </div>

          <Separator className="my-2" />

          <div
            className={cn(
              'space-y-2 rounded-md px-0.5 py-1',
              value.preset === 'custom' && 'bg-muted/50 ring-1 ring-border'
            )}
          >
            <p className="text-xs font-medium text-foreground">Tùy chỉnh</p>
            <p className="text-xs text-muted-foreground">{customSummary}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="dashboard-date-from" className="text-xs">
                  Từ ngày
                </Label>
                <Input
                  id="dashboard-date-from"
                  type="date"
                  value={draftFrom}
                  max={draftTo || undefined}
                  onChange={(event) => setDraftFrom(event.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dashboard-date-to" className="text-xs">
                  Đến ngày
                </Label>
                <Input
                  id="dashboard-date-to"
                  type="date"
                  value={draftTo}
                  min={draftFrom || undefined}
                  onChange={(event) => setDraftTo(event.target.value)}
                  className="h-8"
                />
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              className="w-full h-8"
              disabled={!draftFrom || !draftTo}
              onClick={handleApplyCustom}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DashboardDatePicker;
