import { Mail, Phone, User } from 'lucide-react';

function CustomerFormSection({
  value = { name: '', email: '', phone: '' },
  onChange,
}) {
  const form = value;

  const handleChange = (e) => {
    onChange?.({ ...form, [e.target.name]: e.target.value });
  };

  const fields = [
    {
      name: 'name',
      label: 'Họ và tên',
      type: 'text',
      placeholder: 'Nhập họ và tên',
      Icon: User,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Nhập email',
      Icon: Mail,
    },
    {
      name: 'phone',
      label: 'Số điện thoại',
      type: 'tel',
      placeholder: 'Nhập số điện thoại',
      Icon: Phone,
    },
  ];

  return (
    <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-4 sm:p-5 lg:p-6 space-y-4">
      <p className="text-(--text-primary) uppercase text-sm sm:text-base lg:text-lg tracking-wide">
        thông tin người đặt vé
      </p>

      <div className="grid grid-cols-1 gap-3  lg:grid-cols-3">
        {fields.map(({ name, label, type, placeholder, Icon }) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 border border-(--text-primary)/10 rounded-xl p-3 focus-within:border-(--text-primary)/40 transition min-w-0"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <p className="text-(--text-primary)/70 text-xs sm:text-sm">
                {label}
              </p>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="bg-transparent text-(--text-primary) text-sm outline-none w-full min-w-0 placeholder:text-(--text-primary)/30"
              />
            </div>
            <Icon
              color="var(--text-primary)"
              size={16}
              className="shrink-0 opacity-60"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerFormSection;
