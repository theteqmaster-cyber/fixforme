"use client";

import { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  User, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Briefcase, 
  Loader2,
  Settings,
  Shield,
  Camera
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileView() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setLoading(false);
        return;
      }
      try {
        const profileRef = doc(db, 'profiles', authUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploadingAvatar(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Update Firestore
        const profileRef = doc(db, 'profiles', auth.currentUser!.uid);
        await updateDoc(profileRef, {
          avatar_url: base64String
        });

        // Update local state
        setProfile((prev: any) => ({ ...prev, avatar_url: base64String }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update profile picture.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-2xl font-bold">Profile not found.</h1>
        <p className="text-slate-400 mt-2">Please ensure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[3rem] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            {/* Interactive Avatar Container */}
            <div className="relative mb-6 mx-auto w-32 h-32">
              <input 
                type="file" 
                accept="image/*" 
                capture="user" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleAvatarCapture}
              />
              
              <div 
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                className={`w-full h-full rounded-full bg-slate-800 border-4 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl relative cursor-pointer group-hover:border-primary/50 transition-colors ${uploadingAvatar ? 'opacity-50' : ''}`}
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin absolute" />
                ) : (
                  <>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <User className="w-16 h-16 text-slate-500" />
                    )}
                    {/* Camera Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                )}
              </div>
              
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-accent rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg pointer-events-none">
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

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-slate-400 font-medium">
              Tap your profile picture above to take a new photo with your camera.
            </div>
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
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20">
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
