"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowRight, Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function GigsView() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Welding', 'IT Support', 'Gardening'];

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const gigsRef = collection(db, 'gigs');
        let q;
        if (selectedCategory !== 'All') {
          q = query(gigsRef, where('status', '==', 'open'), where('category', '==', selectedCategory), limit(50));
        } else {
          q = query(gigsRef, where('status', '==', 'open'), limit(50));
        }

        const querySnapshot = await getDocs(q);
        const fetchedGigs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];

        const filtered = searchTerm 
          ? fetchedGigs.filter(g => 
              g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              g.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : fetchedGigs;

        setGigs(filtered);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGigs();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-6 tracking-tight">Browse <span className="text-primary italic">Opportunities</span></h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl backdrop-blur-md"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm ${
                  selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg glow-shadow scale-105' 
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 animate-pulse h-80 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-4 bg-white/10 rounded-full"></div>
                <div className="w-12 h-6 bg-white/10 rounded-lg"></div>
              </div>
              <div className="w-3/4 h-6 bg-white/10 rounded-lg mb-4"></div>
              <div className="w-full h-4 bg-white/5 rounded-lg mb-2"></div>
              <div className="w-5/6 h-4 bg-white/5 rounded-lg mb-6"></div>
              <div className="mt-auto space-y-3">
                <div className="w-1/2 h-4 bg-white/5 rounded-lg"></div>
                <div className="w-full h-12 bg-white/10 rounded-2xl"></div>
              </div>
            </div>
          ))
        ) : gigs.length > 0 ? (
          gigs.map(gig => (
            <div key={gig.id} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary/20 p-2 rounded-full backdrop-blur-md">
                   <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase tracking-widest">
                  {gig.category || 'General'}
                </span>
                <span className="text-accent font-black text-2xl">${gig.budget}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {gig.title}
              </h3>
              
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                {gig.description}
              </p>

              {gig.images && gig.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {gig.images.map((img: string, idx: number) => (
                    <div key={idx} className="h-20 rounded-xl bg-slate-800 overflow-hidden border border-white/5">
                      <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-8 mt-auto">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight">
                  <MapPin className="w-4 h-4 text-primary" />
                  {gig.location}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-tight">
                  <Star className="w-4 h-4 text-accent fill-accent/20" />
                  Verified Commitment Lock
                </div>
              </div>

              <Link 
                href={`/gigs/${gig.id}`}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all group-hover:bg-primary transition-colors text-sm"
              >
                Apply for this Gig
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-32 glass rounded-3xl border border-white/5">
            <Briefcase className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-30" />
            <p className="text-slate-500 text-xl font-bold">No gigs found yet.</p>
            <p className="text-slate-600 text-sm mb-8 mt-2">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="px-8 py-3 bg-white/5 text-primary text-sm font-black rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all uppercase tracking-widest"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
