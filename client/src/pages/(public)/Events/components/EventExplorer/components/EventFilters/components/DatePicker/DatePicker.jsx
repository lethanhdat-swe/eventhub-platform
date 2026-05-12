import { CalendarRange } from 'lucide-react';

function DatePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Date</label>
      <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
        <CalendarRange color='var(--text-primary)'/>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
         className="w-full text-sm text-(--text-primary) placeholder:text-gray-600"
         style={{
            colorScheme: 'var(--color-scheme)',  
            color: 'var(--text-primary)',
            background: 'var(--surface-color)',
         }}
        />
      </div>
    </div>
  );
}

export default DatePicker;
