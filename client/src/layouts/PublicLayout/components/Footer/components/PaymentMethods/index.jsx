import {
  JCBIcon,
  MastercardIcon,
  PaypalIcon,
  SepayIcon,
  VisaIcon,
} from '@/assets/icons';
import { Copyright } from 'lucide-react';

function PaymentMethods() {
  const paymentIcons = [
    { id: 'visa', Icon: VisaIcon },
    { id: 'mastercard', Icon: MastercardIcon },
    { id: 'paypal', Icon: PaypalIcon },
    { id: 'jcb', Icon: JCBIcon },
    { id: 'sepay', Icon: SepayIcon },
  ];

  return (
    <div className="mt-10 border-t border-[var(--border-color)] pt-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-text)]">
          <Copyright size={17} />
          <p>2026 EventHub. Đã đăng ký bản quyền.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {paymentIcons.map(({ id, Icon }) => (
            <div
              key={id}
              className="
                flex h-9 items-center justify-center rounded-xl
                border border-[var(--border-color)]
                bg-[var(--soft-surface-color)] px-3
              "
            >
              <Icon size={36} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethods;
