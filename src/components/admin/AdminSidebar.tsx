"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Briefcase, 
  LayoutDashboard, 
  Users, 
  LogOut,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Gigs', icon: Briefcase, href: '/admin/gigs' },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 overflow-hidden hidden md:flex">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 blur-[80px] -z-10 mt-10"></div>
      
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30 group-hover:bg-red-500/30 transition-colors">
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">SERVU<span className="text-red-500 font-light ml-1">ADMIN</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 relative z-10">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Modules</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings / System Info */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <Link 
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-white/5 transition-all mb-2"
        >
          <Settings className="w-5 h-5" />
          System Settings
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
        >
          <LogOut className="w-5 h-5" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
