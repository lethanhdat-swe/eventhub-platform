import { Outlet } from 'react-router-dom';
import Header from '@/layouts/PublicLayout/components/Header';
import Footer from '@/layouts/PublicLayout/components/Footer';
import { Toaster } from '@/components/ui/sonner';
function PublicLayout() {
  return (
    <div className="bg-(--background-color)">
      <Header />
      <Outlet />
      <Toaster />
      <Footer />
    </div>
  );
}

export default PublicLayout;
