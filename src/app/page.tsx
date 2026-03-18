import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Globe, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
                Hackathon 2026 Preview
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Empowering Bulawayo’s <span className="text-primary tracking-tighter">Future</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Serv<span className="text-primary italic">u</span> bridges the trust gap between SMEs and Youth. 
            Micro-tasks with guaranteed payments through our innovative <span className="text-white font-medium italic underline decoration-primary/50">Commitment Lock</span> system.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/signup?role=worker"
              className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg glow-shadow hover:bg-primary/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get Started as Youth
            </Link>
            <Link href="/signup?role=client" className="text-sm font-semibold leading-6 text-white flex items-center gap-2 group">
              Hire Talent <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-2xl bg-slate-900/50 p-2 ring-1 ring-inset ring-white/10 glass">
              <div className="rounded-xl bg-slate-900 p-8 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Shield className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Reliable & Secure</h3>
                    <p className="text-slate-400 text-sm">Escrow-backed micro-payments.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Globe className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Offline Ready</h3>
                    <p className="text-slate-400 text-sm">Always available, even without data.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Zap className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Smart Filtering</h3>
                    <p className="text-slate-400 text-sm">Gigs matched to your specific skills.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "For Youth", desc: "Build a digital reputation and get paid for your skills.", icon: <CheckCircle className="w-5 h-5" /> },
            { title: "For SMEs", desc: "Find vetted talent for quick tasks with zero risk.", icon: <CheckCircle className="w-5 h-5" /> },
            { title: "For Bulawayo", desc: "A homegrown solution for our local economy.", icon: <CheckCircle className="w-5 h-5" /> }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
              <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
