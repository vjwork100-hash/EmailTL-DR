
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { summarizeEmailThread, EmailSmartError } from '../geminiService';
import { User, EmailSummary } from '../types';
import { FREE_LIMIT, SAMPLE_THREADS } from '../constants';
import SummaryDisplay from './SummaryDisplay';

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
  const navigate = useNavigate();

  const steps = ["Decrypting payload...", "Parsing semantic intent...", "Resolving action owners...", "Finalizing intelligence report..."];

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
      navigate('/signup');
      return;
    }

    if (!thread.trim()) return;

    if (!user && !validateEmail(guestEmail)) {
      setError({ message: 'Professional email required for guest verification.' });
      return;
    }

    setLoading(true);
    setError(null);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % steps.length);
    }, 1400);

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
    <div className="max-w-4xl mx-auto space-y-20 py-10">
      <section className="text-center space-y-8 animate-in slide-in-from-top-6 duration-1000">
        <div className="inline-flex items-center px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm ring-1 ring-indigo-100">
          Powered by Gemini 3.0 Pro
        </div>
        <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 sm:text-7xl leading-[1.05]">
          Intelligence layer for<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">busy professionals.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Paste your email chains and get back hours of your life. We extract decisions, map stakeholders, and pinpoint action items instantly.
        </p>
        
        {!user && (
          <div className="inline-flex items-center px-5 py-2.5 bg-white text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
            {FREE_LIMIT - summariesUsed} Credits available
          </div>
        )}
      </section>

      <section className="bg-white rounded-[3rem] shadow-2xl border border-slate-200/50 p-4 sm:p-6 transition-all duration-700 hover:shadow-indigo-500/5">
        <div className="bg-slate-50/50 rounded-[2.5rem] p-8 sm:p-12 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                Analysis Scenarios
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_THREADS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setThread(s.content); setError(null); }}
                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-tighter text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full h-80 p-8 rounded-[2rem] bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-[14px] focus:ring-indigo-500/5 transition-all outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 shadow-inner group-hover:border-slate-300"
              placeholder="Paste raw email content here (e.g. From: Sarah, Re: Budget Approval...)"
              value={thread}
              onChange={(e) => { setThread(e.target.value); setError(null); }}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-10">
            {!user && (
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">
                  Guest Verification
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    placeholder="Verify email for report delivery"
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-white border-2 border-slate-200 focus:border-indigo-500 outline-none text-sm font-bold transition-all shadow-sm"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                  <svg className="w-6 h-6 text-slate-300 absolute left-5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSummarize}
              disabled={loading || !thread.trim()}
              className={`min-w-[300px] px-12 py-6 rounded-[1.5rem] text-lg font-black tracking-tight shadow-2xl transition-all flex items-center justify-center space-x-4
                ${loading || !thread.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-xs uppercase tracking-[0.25em] font-black">{steps[loadingStep]}</span>
                </>
              ) : (
                <>
                  <span>Decrypt Intelligence</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] animate-shake">
              <div className="flex items-start space-x-5">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600 shadow-sm shrink-0">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-rose-900 font-black uppercase tracking-widest text-xs mb-1">Analysis Execution Fault</h4>
                  <p className="text-rose-700 text-sm font-medium leading-relaxed">{error.message}</p>
                  {error.code === 'RATE_LIMIT' && (
                    <button 
                      onClick={handleSummarize}
                      className="mt-4 text-rose-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Re-attempt Analysis
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <FeatureCard 
          icon={<svg className="w-9 h-9 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          title="High Fidelity" 
          desc="Gemini-powered neural parsing maintains 100% factual accuracy across threads." 
        />
        <FeatureCard 
          icon={<svg className="w-9 h-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} 
          title="Project Guardrails" 
          desc="Automatically isolates blockers and pending decisions that stall projects." 
        />
        <FeatureCard 
          icon={<svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          title="Cognitive ROI" 
          desc="Professional users report saving 45+ minutes of chain-digging per work day." 
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-12 rounded-[3rem] border border-slate-200/50 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-700 hover:-translate-y-2 group">
    <div className="mb-10 bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-500">{icon}</div>
    <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight leading-tight">{title}</h3>
    <p className="text-slate-500 text-base leading-relaxed font-medium">{desc}</p>
  </div>
);

import { Link } from 'react-router-dom';
export default Landing;