import { CalendarRange } from 'lucide-react';

function DatePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Ngày</label>
      <div className="flex flex-col gap-2">
        {[
          { key: 'startDate', label: 'Từ' },
          { key: 'endDate', label: 'Đến' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-8 text-xs text-gray-400 shrink-0">{label}</span>
            <div className="group flex flex-1 items-center gap-3 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color)">
              <CalendarRange size={16} color="var(--text-primary)" />
              <input
                type="date"
                value={value[key]}
                min={key === 'endDate' ? value.startDate : undefined}
                onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                className="w-full text-sm text-(--text-primary)"
                style={{ colorScheme: 'var(--color-scheme)', background: 'transparent' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatePicker;