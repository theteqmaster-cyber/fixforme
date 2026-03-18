import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Globe, 
  Zap, 
  Star, 
  Search, 
  Clock, 
  Smartphone,
  Users,
  Briefcase
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] rounded-full bg-primary/5 blur-3xl opacity-50"></div>
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-accent/5 blur-3xl opacity-30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 sm:pt-40 sm:pb-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-10 border border-primary/20 animate-bounce-subtle">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Building Bulawayo's Leading Trust Ecosystem
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl mb-8 leading-[1.1]">
              The Marketplace Where <br />
              <span className="text-primary italic">Trust</span> Meets <span className="text-accent underline decoration-accent/30 underline-offset-8">Talent</span>.
            </h1>
            
            <p className="text-xl leading-relaxed text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              Serv<span className="text-primary italic">u</span> bridges the gap between reliable SMEs and Bulawayo's ambitious youth. 
              We've handled the trust, so you can focus on the growth. No more unverified workers, no more unpaid tasks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/signup?role=worker"
                className="w-full sm:w-auto px-8 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl glow-shadow hover:scale-105 transition-all text-lg group"
              >
                Join as a Worker
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup?role=client"
                className="w-full sm:w-auto px-8 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-lg"
              >
                Post Your First Task
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-slate-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold">Join 120+ active service providers in Bulawayo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust System Showcase */}
      <section className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white leading-tight">
                Why Servu? <br />
                <span className="text-primary italic italic">Secure & Local</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                In Bulawayo, trust is our currency. We've built a revolutionary system tailored for the local economy to ensure every micro-task ends in a win-win.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Commitment Lock", desc: "Funds are secured in escrow before any work begins. No more payment chasing.", color: "text-accent" },
                  { title: "Reputation Banking", desc: "Every task completed adds to your digital CV, verified by local SMEs.", color: "text-primary" },
                  { title: "Skill Matching", desc: "We use smart AI to match your specific talents to the right opportunities.", color: "text-orange-500" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <CheckCircle className={`w-6 h-6 flex-shrink-0 ${item.color}`} />
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="glass p-8 rounded-[3rem] border border-white/5 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full border border-accent/20">ESCROW ACTIVE</span>
                </div>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Escrow Provider</p>
                      <p className="text-white font-black text-xl">LOCKED</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Task Budget</p>
                    <p className="text-accent font-black text-2xl">$45.00</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary animate-pulse"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Task Posted</span>
                    <span>Talent Hired</span>
                    <span className="text-primary font-black italic">Funds Secured</span>
                    <span>Ready to Release</span>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                  <p className="text-xs text-slate-400 italic">"Payment is secured by the Commitment Lock. You can start with 100% confidence."</p>
                </div>
              </div>
              {/* Background Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid & How it Works */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-white mb-6">Designed for Bulawayo's <span className="text-primary italic">Energy</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              We know the struggle of finding work and the fear of hiring strangers. 
              Servu is built to eliminate both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
            {[
              { 
                title: "Offline Sync", 
                desc: "Low on data? The app remembers your work and syncs automatically when you hit a hotspot.", 
                icon: <Globe className="w-6 h-6 text-blue-400" />,
                color: "bg-blue-400/10"
              },
              { 
                title: "Vetted Economy", 
                desc: "We prioritize local IDs and university verifications to keep our community safe.", 
                icon: <Shield className="w-6 h-6 text-green-400" />,
                color: "bg-green-400/10"
              },
              { 
                title: "Reputation Cv", 
                desc: "Build a digital footprint that Bulawayo banks and SMEs actually trust.", 
                icon: <Star className="w-6 h-6 text-yellow-400" />,
                color: "bg-yellow-400/10"
              },
              { 
                title: "Instant Filters", 
                desc: "Search by neighborhood, skill level, or urgency. Find what you need in seconds.", 
                icon: <Search className="w-6 h-6 text-red-400" />,
                color: "bg-red-400/10"
              },
              { 
                title: "Skill Growth", 
                desc: "Get badges for plumbing, coding, or cleaning. Level up your earning potential.", 
                icon: <Zap className="w-6 h-6 text-purple-400" />,
                color: "bg-purple-400/10"
              },
              { 
                title: "Community First", 
                desc: "A platform built by locals, for locals. Every task boosts our city's economy.", 
                icon: <Smartphone className="w-6 h-6 text-accent" />,
                color: "bg-accent/10"
              }
            ].map((f, i) => (
              <div key={i} className="glass p-8 rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-10">How To Get Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: "1", label: "Sign Up", desc: "Choose your role (SME or Talent)" },
                { step: "2", label: "Verify", desc: "Complete your profile & skills" },
                { step: "3", label: "Lock", desc: "Start a task with Secured Funds" },
                { step: "4", label: "Grow", desc: "Get rated & Build your brand" }
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                   <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-white mx-auto shadow-lg">{s.step}</div>
                   <h5 className="text-white font-bold">{s.label}</h5>
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="glass p-12 md:p-24 rounded-[4rem] border border-white/5 bg-slate-900/80 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -ml-48 -mb-48"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
              Ready to Transform <br />
              <span className="text-primary italic">Local Service?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
              Whether you're an SME looking for help or a young talent looking for work, 
              Servu is your home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all text-lg shadow-2xl"
              >
                Create Free Account
              </Link>
              <Link
                href="/gigs"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-lg"
              >
                Browse the Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Reuse some icons if not present in Lucide import above
const User = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
