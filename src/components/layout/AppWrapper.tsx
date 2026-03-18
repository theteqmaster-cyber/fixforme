"use client";

import { useOffline } from '@/hooks/useOffline';
import { Navbar } from './Navbar';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const isOffline = useOffline();

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/20 text-accent text-center text-xs py-1.5 border-b border-accent/30 font-medium flex items-center justify-center gap-2"
          >
            <WifiOff className="w-3 h-3" />
            Working Offline (Data will sync when back online)
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 border-t border-white/5 bg-background/50 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Servu. Serving You, Empowering the Future.
        </p>
      </footer>
    </div>
  );
}
