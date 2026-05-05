import { Outlet } from 'react-router-dom';
import Footer from '@/layouts/AuthLayout/components/Footer';
import Header from '@/layouts/AuthLayout/components/Header';

function AuthLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AuthLayout;
