import { Outlet } from 'react-router-dom';
import Header from '@/layouts/PublicLayout/components/Header';
import Footer from '@/layouts/PublicLayout/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import AIChatWidget from '@/components/AIChatWidget/AIChatWidget';
import GoToTop from '@/components/GoToTop/GoToTop';

function PublicLayout() {
  return (
    <div className="bg-(--background-color)">
      <Header />
      <Outlet />
      <Toaster />
      <Footer />
      <div className="pointer-events-none fixed bottom-5 right-4 z-[9999] flex flex-col-reverse items-end gap-3 md:bottom-8 md:right-8">
        <GoToTop />
        <AIChatWidget />
      </div>
    </div>
  );
}

export default PublicLayout;
