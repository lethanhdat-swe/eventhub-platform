import { Outlet } from 'react-router-dom';

import Footer from '@/layouts/AuthLayout/components/Footer';
import Header from '@/layouts/AuthLayout/components/Header';

import '@/styles/admin.css';

function AuthLayout() {
  return (
    <div className="admin-font flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AuthLayout;
