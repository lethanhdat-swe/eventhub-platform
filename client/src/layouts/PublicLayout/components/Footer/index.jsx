import AppDownload from "./components/AppDownload";
import BrandLogo from "./components/BrandLogo";
import NavColumn from "./components/NavColumn";
import PaymentMethods from "./components/PaymentMethods";

function Footer() {
    return (
        <footer className="p-10 ">
            <div className="flex items-start justify-between">
                <BrandLogo />
                <NavColumn />
                <AppDownload />
            </div>

            <PaymentMethods />
        </footer>
    );
}

export default Footer;
