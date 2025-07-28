import type { Metadata } from 'next';
import Sidebar from '@/components/shared/Sidebar';
import { ReactNode } from 'react';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
