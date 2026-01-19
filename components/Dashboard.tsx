
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, User } from '../types';
import { SAMPLE_THREADS, FREE_LIMIT } from '../constants';
import { summarizeEmailThread, EmailSmartError } from '../geminiService';
import { validateEmailThread } from '../services/validationService';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
  onAddSummary: (s: EmailSummary) => void;
  user?: User | null;
}

// Global augmentation removed to avoid "identical modifiers" error with existing AIStudio type definitions.
// Using type assertion at the call site instead.

type FilterStatus = 'ALL' | 'URGENT' | 'PENDING' | 'SNOOZED' | 'RESOLVED' | 'INFO';

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete, onAddSummary, user }) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, code?: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

  const handleSummarize = async () => {
    const validation = validateEmailThread(thread);
    if (!validation.isValid) {
      setError({ message: validation.error || 'Invalid thread.' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const summary = await summarizeEmailThread(thread);
      onAddSummary(summary);
      setThread('');
      setShowAnalyzer(false);
    } catch (err: any) {
      if (err instanceof EmailSmartError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: err.message || 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      // FIX: Use type assertion for aistudio to bypass redeclaration conflicts in the global window object
      await (window as any).aistudio.openSelectKey();
      // Proceeding directly after trigger as per race condition guidelines in instructions
      setError(null);
      if (thread) {
        handleSummarize();
      }
    } catch (err) {
      console.error("Failed to open key selection", err);
    }
  };

  const getCardStatus = (summary: EmailSummary) => {
    const allActions = [...(summary.your_action_items || []), ...(summary.others_action_items || [])];
    if (allActions.length === 0) return { id: 'INFO', label: 'Informational', color: 'bg-slate-100 text-slate-500', icon: 'ℹ️' };

    const pending = allActions.filter(a => a.status !== 'COMPLETED');
    if (pending.length === 0) return { id: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: '✅' };
    
    const urgent = pending.some(a => a.priority === 'URGENT' || a.priority === 'HIGH');
    if (urgent) return { id: 'URGENT', label: 'Urgent', color: 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse', icon: '🔥' };
    
    return { id: 'PENDING', label: 'Pending', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: '⏳' };
  };

  const filteredSummaries = useMemo(() => {
    return (summaries || []).filter(s => {
      const matchesSearch = (s.thread_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (s.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
      const status = getCardStatus(s);
      return matchesSearch && (activeFilter === 'ALL' || status.id === activeFilter);
    });
  }, [summaries, searchQuery, activeFilter]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Workspace</h1>
          <p className="text-slate-500 font-medium">Capture decisions and map project outcomes from your inbox.</p>
        </div>
        <button 
          onClick={() => setShowAnalyzer(!showAnalyzer)}
          className={`px-8 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-3 ${showAnalyzer ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {showAnalyzer ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              Close Terminal
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              New Analysis
            </>
          )}
        </button>
      </div>

      {showAnalyzer && (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-12 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
              <div className="shrink-0">
                <h3 className="text-2xl font-black tracking-tight text-slate-900">Intelligence Terminal</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Inject raw email data for neural processing.</p>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deep Learning Datasets</span>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1 scroll-smooth">
                    {SAMPLE_THREADS.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => { setThread(s.content); setError(null); }} 
                        className="whitespace-nowrap px-4 py-2.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-white hover:bg-indigo-600 hover:border-transparent transition-all duration-300 active:scale-95"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <textarea
                className="w-full h-80 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-mono text-sm leading-relaxed text-slate-700 resize-none"
                placeholder="Paste raw email chain here..."
                value={thread}
                onChange={(e) => { setThread(e.target.value); if (error) setError(null); }}
              />
              {thread.length > 0 && (
                <button 
                  onClick={() => setThread('')}
                  className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-xl shadow-sm text-slate-400 hover:text-rose-500 transition-colors border border-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-5">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i + 15}`} className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all cursor-help" alt="user" />
                      </div>
                    ))}
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900 tracking-tight">Active Analysts</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Join 2,400+ users globally</p>
                 </div>
              </div>
              
              <button 
                onClick={handleSummarize}
                disabled={loading || !thread.trim()}
                className={`min-w-[280px] py-5 rounded-2xl font-black text-sm tracking-tight transition-all flex items-center justify-center gap-3 shadow-2xl
                  ${loading || !thread.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200 active:translate-y-0 active:shadow-lg'}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mapping Decisions...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Intelligence</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] text-rose-600 text-sm font-bold animate-shake">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error.message}
                </div>
                {(error.code === 'QUOTA_EXHAUSTED' || error.code === 'ENTITY_NOT_FOUND') && (
                  <div className="text-center">
                    <button 
                      onClick={handleSelectKey}
                      className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-200 transition-colors"
                    >
                      Select Personal API Key
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Professional users should use their own paid project key. 
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="ml-1 underline">Billing Docs</a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search decisions, titles, or tags..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 transition-all outline-none font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto justify-center md:justify-end">
          {(['ALL', 'URGENT', 'PENDING', 'RESOLVED'] as FilterStatus[]).map(f => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                ${activeFilter === f 
                  ? 'bg-slate-900 text-white border-transparent shadow-lg' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
              {f === 'ALL' ? 'All Units' : f}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSummaries.length === 0 ? (
          <div className="col-span-full py-32 text-center space-y-4">
            <div className="bg-slate-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-40">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900">No Intelligence Records Found.</h3>
            <p className="text-slate-400 font-medium">Clear your filters or paste a new thread to start.</p>
          </div>
        ) : (
          filteredSummaries.map(s => {
            const status = getCardStatus(s);
            return (
              <Link 
                key={s.id} 
                to={`/summary/${s.id}`} 
                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.color}`}>
                    {status.icon} {status.label}
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(s.id); }}
                    className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                  {s.thread_title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium mb-8">
                  {s.summary}
                </p>
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{s.email_count || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
