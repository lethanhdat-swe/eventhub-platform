import { CalendarRange, ChevronDown } from 'lucide-react';

function DatePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Date</label>
      <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700 focus-within:border-(--primary-color) transition-colors cursor-pointer">
        <CalendarRange color="gray" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm text-gray-300 bg-transparent outline-none cursor-pointer scheme-dark"
        />
        <ChevronDown color="gray" />
      </div>
    </div>
  );
}

export default DatePicker;
