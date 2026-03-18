"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  AlignLeft, 
  Search, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PostGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    category: 'Plumbing',
  });

  const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Welding', 'IT Support', 'Cleaning', 'Gardening'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth.currentUser) {
        alert("Please log in to post a gig");
        router.push('/login');
        return;
      }

      await addDoc(collection(db, 'gigs'), {
        ...formData,
        client_id: auth.currentUser.uid,
        status: 'open',
        created_at: serverTimestamp(),
      });

      setStep(3); // Success step
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-primary text-white shadow-lg glow-shadow' : 'bg-white/5 text-slate-500 border border-white/10'
            }`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && <div className={`w-20 h-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-white/5'}`}></div>}
          </div>
        ))}
      </div>

      <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-white mb-2">Task <span className="text-primary italic">Details</span></h2>
            <p className="text-slate-400 mb-10">Describe the job you need completed.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Gig Category</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                        formData.category === cat 
                        ? 'bg-primary text-white shadow-inner' 
                        : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. Fix burst pipe in Nkulumane"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-6 w-5 h-5 text-slate-500" />
                  <textarea 
                    placeholder="Provide details about the task, requirements, and any tools provided..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary transition-all group mt-8 shadow-xl"
              >
                Next: Budget & Location
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-white mb-2">Final <span className="text-primary italic">Steps</span></h2>
            <p className="text-slate-400 mb-10">Set your budget and task location.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 text-accent">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    <input 
                      type="text" 
                      placeholder="e.g. 15"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Nkulumane 5"
                      disabled
                      value="Bulawayo (Default)"
                      className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Commitment Lock Ready</h4>
                  <p className="text-slate-500 text-xs">Funds will be secured. Your task will be visible to Bulawayo's top talent once posted.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all font-bold"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-2xl glow-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Post Gig Now'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl glow-shadow">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Gig Posted!</h2>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto">
              Your task is now live. Bulawayo's verified youth can now see and apply for your gig.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard" 
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl glow-shadow hover:scale-105 transition-all"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={() => {setStep(1); setFormData({title:'', description:'', budget:'', location:'', category:'Plumbing'})}}
                className="w-full py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:text-white transition-all"
              >
                Post another task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
