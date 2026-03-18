"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Briefcase, Search, Loader2, AlertTriangle, Check, X } from 'lucide-react';

export default function GigsManager() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'gigs'));
      const gigsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGigs(gigsData);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGigStatus = async (gigId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to forcibly mark this gig as ${newStatus}?`)) return;
    
    try {
      await updateDoc(doc(db, 'gigs', gigId), {
        status: newStatus
      });
      // Optimistic update
      setGigs(gigs.map(g => g.id === gigId ? { ...g, status: newStatus } : g));
    } catch (error) {
      console.error("Error updating gig status:", error);
      alert("Failed to update gig status.");
    }
  };

  const filteredGigs = gigs.filter(g => 
    (g.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 border border-orange-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gig Moderation</h2>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/30 text-slate-400 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4 font-bold">Task ID & Title</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Budget</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Force Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredGigs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No tasks found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredGigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                     <p className="text-white font-bold text-sm tracking-tight truncate max-w-xs">{gig.title}</p>
                     <p className="text-slate-500 text-xs font-mono">{gig.id.substring(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-xs font-semibold">{gig.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-bold text-sm">${gig.budget}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      gig.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      gig.status === 'in_progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      gig.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {gig.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {gig.status !== 'completed' && gig.status !== 'cancelled' && (
                        <button 
                          onClick={() => updateGigStatus(gig.id, 'cancelled')}
                          title="Force Cancel"
                          className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {gig.status === 'in_progress' && (
                        <button 
                          onClick={() => updateGigStatus(gig.id, 'completed')}
                          title="Force Complete (Release Funds)"
                          className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {['open', 'completed', 'cancelled'].includes(gig.status) && (
                         <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Restricted</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
