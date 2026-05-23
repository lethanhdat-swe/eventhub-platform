import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import AdminHeader from '@/layouts/AdminLayout/components/AdminHeader';
import AdminSidebar from '@/layouts/AdminLayout/components/AdminSidebar';

import '@/styles/admin.css';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-font fixed inset-0 flex overflow-hidden bg-background text-foreground">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
