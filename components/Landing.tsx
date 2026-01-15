
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { summarizeEmailThread, EmailSmartError } from '../geminiService';
import { User, EmailSummary } from '../types';
import { FREE_LIMIT, SAMPLE_THREADS } from '../constants';
import SummaryDisplay from './SummaryDisplay';
import { trackEvent, ANALYTICS_EVENTS } from '../analytics';

interface LandingProps {
  user: User | null;
  onAddSummary: (s: EmailSummary) => void;
}

const Landing: React.FC<LandingProps> = ({ user, onAddSummary }) => {
  const [thread, setThread] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [currentSummary, setCurrentSummary] = useState<EmailSummary | null>(null);

  const steps = ["Analyzing thread semantics...", "Extracting action owners...", "Resolving deadlines...", "Generating intelligence report..."];

  const summariesUsed = user 
    ? user.summaries_used 
    : Number(localStorage.getItem('email_smart_anon_count') || 0);

  const isLimitReached = !user && summariesUsed >= FREE_LIMIT;

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSummarize = async () => {
    if (isLimitReached) {
      onAddSummary({} as any); 
      return;
    }

    if (!thread.trim()) return;

    if (!user && !validateEmail(guestEmail)) {
      setError({ message: 'Professional email required for guest verification.' });
      return;
    }

    setLoading(true);
    setError(null);
    trackEvent(ANALYTICS_EVENTS.SUMMARIZE_CLICKED, { has_user: !!user });
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % steps.length);
    }, 1200);

    try {
      const summary = await summarizeEmailThread(thread);
      onAddSummary(summary);
      setCurrentSummary(summary);
      setThread('');
    } catch (err: any) {
      setError({ message: err.message, code: err.code });
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (currentSummary) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
             <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Reports</Link>
             <span>/</span>
             <span className="text-slate-900">Current Session</span>
          </div>
          <button 
            onClick={() => setCurrentSummary(null)}
            className="group flex items-center space-x-2 text-sm font-black text-indigo-600 hover:text-indigo-800 transition-all"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Analyze New Thread</span>
          </button>
        </div>
        <SummaryDisplay summary={currentSummary} />
      </div>
    );
  }

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
          <a href="#analyzer" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-tight shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            Start Free Analysis
          </a>
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

      {/* INTERACTIVE ANALYZER */}
      <section id="analyzer" className="bg-white rounded-[4rem] shadow-2xl border border-slate-200/50 p-4 sm:p-10 transition-all duration-700 hover:shadow-indigo-500/10">
        <div className="bg-slate-50 rounded-[3rem] p-8 sm:p-16 space-y-12">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                  Neural Input Terminal
                </label>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Paste your email chain</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_THREADS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setThread(s.content); setError(null); }}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full h-96 p-10 rounded-[2.5rem] bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-[20px] focus:ring-indigo-500/5 transition-all outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 shadow-inner group-hover:border-slate-300"
              placeholder="Paste raw email content here..."
              value={thread}
              onChange={(e) => { setThread(e.target.value); setError(null); }}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-12 pt-4">
            {!user && (
              <div className="flex-1 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">
                  Identity Verification
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    placeholder="Work email for intelligence report"
                    className="w-full pl-16 pr-8 py-6 rounded-3xl bg-white border-2 border-slate-200 focus:border-indigo-500 outline-none text-base font-bold transition-all shadow-sm"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                  <svg className="w-6 h-6 text-indigo-500 absolute left-6 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSummarize}
              disabled={loading || !thread.trim()}
              className={`min-w-[340px] px-14 py-8 rounded-[2rem] text-xl font-black tracking-tight shadow-2xl transition-all flex items-center justify-center space-x-6
                ${loading || !thread.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <div className="w-8 h-8 border-[4px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm uppercase tracking-[0.25em] font-black">{steps[loadingStep]}</span>
                </>
              ) : (
                <>
                  <span>Decrypt Intelligence</span>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="bg-rose-50 border-2 border-rose-100 p-10 rounded-[3rem] animate-shake">
              <div className="flex items-start space-x-6">
                <div className="bg-rose-100 p-4 rounded-2xl text-rose-600 shadow-sm shrink-0">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-rose-900 font-black uppercase tracking-widest text-xs mb-1">Analysis Execution Fault</h4>
                  <p className="text-rose-700 text-base font-medium leading-relaxed">{error.message}</p>
                </div>
              </div>
            </div>
          )}
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
