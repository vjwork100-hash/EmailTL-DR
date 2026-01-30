
import React from 'react';
import { User } from '../types.ts';
import { Link } from 'react-router-dom';

interface LandingProps {
  user: User | null;
}

const Landing: React.FC<LandingProps> = ({ user }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-32 py-10">
      {/* HERO SECTION */}
      <section className="text-center space-y-10 animate-in slide-in-from-top-6 duration-1000 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        
        <div className="inline-flex items-center px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm ring-1 ring-indigo-100">
          Intelligence version 3.0 Pro
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 sm:text-8xl leading-[0.95] max-w-4xl mx-auto">
          Unread emails <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400">are now dead.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Stop scrolling through 50-reply chains. Get the bottom line, the action items, and the financial impact in milliseconds. 
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to={user ? "/dashboard" : "/signup"} 
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-tight shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
          >
            {user ? "Go to Dashboard" : "Start Free Analysis"}
          </Link>
          <div className="flex -space-x-3 items-center px-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
              </div>
            ))}
            <span className="pl-6 text-xs font-bold text-slate-400 uppercase tracking-widest">+2.4k users</span>
          </div>
        </div>
      </section>

      {/* VISUAL PREVIEW / SCREENSHOT MOCKUP */}
      <section className="relative px-4">
        <div className="relative mx-auto max-w-5xl rounded-[3rem] border border-slate-200 bg-white p-2 shadow-2xl overflow-hidden group">
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-4 sm:p-10 flex flex-col md:flex-row gap-8">
            {/* Mock Sidebar */}
            <div className="hidden md:block w-48 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-10 w-full bg-white rounded-xl border border-slate-200 shadow-sm"></div>
                <div className="h-10 w-full bg-white/50 rounded-xl border border-slate-100"></div>
                <div className="h-10 w-full bg-white/50 rounded-xl border border-slate-100"></div>
              </div>
            </div>
            {/* Mock Content */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between">
                <div className="h-10 w-48 bg-indigo-600 rounded-2xl"></div>
                <div className="h-8 w-24 bg-emerald-100 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4">
                  <div className="h-3 w-1/2 bg-rose-100 rounded-full"></div>
                  <div className="h-10 w-full bg-rose-50 rounded-xl"></div>
                  <div className="h-10 w-full bg-rose-50 rounded-xl"></div>
                </div>
                <div className="h-64 bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4">
                  <div className="h-3 w-1/2 bg-indigo-100 rounded-full"></div>
                  <div className="h-20 w-full bg-indigo-50 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay Tag */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl scale-110 group-hover:scale-125 transition-transform">
            High-Fidelity Dashboard
          </div>
        </div>
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] -z-10 opacity-40"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-200 rounded-full blur-[100px] -z-10 opacity-30"></div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Engineered for Decision Makers.</h2>
          <p className="text-slate-500 font-medium">Why waste time reading when you can just know?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} 
            title="Ownership Isolation" 
            desc="Our neural parser detects directive language to tell you exactly what YOU need to do versus everyone else." 
          />
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
            title="Financial Logic" 
            desc="Automatic extraction of budget quotes, currency conversion, and delta tracking between proposed and approved funds." 
          />
          <FeatureCard 
            icon={<svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} 
            title="Guardian Mode" 
            desc="Identifies logical inconsistencies or unresolved questions in the thread so you don't miss the 'fine print'." 
          />
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="text-center space-y-12">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Integrated with your workflow</h3>
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
           <div className="text-2xl font-black">GMAIL</div>
           <div className="text-2xl font-black">OUTLOOK</div>
           <div className="text-2xl font-black">SLACK</div>
           <div className="text-2xl font-black">TEAMS</div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200/50 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-700 hover:-translate-y-2 group">
    <div className="mb-10 bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-500">{icon}</div>
    <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight leading-tight">{title}</h3>
    <p className="text-slate-500 text-base leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Landing;
