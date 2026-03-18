"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Briefcase, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'worker' | 'client' | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert("Please select your role first!");
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        full_name: formData.fullName,
        role: role,
        avatar_url: null,
        rating: 5.0,
        completed_jobs: 0,
        skills: [],
        bio: '',
        location: 'Bulawayo',
        created_at: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 transition-all hover:border-white/10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Join <span className="text-primary italic">Servu</span></h1>
          <p className="text-slate-400">Join Bulawayo's elite skills community.</p>
        </div>

        {!role ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Tell us who you are</p>
            <button 
              onClick={() => setRole('worker')}
              className="w-full group p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-5 hover:bg-primary/10 hover:border-primary/30 transition-all hover:scale-[1.02] shadow-xl"
            >
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-black text-white text-lg">I am a Worker</p>
                <p className="text-xs text-slate-400 leading-tight">Looking for tasks and income.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => setRole('client')}
              className="w-full group p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-5 hover:bg-accent/10 hover:border-accent/30 transition-all hover:scale-[1.02] shadow-xl"
            >
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Briefcase className="w-7 h-7 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-black text-white text-lg">I am an SME</p>
                <p className="text-xs text-slate-400 leading-tight">Looking for verified talent.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4 p-2 bg-primary/5 rounded-xl border border-primary/10">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <p className="text-xs text-slate-400">Signing up as <span className="text-primary font-bold uppercase">{role}</span></p>
              <button type="button" onClick={() => setRole(null)} className="ml-auto text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-tighter">Change</button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Full Name / SME Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="Create password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl mt-8 shadow-2xl glow-shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Join the Community'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account? {' '}
            <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
