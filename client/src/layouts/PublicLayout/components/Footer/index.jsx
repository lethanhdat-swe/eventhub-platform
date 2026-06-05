import AppDownload from './components/AppDownload';
import BrandLogo from './components/BrandLogo';
import NavColumn from './components/NavColumn';
import PaymentMethods from './components/PaymentMethods';

function Footer() {
  return (
    <footer className="relative border-t border-(--border-color) bg-(--background-color) text-(--text-primary)">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_30%)]" />

      <div className="container relative z-10 py-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.4fr_1fr] lg:items-start">
          <BrandLogo />
          <NavColumn />
          <AppDownload />
        </div>

        <PaymentMethods />
      </div>
    </footer>
  );
}

export default Footer;
