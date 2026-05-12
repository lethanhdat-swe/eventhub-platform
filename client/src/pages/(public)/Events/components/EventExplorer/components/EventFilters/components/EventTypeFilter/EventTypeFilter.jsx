import CheckboxItem from '../CheckboxItem/CheckboxItem';

const EVENT_TYPES = [
  { label: 'Online Events', count: 32 },
  { label: 'Offline Events', count: 516 },
];

function EventTypeFilter({ selected, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-(--text-primary)">Event Type</span>
      <div className="flex flex-col gap-2.5">
        {EVENT_TYPES.map(({ label, count }) => (
          <CheckboxItem
            key={label}
            label={label}
            count={count}
            checked={selected.includes(label)}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
export default EventTypeFilter;
