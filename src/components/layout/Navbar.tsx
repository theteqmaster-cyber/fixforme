"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomebase = pathname === '/homebase';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, 'profiles', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleNavClick = (view: string, e?: React.MouseEvent) => {
    if (isHomebase) {
      if (e) e.preventDefault();
      setIsMenuOpen(false);
      const event = new CustomEvent('homebase-nav', { detail: { view } });
      window.dispatchEvent(event);
    }
  };

  return (
    <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg glow-shadow-sm group-hover:scale-110 transition-transform">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Servu</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/homebase?view=gigs" 
              onClick={(e) => handleNavClick('gigs', e)}
              className="text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
            >
              Browse Gigs
            </Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link 
                  href="/homebase?view=dashboard" 
                  onClick={(e) => handleNavClick('dashboard', e)}
                  className="text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                  <Link 
                    href="/homebase?view=profile"
                    onClick={(e) => handleNavClick('profile', e)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-slate-400 hover:text-white font-medium px-4 py-2">Log in</Link>
                <Link href="/signup" className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg glow-shadow-sm hover:scale-105 transition-all">
                  Join Servu
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/5 p-4 space-y-4">
          <Link href="/homebase?view=gigs" onClick={(e) => handleNavClick('gigs', e)} className="block text-slate-400 p-2">Browse Gigs</Link>
          {user ? (
            <>
              <Link href="/homebase?view=dashboard" onClick={(e) => handleNavClick('dashboard', e)} className="block text-slate-400 p-2">Dashboard</Link>
              <Link href="/homebase?view=profile" onClick={(e) => handleNavClick('profile', e)} className="block text-slate-400 p-2">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-400 p-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-slate-400 p-2">Log in</Link>
              <Link href="/signup" className="block bg-primary text-white text-center font-bold p-3 rounded-xl mt-4">Join Servu</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
