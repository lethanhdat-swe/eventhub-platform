import { useSearchParams } from 'react-router-dom';
import PaymentError from "./components/PaymentError/PaymentError";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('status') === 'success';

  return (
    <div className="pt-(--header-height) container space-y-3">
      {isSuccess ? <PaymentSuccess /> : <PaymentError />}
    </div>
  );
}

export default PaymentStatus;