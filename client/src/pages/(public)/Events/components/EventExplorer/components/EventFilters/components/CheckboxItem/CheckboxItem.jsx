import { Check } from 'lucide-react';

function CheckboxItem({ label, count, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(label)}
      className="flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${
            checked
              ? 'bg-(--primary-color) border-(--primary-color)'
              : 'border-gray-600 bg-transparent group-hover:border-(--primary-color)'
          }`}
        >
          {checked && <Check color="white" />}
        </div>
        <span
          className={`text-sm transition-colors ${
            checked ? 'text-(--text-primary)' : 'text-gray-400 group-hover:text-gray-300'
          }`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">{count}</span>
      )}
    </button>
  );
}

export default CheckboxItem;
