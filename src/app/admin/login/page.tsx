"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, KeyRound, Loader2, Fingerprint } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Verify admin role
      const profileRef = doc(db, 'profiles', userCredential.user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists() && profileSnap.data().role === 'admin') {
        router.push('/admin');
      } else {
        setErrorMsg('Authorization failed: Insufficient clearance level.');
        // Sign out immediately if not admin
        await auth.signOut();
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Authentication failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Cyberpunk background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 60%)',
           }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTM5IDM5VTBIMzlIMk00MCA0MFYwTTQwIDQwaC00MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 z-0"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase shadow-black drop-shadow-lg">
            SERVU<span className="text-red-500 font-light">ADMIN</span>
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-4"></div>
          <p className="text-red-500/80 text-xs mt-4 tracking-[0.3em] font-bold">RESTRICTED ACCESS</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-lg border border-red-500/20 shadow-2xl relative overflow-hidden group">
          {/* Animated scanline */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline transition-opacity duration-300"></div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-6 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block font-bold">Operator ID</label>
              <div className="flex items-center bg-black/50 border border-slate-800 rounded focus-within:border-red-500/50 transition-colors">
                <div className="p-3 border-r border-slate-800">
                  <Fingerprint className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent p-3 text-slate-300 focus:outline-none placeholder-slate-700"
                  placeholder="admin@servu.co.zw"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block font-bold">Access Key</label>
              <div className="flex items-center bg-black/50 border border-slate-800 rounded focus-within:border-red-500/50 transition-colors">
                <div className="p-3 border-r border-slate-800">
                  <KeyRound className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-transparent p-3 text-slate-300 focus:outline-none placeholder-slate-700 font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest py-4 rounded transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Initialize Session'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <Link href="/" className="text-slate-600 text-xs hover:text-slate-400 transition-colors uppercase tracking-widest">
            Return to Public Sector
          </Link>
        </div>
      </div>
    </div>
  );
}
