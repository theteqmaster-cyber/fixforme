"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import ClientDashboard from '@/components/homebase/ClientDashboard';
import WorkerDashboard from '@/components/homebase/WorkerDashboard';

export default function DashboardView() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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
        const profileRef = doc(db, 'profiles', authUser.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const role = profile?.role || 'worker';

  if (role === 'client' || role === 'admin') {
    return <ClientDashboard user={user} profile={profile} />;
  }

  return <WorkerDashboard user={user} profile={profile} />;
}
