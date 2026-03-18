"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  History,
  ShieldCheck,
  User,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeGigs, setActiveGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(authUser);

      try {
        // Fetch profile
        const profileRef = doc(db, 'profiles', authUser.uid);
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;
        setProfile(profileData);

        // Fetch active gigs (based on role)
        const role = profileData?.role || 'worker';
        const gigsRef = collection(db, 'gigs');
        let q;

        if (role === 'client') {
          q = query(gigsRef, where('client_id', '==', authUser.uid), limit(10));
        } else {
          q = query(gigsRef, where('status', '==', 'in_progress'), limit(10)); 
        }

        const querySnapshot = await getDocs(q);
        const gigsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActiveGigs(gigsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const role = profile?.role || 'worker';
  const stats = [
    { label: role === 'worker' ? 'Total Earned' : 'Budget Spent', value: role === 'worker' ? '$0' : '$0', icon: <TrendingUp className="w-5 h-5 text-accent" />, color: 'bg-accent/20' },
    { label: 'Active Gigs', value: activeGigs.length.toString(), icon: <Clock className="w-5 h-5 text-primary" />, color: 'bg-primary/20' },
    { label: 'Completed', value: profile?.completed_jobs?.toString() || '0', icon: <CheckCircle className="w-5 h-5 text-orange-500" />, color: 'bg-orange-500/20' },
    { label: 'Rating', value: (profile?.rating?.toString() || '5.0'), icon: <History className="w-5 h-5 text-purple-500" />, color: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.full_name || user?.email?.split('@')[0]}</h1>
          <p className="text-slate-400">Here's what's happening with your {role} portal today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={role === 'worker' ? '/gigs' : '/post-gig'} 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg glow-shadow hover:scale-105 transition-all text-sm"
          >
            {role === 'worker' ? <Briefcase className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {role === 'worker' ? 'Find New Gigs' : 'Post New Gig'}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-lg">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Gigs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Active Tasks
            </h2>
          </div>
          
          <div className="space-y-4">
            {activeGigs.length > 0 ? (
              activeGigs.map((gig) => (
                <div key={gig.id} className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all shadow-md group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{gig.title}</h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> {gig.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-accent font-bold">${gig.budget}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">{gig.status}</span>
                    </div>
                  </div>
                  
                  {/* Commitment Lock Status */}
                  <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Commitment Lock Active</p>
                        <p className="text-[10px] text-slate-500">Funds secured in escrow</p>
                      </div>
                    </div>
                    <Link href={`/gigs/${gig.id}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Manage Task</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass p-12 rounded-3xl border border-white/5 text-center shadow-inner">
                <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-50" />
                <p className="text-slate-500">No active tasks found.</p>
                <Link href={role === 'worker' ? '/gigs' : '/post-gig'} className="text-primary text-sm font-bold mt-2 inline-block hover:underline">
                  {role === 'worker' ? 'Browse tasks' : 'Post your first gig'}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Profile & Notifications */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <h2 className="text-lg font-bold text-white mb-6">Reputation</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">
                  {Math.round((profile?.rating || 5.0) * 20)}%
                </div>
              </div>
              <div>
                <p className="text-white font-bold">Bulawayo Trusted</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider">Level 1 Service Provider</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-white/5 pt-4">
              "Your rating is consistent with the top service providers in Bulawayo."
            </p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-300 text-xs leading-snug">Welcome to Servu! Your account is now powered by Firebase.</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
