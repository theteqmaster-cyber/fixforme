"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  History,
  ShieldCheck,
  User,
  Loader2,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function WorkerDashboard({ user, profile }: { user: any, profile: any }) {
  const [activeGigs, setActiveGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatModalGig, setChatModalGig] = useState<any>(null);
  const [updatingGigId, setUpdatingGigId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const gigsRef = collection(db, 'gigs');
        // Fetch gigs where the worker is assigned (in_progress or pending_verification)
        const q1 = query(gigsRef, where('assigned_worker_id', '==', user.uid), where('status', '==', 'in_progress'), limit(10));
        const q2 = query(gigsRef, where('assigned_worker_id', '==', user.uid), where('status', '==', 'pending_verification'), limit(10));
        const q3 = query(gigsRef, where('assigned_worker_id', '==', user.uid), where('status', '==', 'completed'), limit(5)); // Show recently completed
        
        const [snap1, snap2, snap3] = await Promise.all([getDocs(q1), getDocs(q2), getDocs(q3)]);
        
        const allGigs = [...snap1.docs, ...snap2.docs, ...snap3.docs].map(d => ({ id: d.id, ...d.data() }));

        // Enhance with client profiles
        const enhancedGigs = await Promise.all(allGigs.map(async (gig: any) => {
          let clientProfile = null;
          try {
            const clientRef = doc(db, 'profiles', gig.client_id);
            const clientSnap = await getDoc(clientRef);
            if (clientSnap.exists()) {
              clientProfile = clientSnap.data();
            }
          } catch (e) {
             // ignore
          }
          return { ...gig, client: clientProfile };
        }));

        setActiveGigs(enhancedGigs);
      } catch (error) {
        console.error("Error fetching worker dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleMarkCompleted = async (gigId: string) => {
    setUpdatingGigId(gigId);
    try {
      await updateDoc(doc(db, 'gigs', gigId), {
        status: 'pending_verification'
      });
      // Optimistically update UI
      setActiveGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'pending_verification' } : g));
    } catch (error) {
      console.error("Error updating gig status:", error);
      alert("Failed to mark job as complete.");
    } finally {
      setUpdatingGigId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const completedCount = activeGigs.filter(g => g.status === 'completed').length + (profile?.completed_jobs || 0);

  const stats = [
    { label: 'Pending Payouts', value: `$${activeGigs.filter(g => g.status === 'pending_verification').reduce((acc, g) => acc + Number(g.budget), 0)}`, icon: <TrendingUp className="w-5 h-5 text-accent" />, color: 'bg-accent/20' },
    { label: 'Active Gigs', value: activeGigs.filter(g => g.status === 'in_progress').length.toString(), icon: <Clock className="w-5 h-5 text-primary" />, color: 'bg-primary/20' },
    { label: 'Completed', value: completedCount.toString(), icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, color: 'bg-emerald-500/20' },
    { label: 'Rating', value: (profile?.rating?.toString() || '5.0'), icon: <History className="w-5 h-5 text-purple-500" />, color: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">

      {/* Chat/Contact Modal Overlay */}
      {chatModalGig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl shadow-2xl relative flex flex-col h-[500px] overflow-hidden">
             
             {/* Modal Header */}
             <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-white/10 flex-shrink-0">
                    {chatModalGig.client?.avatar_url ? (
                      <img src={chatModalGig.client.avatar_url} alt="Client" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 m-2 text-slate-400" />
                    )}
                 </div>
                 <div>
                   <h3 className="text-white font-bold leading-tight">{chatModalGig.client?.full_name || 'Client'}</h3>
                   <p className="text-xs text-primary font-bold">Online</p>
                 </div>
               </div>
               <button onClick={() => setChatModalGig(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Simulated Chat Messages */}
             <div className="flex-1 p-4 overflow-y-auto space-y-4">
               <div className="text-center">
                 <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">Task Started</span>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10 flex-shrink-0">
                    {chatModalGig.client?.avatar_url ? (
                      <img src={chatModalGig.client.avatar_url} alt="Client" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 m-1.5 text-slate-400" />
                    )}
                  </div>
                  <div className="bg-slate-800 text-slate-300 p-3 rounded-2xl rounded-tl-sm text-sm border border-white/5 shadow-md">
                    Hello! Thanks for accepting the task. My address is House 14, Nkulumane 5. When can you arrive?
                  </div>
               </div>
             </div>

             {/* Chat Input */}
             <div className="p-4 border-t border-white/10 bg-slate-900">
               <div className="flex items-center gap-2">
                 <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-950 border border-white/10 rounded-full py-3 px-4 text-sm text-white focus:outline-none focus:border-primary" />
                 <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg">
                   <MessageSquare className="w-5 h-5" />
                 </button>
               </div>
               <p className="text-[10px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
                 <ShieldCheck className="w-3 h-3 text-primary" /> End-to-end encrypted
               </p>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.full_name || user?.email?.split('@')[0]}</h1>
          <p className="text-slate-400">Here's your Elite Youth Work Portal overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/gigs" 
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:scale-105 transition-all text-sm"
          >
            <Briefcase className="w-4 h-4" />
            Find New Gigs
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-lg hover:border-white/10 transition-colors">
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
              <Clock className="w-5 h-5 text-primary" /> My Assignments
            </h2>
          </div>
          
          <div className="space-y-4">
            {activeGigs.filter(g => g.status !== 'completed').length > 0 ? (
              activeGigs.filter(g => g.status !== 'completed').map((gig) => (
                <div key={gig.id} className={`glass p-6 rounded-3xl border ${gig.status === 'completed' ? 'border-emerald-500/20 opacity-70' : 'border-white/5'} hover:border-primary/30 transition-all shadow-md group`}>
                  
                  {/* Avatar Connection UI */}
                  {gig.status !== 'completed' && (
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                         
                         {/* Client Avatar */}
                         <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center z-10 relative shadow-lg">
                               {gig.client?.avatar_url ? (
                                 <img src={gig.client.avatar_url} alt="Client" className="w-full h-full object-cover" />
                               ) : (
                                 <User className="w-6 h-6 text-slate-500" />
                               )}
                            </div>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5 z-20">Client</span>
                         </div>
                         
                         <div className="hidden sm:flex items-center justify-center flex-1 min-w-[50px]">
                           <div className="h-px bg-white/10 w-full relative">
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50 animate-pulse"></div>
                           </div>
                         </div>
                         
                         {/* Worker Avatar (You) */}
                         <div className="relative hidden sm:block">
                            <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-slate-800 flex items-center justify-center z-10 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                               {profile?.avatar_url ? (
                                 <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                               ) : (
                                 <User className="w-6 h-6 text-primary" />
                               )}
                            </div>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded border border-primary/20 z-20">You</span>
                         </div>
                         
                      </div>
                      
                      {/* Connection Actions */}
                      {gig.status === 'in_progress' && (
                        <button 
                          onClick={() => setChatModalGig(gig)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4 text-primary" /> Contact Client
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{gig.title}</h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> {gig.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-accent font-bold">${gig.budget}</span>
                      {gig.status === 'in_progress' && <span className="text-[10px] text-primary uppercase tracking-widest mt-1 font-bold animate-pulse">In Progress</span>}
                      {gig.status === 'pending_verification' && <span className="text-[10px] text-orange-500 uppercase tracking-widest mt-1 font-bold">Waiting on Verification</span>}
                      {gig.status === 'completed' && <span className="text-[10px] text-emerald-500 uppercase tracking-widest mt-1 font-bold">Funds Released</span>}
                    </div>
                  </div>
                  
                  {gig.status === 'in_progress' && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Commitment Lock Active</p>
                            <p className="text-[10px] text-slate-500">Funds secured in escrow</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleMarkCompleted(gig.id)}
                        disabled={updatingGigId === gig.id}
                        className="w-full sm:w-auto px-6 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingGigId === gig.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Mark Job Completed
                      </button>
                    </div>
                  )}

                  {gig.status === 'pending_verification' && (
                    <div className="mt-4 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-center animate-pulse">
                      <p className="text-sm font-bold text-orange-400 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" /> Pending Client Verification
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Once the client verifies, funds will be released to your wallet.</p>
                    </div>
                  )}

                  {gig.status === 'completed' && (
                     <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                       <CheckCircle className="w-5 h-5" /> Task Done & Funds Deposited via EcoCash
                     </div>
                  )}

                </div>
              ))
            ) : (
              <div className="glass p-12 rounded-3xl border border-white/5 text-center shadow-inner">
                <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-50" />
                <p className="text-slate-500 mb-2">You don't have any active assignments.</p>
                <Link href="/gigs" className="text-primary text-sm font-bold mt-2 inline-block hover:underline px-6 py-3 bg-primary/10 rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all">
                  Find your next job
                </Link>
              </div>
            )}
          </div>

          {/* Completed Task History */}
          {activeGigs.filter(g => g.status === 'completed').length > 0 && (
            <div className="mt-10">
              <button
                onClick={() => setHistoryOpen(h => !h)}
                className="flex items-center gap-3 w-full text-left mb-4 group"
              >
                <History className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-white flex-1">Task History</h2>
                <div className={`flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-xs transition-all group-hover:bg-emerald-500/20`}>
                  {activeGigs.filter(g => g.status === 'completed').length} completed
                  <span className={`transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>

              {historyOpen && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  {activeGigs.filter(g => g.status === 'completed').map((gig) => (
                    <div key={gig.id} className="glass p-6 rounded-3xl border border-emerald-500/20 shadow-md bg-emerald-500/5">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Dual Avatars - Preserved */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 overflow-hidden bg-slate-800 flex items-center justify-center">
                              {gig.client?.avatar_url ? (
                                <img src={gig.client.avatar_url} alt="Client" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-slate-500" />
                              )}
                            </div>
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase bg-slate-800 text-slate-500 px-1 rounded">Client</span>
                          </div>
                          <div className="text-emerald-500/40 font-bold text-lg">↔</div>
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden bg-slate-800 flex items-center justify-center">
                              {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase bg-primary text-white px-1 rounded">You</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold truncate">{gig.title}</h3>
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-emerald-500" /> {gig.location}
                          </p>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-emerald-400 font-bold text-lg">${gig.budget}</span>
                          <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mt-0.5">Paid</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <CheckCircle className="w-4 h-4" />
                        Task completed & funds deposited to your EcoCash wallet
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Profile & Notifications */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border-2 border-primary border-t-transparent animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {profile?.avatar_url ? (
                   <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover" alt="Profile" />
                ) : (
                   <User className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            
            <h2 className="text-white font-bold text-lg mb-1">{profile?.full_name || 'Worker'}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 border border-primary/20 bg-primary/10 px-3 py-1 rounded-full">Bulawayo Trusted</p>

            <div className="w-full flex justify-between px-4 py-3 bg-white/5 rounded-2xl border border-white/5 mb-4">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Rating</p>
                <p className="text-base font-bold text-white">{profile?.rating || '5.0'} ★</p>
              </div>
              <div className="w-px h-full bg-white/10"></div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Jobs</p>
                <p className="text-base font-bold text-white">{completedCount}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              "Keep your profile updated with clear pictures to increase client trust!"
            </p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Activity Feed
            </h2>
            <div className="space-y-6">
              {activeGigs.filter(g => g.status === 'completed').length > 0 && (
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-bounce">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs leading-snug">Task Verified! Funds deposited directly to your EcoCash wallet.</p>
                    <p className="text-[10px] text-emerald-500 mt-1 uppercase font-bold tracking-tighter">Success</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-300 text-xs leading-snug">Welcome to the new interactive Dashboard.</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
