import { CheckCircle } from 'lucide-react';

function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-100">
      <CheckCircle size={80} className="text-green-500" />
      <h2 className="text-2xl font-bold text-green-600">Thanh toán thành công!</h2>
      <p className="text-gray-500">Cảm ơn bạn đã đặt vé. Chúc bạn có buổi trải nghiệm tuyệt vời!</p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-2 mt-4 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
      >
        Về trang chủ
      </button>
    </div>
  );
}

export default PaymentSuccess;