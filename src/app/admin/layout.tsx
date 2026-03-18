"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ShieldX } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check if we are already on the admin login page
    if (pathname === '/admin/login') {
      setIsAuthorized(true); // Allow rendering the login page itself
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        router.push('/admin/login');
        return;
      }

      try {
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists() && profileSnap.data().role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          // Redirect non-admins to standard dashboard or home
          router.push('/dashboard'); 
        }
      } catch (error) {
        console.error("Error verifying admin authority:", error);
        setIsAuthorized(false);
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10 filter drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
        <p className="text-slate-500 font-bold uppercase tracking-widest mt-6 relative z-10 text-sm animate-pulse">Verifying Credentials</p>
      </div>
    );
  }

  if (isAuthorized === false && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <ShieldX className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Access Denied</h1>
        <p className="text-slate-400 font-medium max-w-md">Your security clearance is insufficient for this sector. Redirecting...</p>
      </div>
    );
  }

  // If on the login page, just render it without the sidebar
  if (pathname === '/admin/login') {
    return <div className="bg-slate-950 min-h-screen font-sans">{children}</div>;
  }

  return (
    <div className="bg-slate-950 min-h-screen font-sans flex text-slate-300">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen">
        {/* Global ambient background for main content area */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0 hidden"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
