"use client";

import { useEffect, useState, use } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  User, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Clock,
  Loader2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function GigDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [gig, setGig] = useState<any>(null);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    async function fetchGigDetails() {
      try {
        const gigRef = doc(db, 'gigs', id);
        const gigSnap = await getDoc(gigRef);
        
        if (gigSnap.exists()) {
          const gigData = gigSnap.data();
          setGig({ id: gigSnap.id, ...gigData } as any);
          
          // Fetch client profile
          const clientRef = doc(db, 'profiles', gigData.client_id);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            setClientProfile(clientSnap.data());
          }
        }
      } catch (error) {
        console.error("Error fetching gig details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGigDetails();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    const user = auth.currentUser;
    
    if (!user) {
      alert("Please log in to apply!");
      setApplying(false);
      return;
    }

    try {
      await addDoc(collection(db, 'applications'), {
        gig_id: id,
        gig_title: gig.title,
        client_id: gig.client_id,
        worker_id: user.uid,
        status: 'pending',
        message: "I am interested in this task and have the relevant skills.",
        created_at: serverTimestamp()
      });
      setApplied(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-white font-bold">Gig not found.</h1>
        <Link href="/gigs" className="text-primary mt-4 inline-block hover:underline">Return to Browse</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/gigs" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group w-fit">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                {gig.category}
              </span>
              <span className="text-3xl font-bold text-accent">${gig.budget}</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{gig.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-8 border-b border-white/5 pb-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> {gig.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Posted {gig.created_at?.toDate().toDateString() || 'Recently'}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> Status: <span className="text-accent font-semibold capitalize">{gig.status}</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Task Description
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </p>

              {gig.images && gig.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {gig.images.map((img: string, idx: number) => (
                    <div key={idx} className="h-48 rounded-2xl bg-slate-800 overflow-hidden border border-white/5">
                      <img src={img} alt={`Reference ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commitment Lock Info */}
            <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Commitment Lock Active</h3>
                <p className="text-slate-400 text-sm">
                  Funds for this task are secured in escrow. Payment is automatically released only when both parties mark the task as complete.
                </p>
              </div>
            </div>
          </div>

          {!applied ? (
            <button
              onClick={handleApply}
              disabled={applying || gig.status !== 'open'}
              className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-xl glow-shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {applying ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Apply for this Gig
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-5 bg-accent/20 border border-accent/30 text-accent font-bold rounded-2xl flex items-center justify-center gap-3 animate-pulse">
              <CheckCircle2 className="w-6 h-6" />
              Application Sent!
            </div>
          )}
        </div>

        {/* Client Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> About the Client
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                {clientProfile?.avatar_url ? (
                  <img src={clientProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-white font-bold">{clientProfile?.full_name || 'Verified SME'}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <span className="text-xs font-bold">{clientProfile?.rating || '5.0'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Jobs Completed</span>
                <span className="text-white font-medium">{clientProfile?.completed_jobs || 12}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Member Since</span>
                <span className="text-white font-medium">Jan 2026</span>
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Message Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
