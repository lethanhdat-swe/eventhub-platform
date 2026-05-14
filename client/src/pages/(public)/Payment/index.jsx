import BankTransferMethod from "./components/BankTransferMethod/BankTransferMethod";
import ContactInformationSection from "./components/ContactInformationSection/ContactInformationSection";
import OrderIdCard from "./components/OrderIdCard/OrderIdCard";
import OrderSummarySection from "./components/OrderSummarySection/OrderSummarySection";
import PaymentActionSection from "./components/PaymentActionSection/PaymentActionSection";
import PaymentHero from "./components/PaymentHero/PaymentHero";
import PaymentMethodSection from "./components/PaymentMethodSection/PaymentMethodSection";

function Payment() {
    return ( 
        <div className="pt-(--header-height) container space-y-3">
            <PaymentHero />
            <OrderIdCard />
            <OrderSummarySection />
            <PaymentMethodSection />
            <BankTransferMethod />
            <ContactInformationSection />
            <PaymentActionSection />
        </div>
     );
}

export default Payment;