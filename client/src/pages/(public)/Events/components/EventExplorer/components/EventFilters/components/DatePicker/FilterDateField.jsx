import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  formatDisplayDate,
  formatMonthYear,
  getCalendarDays,
  isDateDisabled,
  parseInputDate,
  toInputDate,
  WEEKDAY_LABELS,
} from './dateUtils';

function FilterDateField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder = 'dd/mm/yyyy',
}) {
  const today = useMemo(() => toInputDate(new Date()), []);
  const selectedDate = parseInputDate(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  useEffect(() => {
    if (open) {
      setViewDate(parseInputDate(value) ?? new Date());
    }
  }, [open, value]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const calendarDays = getCalendarDays(viewYear, viewMonth);
  const displayValue = formatDisplayDate(value);

  const handleSelectDay = (day) => {
    const nextValue = toInputDate(new Date(viewYear, viewMonth, day));

    if (isDateDisabled(nextValue, { min, max })) return;

    onChange(nextValue);
    setOpen(false);
  };

  const handleToday = () => {
    if (isDateDisabled(today, { min, max })) return;

    onChange(today);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  return (
    <div
      className={cn(
        `
          rounded-xl border border-(--border-color)
          bg-(--soft-surface-color) px-3.5 py-3
          transition
        `,
        open && 'border-(--primary-color)/60 ring-4 ring-(--primary-color)/10'
      )}
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-(--muted-text)">
        {label}
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="
                flex w-full items-center gap-3 text-left outline-none
              "
            />
          }
        >
          <CalendarDays
            size={16}
            className="shrink-0 text-(--primary-color)"
          />

          <span
            className={cn(
              'flex-1 text-sm font-bold',
              displayValue
                ? 'text-(--text-primary)'
                : 'text-(--muted-text) font-medium'
            )}
          >
            {displayValue || placeholder}
          </span>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="
            w-[min(100vw-2rem,18.5rem)] rounded-2xl border border-(--border-color)
            !bg-(--surface-color) p-0 text-(--text-primary)
            shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-0
          "
        >
          <div className="flex items-center justify-between gap-2 border-b border-(--border-color) px-3 py-3">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="
                flex size-8 items-center justify-center rounded-lg
                text-(--muted-text) transition
                hover:bg-(--primary-color)/10 hover:text-(--primary-color)
              "
              aria-label="Tháng trước"
            >
              <ChevronLeft size={16} />
            </button>

            <p className="text-sm font-black capitalize text-(--text-primary)">
              {formatMonthYear(viewYear, viewMonth)}
            </p>

            <button
              type="button"
              onClick={goToNextMonth}
              className="
                flex size-8 items-center justify-center rounded-lg
                text-(--muted-text) transition
                hover:bg-(--primary-color)/10 hover:text-(--primary-color)
              "
              aria-label="Tháng sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 px-3 pt-3">
            {WEEKDAY_LABELS.map((weekday) => (
              <span
                key={weekday}
                className="pb-1 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-(--muted-text)"
              >
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 px-3 pb-3">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} />;
              }

              const dayValue = toInputDate(new Date(viewYear, viewMonth, day));
              const isSelected = value === dayValue;
              const isToday = today === dayValue;
              const disabled = isDateDisabled(dayValue, { min, max });

              return (
                <button
                  key={dayValue}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    `
                      flex size-9 items-center justify-center rounded-lg
                      text-sm font-bold transition
                    `,
                    disabled &&
                      'cursor-not-allowed text-(--muted-text)/35',
                    !disabled &&
                      !isSelected &&
                      'text-(--text-primary) hover:bg-(--primary-color)/12 hover:text-(--primary-color)',
                    isToday &&
                      !isSelected &&
                      !disabled &&
                      'ring-1 ring-(--primary-color)/35',
                    isSelected &&
                      'bg-(--primary-color) text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-(--border-color) px-3 py-2.5">
            <button
              type="button"
              onClick={handleClear}
              className="
                rounded-lg px-2.5 py-1.5 text-xs font-bold text-(--muted-text)
                transition hover:bg-(--soft-surface-color) hover:text-(--text-primary)
              "
            >
              Xóa
            </button>

            <button
              type="button"
              onClick={handleToday}
              disabled={isDateDisabled(today, { min, max })}
              className="
                rounded-lg px-2.5 py-1.5 text-xs font-bold text-(--primary-color)
                transition hover:bg-(--primary-color)/10
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              Hôm nay
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default FilterDateField;
