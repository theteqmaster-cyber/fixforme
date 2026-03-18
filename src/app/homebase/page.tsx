"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardView from '@/components/homebase/DashboardView';
import GigsView from '@/components/homebase/GigsView';
import ProfileView from '@/components/homebase/ProfileView';

// Separate component for reading search params to properly wrap in Suspense
function HomebaseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to dashboard
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Sync state with URL
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && ['dashboard', 'gigs', 'profile'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, [searchParams]);

  // Update URL when view changes (shallow routing)
  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
    router.push(`/homebase?view=${newView}`, { scroll: false });
  };

  // Listen for custom events from the Navbar
  useEffect(() => {
    const handleNavEvent = (e: CustomEvent) => {
      if (e.detail && e.detail.view) {
        handleViewChange(e.detail.view);
      }
    };

    window.addEventListener('homebase-nav', handleNavEvent as EventListener);
    return () => {
      window.removeEventListener('homebase-nav', handleNavEvent as EventListener);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* Background layer to keep consistent across transitions */}
      <div className="fixed inset-0 -z-10 bg-slate-950">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -ml-96 -mb-96 opacity-50"></div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <DashboardView />
          </motion.div>
        )}
        
        {currentView === 'gigs' && (
          <motion.div
            key="gigs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <GigsView />
          </motion.div>
        )}
        
        {currentView === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomebasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>}>
      <HomebaseContent />
    </Suspense>
  );
}
