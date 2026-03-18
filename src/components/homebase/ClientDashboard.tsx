"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, updateDoc, getDoc } from 'firebase/firestore';
import { 
  Plus, 
  CheckCircle, 
  TrendingUp,
  History,
  ShieldCheck,
  User,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  Inbox,
  Check,
  X,
  Star,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard({ user, profile }: { user: any, profile: any }) {
  const [activeGigs, setActiveGigs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatModalGig, setChatModalGig] = useState<any>(null);
  const [verifyingGigId, setVerifyingGigId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch gigs posted by this client
        const gigsRef = collection(db, 'gigs');
        const qGigs = query(gigsRef, where('client_id', '==', user.uid), limit(15));
        const gigsSnapshot = await getDocs(qGigs);
        const fetchedGigs = gigsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

        // Enhance active gigs with worker profiles (if assigned)
        const enhancedGigs = await Promise.all(fetchedGigs.map(async (gig) => {
          let workerProfile = null;
          if (gig.assigned_worker_id) {
            try {
              const workerRef = doc(db, 'profiles', gig.assigned_worker_id);
              const workerSnap = await getDoc(workerRef);
              if (workerSnap.exists()) {
                workerProfile = workerSnap.data();
              }
            } catch (e) {
               // ignore
            }
          }
          return { ...gig, worker: workerProfile };
        }));

        setActiveGigs(enhancedGigs.sort((a,b) => {
          // Sort: pending_verification -> in_progress -> open -> completed
          const order:any = {'pending_verification': 1, 'in_progress': 2, 'open': 3, 'completed': 4};
          return (order[a.status] || 5) - (order[b.status] || 5);
        }));

        // Fetch incoming pending applications
        const appsRef = collection(db, 'applications');
        const qApps = query(appsRef, where('client_id', '==', user.uid), where('status', '==', 'pending'), limit(20));
        const appsSnapshot = await getDocs(qApps);
        
        const fetchedApps = await Promise.all(appsSnapshot.docs.map(async (d) => {
          const appData = d.data();
          let workerProfile = null;
          try {
            const workerRef = doc(db, 'profiles', appData.worker_id);
            const workerSnap = await getDoc(workerRef);
            if (workerSnap.exists()) {
              workerProfile = workerSnap.data();
            }
          } catch (e) {
             // ignore
          }
          return { id: d.id, ...appData, worker: workerProfile };
        }));

        setApplications(fetchedApps);
      } catch (error) {
        console.error("Error fetching client dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleApplication = async (appId: string, gigId: string, action: 'accepted' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: action });

      if (action === 'accepted') {
        const app = applications.find(a => a.id === appId);
        await updateDoc(doc(db, 'gigs', gigId), {
          status: 'in_progress',
          assigned_worker_id: app?.worker_id
        });
        
        setActiveGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'in_progress', worker: app?.worker } : g));
      }

      setApplications(prev => prev.filter(app => app.id !== appId));
    } catch (error) {
      console.error(`Error handling application:`, error);
      alert(`Failed to ${action} application.`);
    }
  };

  const verifyAndReleaseFunds = async (gigId: string) => {
    setVerifyingGigId(gigId);
    try {
      await updateDoc(doc(db, 'gigs', gigId), {
        status: 'completed'
      });
      setActiveGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'completed' } : g));
    } catch (error) {
       console.error("Error verifying gig:", error);
       alert("Failed to verify task.");
    } finally {
       setVerifyingGigId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  const activePostings = activeGigs.filter(g => g.status !== 'completed');
  const completedGigs = activeGigs.filter(g => g.status === 'completed');
  const totalBudgetSpent = activeGigs.reduce((sum, gig) => sum + (Number(gig.budget) || 0), 0);
  const pendingVerificationCount = activeGigs.filter(g => g.status === 'pending_verification').length;

  const stats = [
    { label: 'Total Budget Managed', value: `$${totalBudgetSpent}`, icon: <TrendingUp className="w-5 h-5 text-accent" />, color: 'bg-accent/20' },
    { label: 'Active Postings', value: activePostings.length.toString(), icon: <Briefcase className="w-5 h-5 text-primary" />, color: 'bg-primary/20' },
    { label: 'Tasks Verified', value: completedGigs.length.toString(), icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, color: 'bg-emerald-500/20' },
    { label: 'Client Rating', value: (profile?.rating?.toString() || '5.0'), icon: <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />, color: 'bg-yellow-500/20' },
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
                    {chatModalGig.worker?.avatar_url ? (
                      <img src={chatModalGig.worker.avatar_url} alt="Worker" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 m-2 text-slate-400" />
                    )}
                 </div>
                 <div>
                   <h3 className="text-white font-bold leading-tight">{chatModalGig.worker?.full_name || 'Worker'}</h3>
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
                 <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">You hired {chatModalGig.worker?.full_name?.split(' ')[0] || 'them'}!</span>
               </div>
               <div className="flex flex-col gap-1 items-end">
                  <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-md">
                    Hello! Thanks for accepting the task. My address is House 14, Nkulumane 5. When can you arrive?
                  </div>
                  <span className="text-[10px] text-slate-500 mr-2">Sent</span>
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
          <p className="text-slate-400">Here's your SME Client Portal overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/post-gig" 
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105 transition-all text-sm"
          >
            <Plus className="w-5 h-5" />
            Post New Task
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-full blur-3xl -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center relative z-10 border border-white/5`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-white tracking-tight mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Applications Inbox Section */}
          <div className="glass p-8 rounded-[2.5rem] border border-accent/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-orange-500 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent">
                    <Inbox className="w-5 h-5" /> 
                  </div>
                  Incoming Applications
                </h2>
                <p className="text-slate-400 text-sm mt-1">Review workers who want to complete your tasks.</p>
              </div>
              {applications.length > 0 && (
                <span className="px-3 py-1 bg-accent border border-accent/50 text-white text-xs font-bold rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)] animate-pulse">
                  {applications.length} New
                </span>
              )}
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="p-6 bg-slate-900/80 rounded-3xl border border-white/5 hover:border-accent/30 transition-all shadow-md group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      
                      {/* Applicant Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {app.worker?.avatar_url ? (
                            <img src={app.worker.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Applying for: <span className="text-accent">{app.gig_title}</span></p>
                          <h4 className="text-white font-bold text-lg leading-tight mb-1">{app.worker?.full_name || 'Verified Worker'}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {app.worker?.rating || '5.0'}</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> {app.worker?.completed_jobs || 0} Tasks</span>
                          </div>
                          
                          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-slate-300 italic">
                            "{app.message}"
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row md:flex-col gap-3 justify-end flex-shrink-0 border-t border-white/5 pt-4 md:border-t-0 md:pt-0 md:pl-6 md:border-l">
                        <button 
                          onClick={() => handleApplication(app.id, app.gig_id, 'accepted')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-500 font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-sm group/btn border border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        >
                          <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Accept
                        </button>
                        <button 
                          onClick={() => handleApplication(app.id, app.gig_id, 'rejected')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm group/btn border border-red-500/20"
                        >
                          <X className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center rounded-3xl border border-white/5 border-dashed bg-white/[0.02]">
                  <User className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 font-medium">No pending applications right now.</p>
                  <p className="text-slate-500 text-sm mt-1">When workers apply for your tasks, they will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Postings Overview */}
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-primary" /> Your Active Postings
            </h2>
            <div className="space-y-4">
              {activeGigs.filter(g => g.status !== 'completed').length > 0 ? (
                activeGigs.filter(g => g.status !== 'completed').map((gig) => (
                  <div key={gig.id} className={`glass p-6 rounded-3xl border ${gig.status === 'pending_verification' ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : gig.status==='completed' ? 'border-emerald-500/30 opacity-70' : 'border-white/5'} transition-all shadow-md group`}>
                    
                    {/* Dual Avatar Connect UI for active jobs */}
                    {gig.assigned_worker_id && gig.status !== 'completed' && (
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                           {/* Client Avatar (You) */}
                           <div className="relative hidden sm:block">
                              <div className="w-12 h-12 rounded-full border-2 border-accent overflow-hidden bg-slate-800 flex items-center justify-center z-10 relative">
                                 {profile?.avatar_url ? (
                                   <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                                 ) : (
                                   <User className="w-6 h-6 text-accent" />
                                 )}
                              </div>
                              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-accent text-white px-2 py-0.5 rounded border border-accent/20 z-20">You</span>
                           </div>
                           
                           <div className="hidden sm:flex items-center justify-center flex-1 min-w-[50px]">
                             <div className="h-px bg-white/10 w-full relative">
                               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/50 animate-pulse"></div>
                             </div>
                           </div>
                           
                           {/* Worker Avatar */}
                           <div className="relative">
                              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-slate-800 flex items-center justify-center z-10 relative shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                 {gig.worker?.avatar_url ? (
                                   <img src={gig.worker.avatar_url} alt="Worker" className="w-full h-full object-cover" />
                                 ) : (
                                   <User className="w-6 h-6 text-slate-500" />
                                 )}
                              </div>
                              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5 z-20">Worker</span>
                           </div>
                        </div>
                        
                        {/* Connection Actions */}
                        {gig.status !== 'completed' && (
                          <button 
                            onClick={() => setChatModalGig(gig)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4 text-accent" /> Contact Worker
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
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-bold 
                          ${gig.status === 'open' ? 'text-blue-400' : 
                            gig.status === 'in_progress' ? 'text-primary animate-pulse' : 
                            gig.status === 'pending_verification' ? 'text-orange-500' : 
                            'text-emerald-500'}`}>
                          {gig.status === 'in_progress' ? "Worker Assigned" : gig.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Verification Action */}
                    {gig.status === 'pending_verification' && (
                       <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
                         <div className="flex-1 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                           <p className="text-sm font-bold text-orange-400 flex items-center gap-2">
                             <Clock className="w-4 h-4" /> Action Required!
                           </p>
                           <p className="text-xs text-slate-300 mt-1">The worker marked this job as completed. Verify the work to release funds.</p>
                         </div>
                         <button 
                           onClick={() => verifyAndReleaseFunds(gig.id)}
                           disabled={verifyingGigId === gig.id}
                           className="w-full sm:w-auto px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                         >
                           {verifyingGigId === gig.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                           Verify & Release Funds
                         </button>
                       </div>
                    )}
                    
                    {/* Completion Badge */}
                    {gig.status === 'completed' && (
                       <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                         <CheckCircle className="w-5 h-5" /> Task Done & Funds Released to Worker's EcoCash
                       </div>
                    )}

                    {/* Standard Lock Status (Open / In Progress) */}
                    {(gig.status === 'open' || gig.status === 'in_progress') && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Commitment Lock</p>
                            <p className="text-[10px] text-slate-500">Secured in escrow</p>
                          </div>
                        </div>
                        <Link href={`/gigs/${gig.id}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Manage Task</Link>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <div className="glass p-12 rounded-3xl border border-white/5 text-center shadow-inner">
                  <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-500">You haven't posted any tasks.</p>
                  <Link href="/post-gig" className="text-accent text-sm font-bold mt-2 inline-block hover:underline">
                    Post your first gig today
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Completed Task History */}
          {activeGigs.filter(g => g.status === 'completed').length > 0 && (
            <div>
              <button
                onClick={() => setHistoryOpen(h => !h)}
                className="flex items-center gap-3 w-full text-left mb-4 group"
              >
                <History className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-white flex-1">Completed Task History</h2>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-xs group-hover:bg-emerald-500/20 transition-all">
                  {activeGigs.filter(g => g.status === 'completed').length} tasks done
                  <span className={`transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>

              {historyOpen && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  {activeGigs.filter(g => g.status === 'completed').map((gig) => (
                    <div key={gig.id} className="glass p-6 rounded-3xl border border-emerald-500/20 shadow-md bg-emerald-500/5">
                      
                      {/* Dual Avatars - Preserved */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full border-2 border-accent/40 overflow-hidden bg-slate-800 flex items-center justify-center">
                            {profile?.avatar_url ? (
                              <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase bg-accent text-white px-1 rounded">You</span>
                        </div>
                        <div className="text-emerald-500/40 font-bold text-lg">→</div>
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full border-2 border-primary/40 overflow-hidden bg-slate-800 flex items-center justify-center">
                            {gig.worker?.avatar_url ? (
                              <img src={gig.worker.avatar_url} alt="Worker" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase bg-slate-800 text-slate-400 px-1 rounded">Worker</span>
                        </div>

                        <div className="flex-1 min-w-0 ml-2">
                          <h3 className="text-white font-bold truncate">{gig.title}</h3>
                          <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {gig.location} &bull; ${gig.budget} released
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex-shrink-0">
                          <CheckCircle className="w-3.5 h-3.5" /> Done
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-2 bg-white/5 rounded-xl p-3 border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        Funds released to worker's EcoCash wallet upon your verification.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-lg font-bold text-white mb-6">Client Standing</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-accent border-r-transparent animate-spin-slow flex items-center justify-center relative">
                 <div className="absolute inset-0 m-1 rounded-full border-2 border-white/10"></div>
                 <Star className="w-5 h-5 text-accent animate-pulse" fill="currentColor" />
              </div>
              <div>
                <p className="text-white font-bold">Verified SME</p>
                <p className="text-accent text-[10px] font-black uppercase tracking-wider">Top Tier Client</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed border-t border-white/5 pt-4">
              "Your prompt payments and clear communication ensure you attract the best talent on Servu."
            </p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Notifications
            </h2>
            <div className="space-y-6">
              
              {pendingVerificationCount > 0 && (
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 animate-pulse border border-orange-500/30">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs leading-snug">Worker marked a job as done. Please verify to release funds.</p>
                    <p className="text-[10px] text-orange-500 mt-1 uppercase font-bold tracking-tighter">Action Required</p>
                  </div>
                </div>
              )}

              {applications.length > 0 && (
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-pulse border border-emerald-500/30">
                    <Inbox className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs leading-snug">You have {applications.length} pending applications.</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">New</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 border border-accent/30">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-slate-300 text-xs leading-snug">Client portal features escrow security via EcoCash.</p>
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
