'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────
   Tiny hook – tracks which slide is in view
───────────────────────────────────────── */
function useActiveSlide(total: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const idx = Math.round(window.scrollY / vh);
      setActive(Math.min(idx, total - 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [total]);
  return active;
}

/* ─────────────────────────────────────────
   Slide wrapper – full-viewport sticky snap
───────────────────────────────────────── */
function Slide({
  id,
  children,
  bg = 'bg-[#0F172A]',
}: {
  id: string;
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <section
      id={id}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden ${bg}`}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────
   Animated particle background blobs
───────────────────────────────────────── */
function Blobs({ color1 = '#3B82F6', color2 = '#10B981' }: { color1?: string; color2?: string }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-blob"
        style={{ background: color1 }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-blob animation-delay-2000"
        style={{ background: color2 }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 animate-blob animation-delay-4000"
        style={{ background: color1 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Slide number badge
───────────────────────────────────────── */
function SlideNumber({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-sm">
        {n}
      </span>
      <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const SLIDES = 9;

export default function PitchPage() {
  const active = useActiveSlide(SLIDES);

  const scrollTo = (i: number) =>
    window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });

  return (
    <>
      {/* ── Injected animation styles ── */}
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.1); }
          66%      { transform: translate(-20px,30px) scale(0.9); }
        }
        .animate-blob { animation: blob 10s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(40px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay:.1s; opacity:0; }
        .delay-200 { animation-delay:.2s; opacity:0; }
        .delay-300 { animation-delay:.3s; opacity:0; }
        .delay-400 { animation-delay:.4s; opacity:0; }
        .delay-500 { animation-delay:.5s; opacity:0; }
        .delay-600 { animation-delay:.6s; opacity:0; }
        .delay-700 { animation-delay:.7s; opacity:0; }

        @keyframes shimmer {
          0%   { background-position: -400% 0; }
          100% { background-position:  400% 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #3B82F6 0%, #10B981 25%, #BAE6FD 50%, #3B82F6 75%, #10B981 100%);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }

        @keyframes pulse-ring {
          0%   { transform:scale(1);   opacity:.8; }
          100% { transform:scale(1.5); opacity:0; }
        }
        .pulse-ring { animation: pulse-ring 1.8s ease-out infinite; }

        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-12px); }
        }
        .float { animation: float 3s ease-in-out infinite; }

        @keyframes spin-slow {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        .spin-slow { animation: spin-slow 20s linear infinite; }

        /* nav dot */
        .nav-dot { transition: all .3s ease; }
        .nav-dot.active { background:#3B82F6; transform:scaleY(2.5); }

        /* glowing card */
        .glow-card {
          transition: box-shadow .3s, transform .3s;
        }
        .glow-card:hover {
          box-shadow: 0 0 30px rgba(59,130,246,.3);
          transform: translateY(-4px);
        }

        /* big CTA button */
        @keyframes cta-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,.6); }
          50%      { box-shadow: 0 0 0 20px rgba(59,130,246,0); }
        }
        .cta-btn { animation: cta-pulse 2s ease-out infinite; }

        /* grid background */
        .grid-bg {
          background-image:
            linear-gradient(rgba(59,130,246,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>

      {/* ── Side nav dots ── */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 items-center">
        {Array.from({ length: SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`nav-dot w-2 h-6 rounded-full bg-white/20 ${active === i ? 'active' : ''}`}
          />
        ))}
      </nav>

      {/* ══════════════════════════════════════
          SLIDE 1 – Title / Group Intro
      ════════════════════════════════════════ */}
      <Slide id="slide-1" bg="bg-[#0F172A] grid-bg">
        <Blobs />

        {/* NUST Logo — full-slide watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src="/logo_nust.png"
            alt=""
            aria-hidden="true"
            className="w-[420px] h-[420px] object-contain opacity-[0.06] select-none"
          />
        </div>

        {/* Spinning ring decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full border border-primary/10 spin-slow opacity-30" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-accent/10 spin-slow opacity-20" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="text-center max-w-5xl mx-auto relative z-10 w-full">

          {/* NUST small badge — top, tasteful */}
          <div className="fade-up delay-100 flex justify-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <img src="/logo_nust.png" alt="NUST" className="w-6 h-6 object-contain opacity-70" />
              <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">NUST</span>
            </div>
          </div>

          {/* Hackathon badge */}
          <div className="fade-up delay-200 inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            SME Business Indaba Hackathon 2026 &nbsp;·&nbsp; Group R
          </div>

          {/* BIG DRAMATIC TITLE */}
          <h1 className="fade-up delay-300 font-black tracking-tighter leading-none mb-2" style={{ fontSize: 'clamp(5rem, 18vw, 16rem)', lineHeight: 1 }}>
            <span className="shimmer-text">Servu</span>
          </h1>
          {/* subtle tagline under the massive title */}
          <p className="fade-up delay-400 text-base sm:text-xl font-bold text-white/40 tracking-[0.4em] uppercase mb-10">
            Group Presentation
          </p>

          {/* Members */}
          <div className="fade-up delay-500 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-10">
            {[
              {
                name: 'Mphathisi Ndlovu',
                studentNo: 'N02529052A',
                phone: '0787 146 103',
                faculty: 'Computer Science',
                color: 'from-blue-500 to-cyan-500',
                border: 'border-blue-500/30',
                badge: 'bg-blue-500/15 text-blue-300',
              },
              {
                name: 'Anesu Hove',
                studentNo: 'N02530834W',
                phone: '0780 884 195',
                faculty: 'Quantity Surveying',
                color: 'from-emerald-500 to-teal-400',
                border: 'border-emerald-500/30',
                badge: 'bg-emerald-500/15 text-emerald-300',
              },
              {
                name: 'Siyabonga Khumalo',
                studentNo: 'N02534243G',
                phone: '0788 532 354',
                faculty: 'Computer Science',
                color: 'from-violet-500 to-purple-400',
                border: 'border-violet-500/30',
                badge: 'bg-violet-500/15 text-violet-300',
              },
              {
                name: 'Chikomborero I Zvinoira',
                studentNo: 'N02532066J',
                phone: '0781 013 061',
                faculty: 'Chemical Engineering',
                color: 'from-orange-500 to-amber-400',
                border: 'border-orange-500/30',
                badge: 'bg-orange-500/15 text-orange-300',
              },
            ].map((m, i) => (
              <div
                key={i}
                className={`glow-card p-4 rounded-2xl bg-white/[0.04] border ${m.border} text-center flex flex-col items-center gap-2`}
                style={{ animationDelay: `${i * 0.1 + 0.5}s`, opacity: 0 }}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-black text-xl shadow-lg mb-1`}
                >
                  {m.name[0]}
                </div>

                {/* Name */}
                <p className="text-white font-black text-sm leading-tight">{m.name}</p>

                {/* Divider */}
                <div className="w-8 h-px bg-white/10" />

                {/* Student number */}
                <p className="text-slate-400 font-mono text-xs tracking-wider">{m.studentNo}</p>

                {/* Phone */}
                <p className="text-slate-500 text-xs">{m.phone}</p>

                {/* Faculty badge */}
                <span className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${m.badge}`}>
                  {m.faculty}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="fade-up delay-700 flex flex-col items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <span>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 2 – Hackathon Track
      ════════════════════════════════════════ */}
      <Slide id="slide-2" bg="bg-[#080E1A]">
        <Blobs color1="#6366F1" color2="#3B82F6" />
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <SlideNumber n={1} label="The Track" />

          <div className="fade-up delay-100 mb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Hackathon Track</span>
          </div>

          <h2 className="fade-up delay-200 text-5xl sm:text-7xl font-black text-white leading-tight mb-10">
            Youth Employment<br />
            <span className="shimmer-text">&amp; Skills of the Future</span>
          </h2>

          <div className="fade-up delay-300 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-10 rounded-full" />

          <div className="fade-up delay-400 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            <span className="text-3xl">🎯</span>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Our Focus Area</p>
              <p className="text-xl font-black text-white">Gig Economy Enablers</p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 3 – Problem Statement
      ════════════════════════════════════════ */}
      <Slide id="slide-3" bg="bg-[#0D0A1E]">
        <Blobs color1="#EC4899" color2="#8B5CF6" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <SlideNumber n={2} label="Problem Statement" />

          <div className="fade-up delay-100 text-6xl mb-6">❓</div>

          <h2 className="fade-up delay-200 text-3xl sm:text-5xl font-black text-white leading-snug mb-10">
            How can we leverage{' '}
            <span className="text-pink-400">technology</span> to create
            pathways for{' '}
            <span className="shimmer-text">youth employment</span> and
            entrepreneurship?
          </h2>

          <div className="fade-up delay-300 w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-10 rounded-full" />

          <p className="fade-up delay-400 text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Millions of young people in Zimbabwe have the{' '}
            <span className="text-white font-bold">skills</span>, the{' '}
            <span className="text-white font-bold">drive</span>, and the ambition —
            but lack the <span className="text-pink-400 font-bold">infrastructure</span> to connect talent with opportunity.
          </p>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 4 – Judging Criteria
      ════════════════════════════════════════ */}
      <Slide id="slide-4" bg="bg-[#0A0F0A]">
        <Blobs color1="#10B981" color2="#3B82F6" />
        <div className="text-center max-w-5xl mx-auto relative z-10 w-full">
          <SlideNumber n={3} label="Presentation Outline" />
          <h2 className="fade-up delay-100 text-4xl sm:text-6xl font-black text-white mb-14">
            Our Presentation <span className="text-accent">Outline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: '1️⃣', title: 'Defining the Problem', desc: 'We walk through exactly what pain point we tackled and why it matters to Zimbabwean youth right now.', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', badge: 'text-blue-400' },
              { emoji: '2️⃣', title: 'The Idea Behind Servu', desc: 'What makes our approach different — the thinking, the design choices, and what sets it apart.', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', badge: 'text-purple-400' },
              { emoji: '3️⃣', title: 'How It Actually Works', desc: 'A look under the hood — the tech stack, the architecture, and a live demonstration.', color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', badge: 'text-cyan-400' },
              { emoji: '4️⃣', title: 'Who Benefits & How', desc: 'Concrete outcomes for youth, SMEs, and the broader local economy — the real-world difference we make.', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', badge: 'text-green-400' },
              { emoji: '5️⃣', title: 'Growth & Viability', desc: 'How we go from Bulawayo to the rest of Zimbabwe — what makes Servu ready to scale sustainably.', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', badge: 'text-orange-400' },
              { emoji: '6️⃣', title: 'How We Stay Alive', desc: 'Our revenue model — commission-based, youth-friendly, and built to keep growing without burning our users.', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/30', badge: 'text-pink-400' },
            ].map((c, i) => (
              <div
                key={i}
                className={`fade-up glow-card p-6 rounded-3xl bg-gradient-to-br ${c.color} border ${c.border} text-left`}
                style={{ animationDelay: `${i * 0.1 + 0.2}s`, opacity: 0 }}
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h4 className={`font-black text-lg ${c.badge} mb-2`}>{c.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 5 – Our Solution (What is Servu)
      ════════════════════════════════════════ */}
      <Slide id="slide-5" bg="bg-[#0A1628]">
        <Blobs color1="#3B82F6" color2="#06B6D4" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <SlideNumber n={4} label="Our Solution" />

          <div className="fade-up delay-100 w-24 h-24 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8 float">
            <span className="text-4xl">⚡</span>
          </div>

          <h2 className="fade-up delay-200 text-5xl sm:text-7xl font-black mb-4 leading-none">
            <span className="text-white">Serv</span>
            <span className="shimmer-text">u</span>
          </h2>
          <p className="fade-up delay-300 text-xl text-slate-400 mb-10">
            The trust-first gig marketplace for Zimbabwe's youth
          </p>

          <div className="fade-up delay-400 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '🔒', title: 'Escrow Protection', desc: 'Funds locked in before work starts — no more chasing payments' },
              { emoji: '🤝', title: 'Verified Talent Pool', desc: 'ID & skill-verified workers SMEs can actually trust' },
              { emoji: '📈', title: 'Reputation CV', desc: 'Every task builds your digital work history' },
            ].map((f, i) => (
              <div
                key={i}
                className="fade-up glow-card p-6 rounded-3xl bg-white/5 border border-white/10 text-center"
                style={{ animationDelay: `${i * 0.15 + 0.5}s`, opacity: 0 }}
              >
                <div className="text-4xl mb-4">{f.emoji}</div>
                <h4 className="text-white font-black text-base mb-2">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 6 – Impact
      ════════════════════════════════════════ */}
      <Slide id="slide-6" bg="bg-[#0A1A12]">
        <Blobs color1="#10B981" color2="#34D399" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <SlideNumber n={5} label="Impact" />

          <h2 className="fade-up delay-100 text-5xl sm:text-7xl font-black text-white mb-4">
            Real <span className="text-accent">Impact</span>
          </h2>
          <p className="fade-up delay-200 text-slate-400 text-lg mb-14 max-w-2xl mx-auto">
            Designed specifically for Bulawayo's gig economy — connecting local SMEs with verified youth talent.
          </p>

          <div className="fade-up delay-300 grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14">
            {[
              { stat: '120+', label: 'Active Workers', sub: 'on waitlist' },
              { stat: '5 min', label: 'Average Time', sub: 'to hire' },
              { stat: '0%', label: 'Ghosting Rate', sub: 'with escrow' },
              { stat: '∞', label: 'Scale Potential', sub: 'across ZW' },
            ].map((s, i) => (
              <div
                key={i}
                className="glow-card p-6 rounded-3xl bg-accent/5 border border-accent/20 text-center"
                style={{ animationDelay: `${i * 0.1 + 0.4}s` }}
              >
                <p className="text-3xl sm:text-4xl font-black text-accent mb-1">{s.stat}</p>
                <p className="text-white text-xs font-bold">{s.label}</p>
                <p className="text-slate-600 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="fade-up delay-500 flex flex-wrap gap-3 justify-center">
            {['🏘️ Community Growth', '💼 SME Enablement', '🎓 Youth First', '🌍 Zimbabwe Built'].map((tag, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 7 – Feasibility & Scalability
      ════════════════════════════════════════ */}
      <Slide id="slide-7" bg="bg-[#130F20]">
        <Blobs color1="#8B5CF6" color2="#A78BFA" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <SlideNumber n={6} label="Feasibility & Scalability" />

          <h2 className="fade-up delay-100 text-5xl sm:text-6xl font-black text-white leading-tight mb-10">
            Built to <span className="text-purple-400">Scale</span>
          </h2>

          <div className="fade-up delay-200 space-y-4 text-left max-w-2xl mx-auto">
            {[
              { icon: '🚀', title: 'Live & Functional', desc: 'Already deployed — working escrow, gig board, and user management' },
              { icon: '📱', title: 'Mobile-First Design', desc: 'Works on any device — critical for Zimbabwe\'s mobile-first users' },
              { icon: '🔥', title: 'Firebase Backend', desc: 'Serverless & infinitely scalable — no infra headaches as we grow' },
              { icon: '🌐', title: 'Multi-City Ready', desc: 'Harare, Gweru, Mutare — the playbook is proven, just replicate it' },
            ].map((item, i) => (
              <div
                key={i}
                className="fade-up glow-card flex items-start gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20"
                style={{ animationDelay: `${i * 0.12 + 0.3}s`, opacity: 0 }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white font-black">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 8 – Business Model
      ════════════════════════════════════════ */}
      <Slide id="slide-8" bg="bg-[#1A0A08]">
        <Blobs color1="#F97316" color2="#EF4444" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <SlideNumber n={7} label="Business Model" />

          <h2 className="fade-up delay-100 text-5xl sm:text-7xl font-black text-white leading-none mb-4">
            Pay as you <span className="text-orange-400">Earn</span>
          </h2>
          <p className="fade-up delay-200 text-slate-400 text-lg mb-14 max-w-xl mx-auto">
            Built with youths in mind. No subscriptions, no upfront costs. We only make money when <em>you</em> make money.
          </p>

          <div className="fade-up delay-300 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '🚫',
                title: 'No Subscriptions',
                desc: 'We don\'t charge you to access opportunities. The platform is free to use.',
                highlight: false,
              },
              {
                icon: '💸',
                title: 'Small % Per Gig',
                desc: 'We take a tiny commission only when a gig is successfully completed. You pay for what works.',
                highlight: true,
              },
              {
                icon: '♻️',
                title: 'Reinvest & Grow',
                desc: 'Revenue goes back into the platform — better features, more trust tools, wider reach.',
                highlight: false,
              },
            ].map((m, i) => (
              <div
                key={i}
                className={`fade-up glow-card p-8 rounded-3xl border text-center ${
                  m.highlight
                    ? 'bg-orange-500/15 border-orange-500/40 scale-105'
                    : 'bg-white/5 border-white/10'
                }`}
                style={{ animationDelay: `${i * 0.15 + 0.4}s`, opacity: 0 }}
              >
                <div className="text-5xl mb-4">{m.icon}</div>
                <h4 className={`font-black text-lg mb-3 ${m.highlight ? 'text-orange-400' : 'text-white'}`}>
                  {m.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                {m.highlight && (
                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black border border-orange-500/40">
                    OUR MODEL ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="fade-up delay-600 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm">
            <span className="text-2xl">💡</span>
            <span>
              <strong className="text-white">Sustainability:</strong> Commission model = aligned incentives. We grow when workers and SMEs succeed. That's the point.
            </span>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════
          SLIDE 9 – Call to Action
      ════════════════════════════════════════ */}
      <Slide id="slide-9" bg="bg-[#0F172A]">
        <Blobs color1="#3B82F6" color2="#10B981" />

        {/* Animated rings decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[900px] h-[900px] rounded-full border border-primary/5 spin-slow" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-accent/5 spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Final badge */}
          <div className="fade-up delay-100 inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-black uppercase tracking-widest">
            🎤 The Future is Now
          </div>

          <h2 className="fade-up delay-200 text-6xl sm:text-9xl font-black leading-none mb-4">
            <span className="shimmer-text">Join the</span>
          </h2>
          <h2 className="fade-up delay-300 text-6xl sm:text-9xl font-black text-white leading-none mb-10">
            Movement.
          </h2>

          <p className="fade-up delay-400 text-slate-400 text-xl leading-relaxed max-w-xl mx-auto mb-16">
            Servu is live. The platform works. Bulawayo's youth are ready.
            <br />
            <span className="text-white font-bold">Are you?</span>
          </p>

          {/* THE BIG UNNECESSARY BUTTON 🎉 */}
          <div className="fade-up delay-500 flex flex-col items-center gap-6">
            <Link
              href="/"
              className="cta-btn group relative inline-flex items-center gap-4 px-14 py-7 text-2xl font-black text-white rounded-3xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              <span className="relative">
                🚀 See the Demo / Try It Out
              </span>
              <svg
                className="w-7 h-7 group-hover:translate-x-2 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {/* Inner glow overlay */}
              <span className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
              ↑ yes, that button actually works
            </p>
          </div>

          {/* Bottom members reminder */}
          <div className="fade-up delay-700 mt-20 flex flex-wrap items-center justify-center gap-3">
            <span className="text-slate-600 text-xs font-bold uppercase tracking-widest mr-2">Presented by Group R</span>
            {['Mphathisi Ndlovu', 'Anesu Hove', 'Siyabonga Khumalo', 'Chikomborero I Zvinoira'].map((name, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold">
                {name}
              </span>
            ))}
          </div>
        </div>
      </Slide>
    </>
  );
}
