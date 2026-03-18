"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  AlignLeft, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Camera,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function PostGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSimulatingEcoCash, setIsSimulatingEcoCash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    category: 'Plumbing',
    images: [] as string[] // Base64 strings
  });

  const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Welding', 'IT Support', 'Cleaning', 'Gardening'];

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.images.length >= 2) {
      alert("You can only attach a maximum of 2 photos.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, base64String]
      }));
    };
    reader.readAsDataURL(file);
    
    // Reset file input so same file can be captured again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.budget) {
      alert("Please fill in required fields.");
      return;
    }
    // Launch EcoCash USSD Simulation
    setIsSimulatingEcoCash(true);
    processEcoCashPayment();
  };

  const processEcoCashPayment = async () => {
    setLoading(true);
    
    // Simulate USSD wait time (7 seconds)
    await new Promise(resolve => setTimeout(resolve, 7000));

    try {
      if (!auth.currentUser) {
        alert("Please log in to post a gig");
        router.push('/login');
        return;
      }

      await addDoc(collection(db, 'gigs'), {
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        location: 'Bulawayo (Default)',
        category: formData.category,
        images: formData.images,
        client_id: auth.currentUser.uid,
        status: 'open',
        created_at: serverTimestamp(),
      });

      setIsSimulatingEcoCash(false);
      setStep(3); // Success step
    } catch (error: any) {
      alert(error.message);
      setIsSimulatingEcoCash(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 px-4 relative z-10">
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

        {/* EcoCash 7-Second USSD Modal Overlay */}
        {isSimulatingEcoCash && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-sm w-full bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-pulse"></div>
              
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <SpinnerOverlay />
                <Smartphone className="w-8 h-8 text-blue-500 relative z-10 animate-pulse" />
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Check Your Phone</h3>
              <p className="text-slate-400 text-sm mb-6">
                Waiting for EcoCash USSD confirmation to lock <strong className="text-green-400">${formData.budget}</strong> in secure escrow...
              </p>

              <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm bg-primary/10 py-3 rounded-xl border border-primary/20">
                <Loader2 className="w-4 h-4 animate-spin" /> Do not close this page
              </div>
            </div>
          </div>
        )}

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
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text appearance-none"
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
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none cursor-text appearance-none"
                  ></textarea>
                </div>
              </div>

              {/* Camera Integration Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">
                    Photo Evidence (Optional)
                  </label>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-white/5">
                    {formData.images.length} / 2
                  </span>
                </div>
                
                <div className="flex gap-4 items-stretch">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageCapture}
                  />
                  
                  {formData.images.length < 2 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 flex flex-col items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border-2 border-dashed border-primary/30 rounded-2xl text-primary transition-all group shrink-0"
                    >
                      <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Take Photo</span>
                    </button>
                  )}

                  <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide py-1">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0 snap-center group">
                        <img src={img} alt={`Capture ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary transition-all group mt-8 shadow-xl"
              >
                Next: Budget & Security
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-white mb-2">Final <span className="text-primary italic">Steps</span></h2>
            <p className="text-slate-400 mb-10">Set your budget and task location.</p>
            
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 text-accent">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    <input 
                      type="number" 
                      placeholder="e.g. 15"
                      required
                      min="1"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-bold cursor-text appearance-none"
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
                  <h4 className="text-white font-bold mb-1 tracking-tight">Escrow Security</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Once you post, we will lock your funds securely via EcoCash USSD. They will only be released when you are 100% satisfied the task is complete.
                  </p>
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
                  className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-2xl glow-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Lock Funds & Post Gig
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl glow-shadow relative">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
              <CheckCircle2 className="w-12 h-12 text-primary relative z-10" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Secured & Posted!</h2>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto">
              Your funds are safely locked in escrow. Bulawayo's verified youth can now see and apply for your task.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard" 
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl glow-shadow hover:scale-105 transition-all"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={() => {setStep(1); setFormData({title:'', description:'', budget:'', location:'', category:'Plumbing', images: []})}}
                className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:text-white transition-all"
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

const SpinnerOverlay = () => (
   <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
);
