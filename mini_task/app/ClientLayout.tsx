'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/header/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
