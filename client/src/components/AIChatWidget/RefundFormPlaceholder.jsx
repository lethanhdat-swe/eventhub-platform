import { useState } from 'react';
import { X } from 'lucide-react';

const INITIAL_FORM = {
  orderCode: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountHolder: '',
  note: '',
};

function RefundField({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-(--text-primary)">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-(--border-color) bg-(--soft-surface-color) px-2.5 text-xs text-(--text-primary) outline-none transition placeholder:text-(--muted-text) focus:border-(--primary-color)"
      />
    </label>
  );
}

function RefundFormPlaceholder({ onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-2 rounded-xl border border-(--border-color) bg-(--soft-surface-color) p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-(--text-primary)">Yêu cầu hoàn vé</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng form hoàn vé"
            className="rounded-md p-1 text-(--muted-text) transition hover:bg-(--surface-color) hover:text-(--text-primary)"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      <div className="grid gap-2">
        <RefundField
          label="Mã đơn hàng"
          name="orderCode"
          value={form.orderCode}
          onChange={handleChange}
          placeholder="Nhập mã đơn"
        />
        <RefundField
          label="Họ và tên"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Họ tên người đặt"
        />
        <RefundField
          label="Email"
          name="customerEmail"
          type="email"
          value={form.customerEmail}
          onChange={handleChange}
          placeholder="email@example.com"
        />
        <RefundField
          label="Số điện thoại"
          name="customerPhone"
          value={form.customerPhone}
          onChange={handleChange}
          placeholder="09xxxxxxxx"
        />
        <RefundField
          label="Ngân hàng"
          name="bankName"
          value={form.bankName}
          onChange={handleChange}
          placeholder="Tên ngân hàng"
        />
        <RefundField
          label="Số tài khoản"
          name="bankAccountNumber"
          value={form.bankAccountNumber}
          onChange={handleChange}
          placeholder="Số tài khoản nhận hoàn"
        />
        <RefundField
          label="Chủ tài khoản"
          name="bankAccountHolder"
          value={form.bankAccountHolder}
          onChange={handleChange}
          placeholder="Tên chủ tài khoản"
        />
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-(--text-primary)">Ghi chú</span>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={2}
            placeholder="Lý do hoàn vé (tuỳ chọn)"
            className="w-full resize-none rounded-lg border border-(--border-color) bg-(--soft-surface-color) px-2.5 py-2 text-xs text-(--text-primary) outline-none transition placeholder:text-(--muted-text) focus:border-(--primary-color)"
          />
        </label>
      </div>

      <button
        type="button"
        disabled
        className="mt-2.5 h-9 w-full rounded-lg bg-(--primary-color) text-xs font-medium text-white opacity-50"
      >
        Gửi yêu cầu
      </button>
      <p className="mt-1.5 text-center text-[10px] text-(--muted-text)">Chức năng đang phát triển</p>
    </div>
  );
}

export default RefundFormPlaceholder;
