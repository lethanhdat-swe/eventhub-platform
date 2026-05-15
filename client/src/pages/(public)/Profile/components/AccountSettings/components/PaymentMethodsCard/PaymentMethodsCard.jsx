import { PaypalIcon, VisaIcon } from "@/assets/icons";
import { CreditCard, Plus } from "lucide-react";

const paymentMethods = [
  {
    id: 1,
    brand: "VISA",
    number: "**** 4582",
    icon: <VisaIcon size={40}/>,
    default: true,
  },
  {
    id: 2,
    brand: "Mastercard",
    number: "**** 8421",
    icon: <PaypalIcon size={40}/>,
    default: false,
  },
];

function PaymentMethodsCard() {
  return (
    <div
      className="
        rounded-3xl border border-(--text-primary)/10
        bg-(--text-primary)/3
        p-6 backdrop-blur-xl
      "
    >
      <div className="flex items-start justify-between">
           <div className="flex items-center gap-3">
             <div
                className="
                    flex h-11 w-11 items-center justify-center rounded-2xl
                    border border-(--primary-color)/20
                    bg-(--primary-color)/10
                    text-(--primary-color)
                "
                >
                <CreditCard className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-(--text-primary)">
                    Phương thức thanh toán
                </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Quản lý các thẻ thanh toán đã lưu trong tài khoản của bạn.
                </p>
            </div>
           </div>
      </div>

      <div className="flex items-center gap-2 mt-2 ">
        {paymentMethods.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between px-5 py-4 border rounded-2xl border-white/10 bg-white/3"
          >
            <div className="flex items-center gap-4">
                {card.icon}
              <div>
                <h4 className="font-medium text-(--text-primary)">
                  {card.brand}
                </h4>

                <p className="mt-1 text-sm text-gray-400">
                  {card.number}
                </p>
              </div>
            </div>

            {card.default && (
              <div
                className="px-3 py-1 text-xs font-medium text-green-400 rounded-full bg-green-500/10"
              >
                Mặc định
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="
          mt-6 flex items-center gap-2 rounded-full
          border border-(--primary-color)/20
          bg-(--primary-color)/10
          px-5 py-3 text-sm font-semibold
          text-(--primary-color)
          transition-opacity duration-200
          hover:opacity-80
          cursor-pointer
        "
      >
        <Plus className="w-4 h-4" />

        Thêm phương thức
      </button>
    </div>
  );
}

export default PaymentMethodsCard;