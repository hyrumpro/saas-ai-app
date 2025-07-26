'use client';

import Link from 'next/link';
import { UserNav } from '@/components/shared/user-nav';

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link href="/" className="text-lg font-semibold">
        SaaS App
      </Link>
      <UserNav />
    </header>
  );
}
