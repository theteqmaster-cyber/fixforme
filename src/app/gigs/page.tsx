"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function GigsPage() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Welding', 'IT Support'];

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const gigsRef = collection(db, 'gigs');
        let q = query(gigsRef, where('status', '==', 'open'), orderBy('created_at', 'desc'));

        if (selectedCategory !== 'All') {
          q = query(gigsRef, where('status', '==', 'open'), where('category', '==', selectedCategory), orderBy('created_at', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const fetchedGigs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Client side filtering for search term as Firestore ilike is limited
        const filtered = searchTerm 
          ? fetchedGigs.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()))
          : fetchedGigs;

        setGigs(filtered);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchGigs();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header & Search */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">Browse Available <span className="text-primary italic">Gigs</span></h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg glow-shadow' 
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.length > 0 ? (
            gigs.map(gig => (
              <div key={gig.id} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-wider">
                    {gig.category}
                  </span>
                  <span className="text-accent font-bold text-xl">{gig.budget}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {gig.title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {gig.description}
                </p>

                <div className="space-y-3 mb-8 mt-auto">
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    {gig.location}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Verified Client Task
                  </div>
                </div>

                <Link 
                  href={`/gigs/${gig.id}`}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all group-hover:shadow-xl group-hover:glow-shadow"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 glass rounded-3xl border border-white/5">
              <p className="text-slate-500 text-lg">No gigs found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="text-primary font-bold mt-2 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* CTA for SMEs */}
      <div className="mt-20 glass p-10 md:p-16 rounded-[3rem] text-center border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <h2 className="text-4xl font-bold text-white mb-4 relative z-10">Searching for Talent?</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10 text-lg leading-relaxed">
          Post your task and connect with Bulawayo's verified youth. Our <span className="text-white font-semibold italic">Commitment Lock</span> system ensures quality work and guaranteed payment.
        </p>
        <Link 
          href="/post-gig" 
          className="inline-flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent/90 text-white font-black rounded-2xl shadow-2xl transition-all relative z-10 hover:scale-105 active:scale-95"
        >
          Post a Gig Now
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
