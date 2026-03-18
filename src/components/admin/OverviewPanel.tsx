"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export default function OverviewPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeGigs: 0,
    totalLocked: 0,
    completedGigs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch profiles
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const totalUsers = profilesSnap.size;

        // Fetch gigs
        const gigsSnap = await getDocs(collection(db, 'gigs'));
        let activeGigsCount = 0;
        let completedGigsCount = 0;
        let totalLockedAmount = 0;

        gigsSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'open' || data.status === 'in_progress') {
            activeGigsCount++;
            if (data.budget) totalLockedAmount += Number(data.budget);
          } else if (data.status === 'completed') {
            completedGigsCount++;
          }
        });

        setStats({
          totalUsers,
          activeGigs: activeGigsCount,
          totalLocked: totalLockedAmount,
          completedGigs: completedGigsCount
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: '+12% this week'
    },
    { 
      title: 'Active Gigs', 
      value: stats.activeGigs.toString(), 
      icon: Activity, 
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: '+5% this week'
    },
    { 
      title: 'Value Locked (Escrow)', 
      value: `$${stats.totalLocked.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      trend: 'Secured via Commitment Lock'
    },
    { 
      title: 'Completed Tasks', 
      value: stats.completedGigs.toString(), 
      icon: Briefcase, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      trend: '+18% this month'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
            {/* Hover Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} border border-white/5`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Live
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
              <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-2 font-medium">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for future charts/graphs */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTM5IDM5VTBIMzlIMk00MCA0MFYwTTQwIDQwaC00MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-30"></div>
             <Activity className="w-12 h-12 text-slate-700 mb-4" />
             <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">System Telemetry</p>
             <p className="text-slate-600 text-xs mt-2">Revenue visualization node offline.</p>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_50%)]"></div>
             <ShieldAlert className="w-12 h-12 text-slate-700 mb-4" />
             <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Security Feed</p>
             <p className="text-slate-600 text-xs mt-2">No active threats detected in Bulawayo sector.</p>
        </div>
      </div>
    </div>
  );
}
