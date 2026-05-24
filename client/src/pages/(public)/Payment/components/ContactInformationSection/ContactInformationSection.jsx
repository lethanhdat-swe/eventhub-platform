import { Contact, Mail, Phone } from 'lucide-react';

function ContactInformationSection({ customerInfo }) {
  const name = customerInfo?.name || 'Chưa cập nhật';
  const email = customerInfo?.email || 'Chưa cập nhật';
  const phone = customerInfo?.phone || 'Chưa cập nhật';
  const items = [
    {
      label: 'Họ và tên',
      value: name,
      icon: Contact,
    },
    {
      label: 'Email',
      value: email,
      icon: Mail,
    },
    {
      label: 'Số điện thoại',
      value: phone,
      icon: Phone,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mt-6 mb-3">
        <Contact color="var(--primary-color)" size={20} />
        <p className="text-(--text-primary) font-medium">Thông tin liên hệ</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex h-full items-center gap-3 rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-4"
            >
              <div className="rounded-lg border border-(--text-primary)/10 bg-(--surface-color)/60 p-3">
                <Icon color="var(--text-primary)" size={18} />
              </div>
              <div className="flex min-w-0 flex-col items-start gap-1">
                <h2 className="text-(--text-primary)/60 text-sm font-medium">
                  {item.label}
                </h2>
                <p className="w-full truncate text-(--text-primary)">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 px-4 py-3">
        <div className="rounded-lg p-2 bg-(--surface-color)/60 border border-(--text-primary)/10">
          <Mail size={16} className="text-[#f59e0b]" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-(--text-primary)">
            Email xác nhận sẽ được gửi sau khi thanh toán thành công.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactInformationSection;
