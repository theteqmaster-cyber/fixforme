"use client";

import { useEffect, useState, use } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  User, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  ArrowLeft,
  Loader2,
  Settings,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        const profileRef = doc(db, 'profiles', profileId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setProfile(profileData);
          if (authUser && authUser.uid === profileId) {
            setIsOwnProfile(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-2xl font-bold">Profile not found.</h1>
        <Link href="/gigs" className="text-primary mt-4 inline-block hover:underline">Back to Gigs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group w-fit">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[3rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-white/5 mx-auto flex items-center justify-center overflow-hidden shadow-2xl">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-500" />
                )}
              </div>
              <div className="absolute bottom-2 right-1/2 translate-x-12 w-8 h-8 bg-accent rounded-full border-4 border-slate-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">{profile.full_name || `@${profile.username}`}</h1>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
              {profile.role === 'worker' ? 'Verified Youth' : 'SME Client'}
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-white font-bold text-xl">{profile.rating || '5.0'}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Rating</p>
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <div className="text-center">
                <p className="text-white font-bold text-xl">{profile.completed_jobs || '0'}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Tasks</p>
              </div>
            </div>

            {isOwnProfile && (
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-sm">
                <Settings className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
               <MapPin className="w-4 h-4 text-primary" /> Location
            </h3>
            <p className="text-slate-300 text-sm font-medium">{profile.location || 'Bulawayo, Zimbabwe'}</p>
          </div>
        </div>

        {/* Right: Detailed Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">About</h2>
            <p className="text-slate-400 leading-relaxed mb-12">
              {profile.bio || "No biography provided yet. This user is a verified member of the Servu community in Bulawayo."}
            </p>

            {profile.role === 'worker' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(profile.skills || ['General Labor', 'Task Management']).map((skill: string) => (
                    <span key={skill} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">Recent Activity</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Task Completed Successfully</h4>
                  <p className="text-slate-400 text-sm mb-2">Fixed main water line for commercial SME.</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">2 weeks ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Joined Servu Community</h4>
                  <p className="text-slate-400 text-sm mb-2">Account verified and reputation tracking started.</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">1 month ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
