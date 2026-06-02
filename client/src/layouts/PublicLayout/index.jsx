import { Outlet } from 'react-router-dom';
import Header from '@/layouts/PublicLayout/components/Header';
import Footer from '@/layouts/PublicLayout/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import AIChatWidget from '@/components/AIChatWidget/AIChatWidget';
function PublicLayout() {
  return (
    <div className="bg-(--background-color)">
      <Header />
      <Outlet />
      <Toaster />
      <Footer />
      <AIChatWidget />
    </div>
  );
}

export default PublicLayout;
