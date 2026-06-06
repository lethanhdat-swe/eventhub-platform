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
    <div className="mt-8 border-t border-(--border-color) pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-(--muted-text)">
          <Copyright size={15} />
          <p>2026 Beetic. Đã đăng ký bản quyền.</p>
        </div>

        {/* justify-start mobile, tự align-right theo flex-row trên md */}
        <div className="flex flex-wrap items-center gap-2">
          {paymentIcons.map(({ id, Icon }) => (
            <div
              key={id}
              className="
                flex h-8 items-center justify-center rounded-xl
                border border-(--border-color)
                bg-(--soft-surface-color) px-2.5
                sm:h-9 sm:px-3
              "
            >
              <Icon size={32} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethods;
