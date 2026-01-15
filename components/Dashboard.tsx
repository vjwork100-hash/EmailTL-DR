
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, SummaryStatus, User, ActionItem } from '../types';
import { FREE_LIMIT, SAMPLE_THREADS } from '../constants';
import { summarizeEmailThread } from '../geminiService';
import { trackEvent, ANALYTICS_EVENTS } from '../analytics';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
  onAddSummary: (s: EmailSummary) => void;
  user?: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete, onAddSummary, user }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement | null>(null);
  const analyzerSteps = ["Analyzing semantics...", "Identifying owners...", "Mapping deadlines...", "Building report..."];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSummarize = async () => {
    if (!thread.trim()) return;
    setLoading(true);
    setError(null);
    trackEvent(ANALYTICS_EVENTS.SUMMARIZE_CLICKED, { from: 'dashboard' });

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % analyzerSteps.length);
    }, 1000);

    try {
      const summary = await summarizeEmailThread(thread);
      onAddSummary(summary);
      setThread('');
      setShowAnalyzer(false);
    } catch (err: any) {
      setError(err.message || "Failed to analyze thread.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const getCardStatus = (summary: EmailSummary) => {
    const allActions = [...summary.your_action_items, ...summary.others_action_items];
    if (allActions.length === 0) return { label: 'Informational', color: 'bg-slate-100 text-slate-500', icon: 'ℹ️' };

    const now = new Date();
    const pending = allActions.filter(a => a.status !== 'COMPLETED');
    const snoozed = pending.filter(a => a.snoozed_until && new Date(a.snoozed_until) > now);
    const unsnoozed = pending.filter(a => !a.snoozed_until || new Date(a.snoozed_until) <= now);

    if (pending.length === 0) return { label: 'Resolved', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: '✅' };
    
    const urgentItems = unsnoozed.filter(a => a.priority === 'URGENT' || a.priority === 'HIGH');
    if (urgentItems.length > 0) return { label: 'Urgent Action', color: 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse', icon: '🔥' };
    
    if (unsnoozed.length > 0) return { label: 'Pending', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: '⏳' };
    
    if (snoozed.length > 0) return { label: 'Snoozed', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: '🌙' };

    return { label: 'Archived', color: 'bg-slate-100 text-slate-500', icon: '📦' };
  };

  const handleAction = (e: React.MouseEvent, action: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(null);
    
    switch (action) {
      case 'delete':
        onDelete(id);
        break;
      case 'email':
        const s = summaries.find(x => x.id === id);
        if (s) {
          const subject = encodeURIComponent(`Intelligence Report: ${s.thread_title}`);
          const body = encodeURIComponent(`Check out this summary: ${window.location.origin}/#/share/${id}`);
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
        break;
      case 'pdf':
        window.location.hash = `/summary/${id}`;
        setTimeout(() => window.print(), 500);
        break;
      default:
        break;
    }
  };

  const currentUsed = user?.summaries_used || 0;
  const isPro = user?.subscription_tier === 'pro';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">Workspace</h1>
          <p className="text-slate-500 font-medium text-lg">Manage your intelligence reports and project outcomes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end px-6 border-r border-slate-200">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Intelligence Status</span>
             <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isPro ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 bg-slate-100'}`}>
                {isPro ? 'Pro Active' : 'Basic Tier'}
             </span>
          </div>
          <button 
            onClick={() => setShowAnalyzer(!showAnalyzer)}
            className={`px-8 py-4 rounded-2xl font-black text-sm tracking-tight transition-all flex items-center shadow-2xl ${showAnalyzer ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1'}`}
          >
            {showAnalyzer ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                Close Terminal
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                New Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANALYZER TERMINAL (Toggled) */}
      {showAnalyzer && (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-12 shadow-2xl animate-in slide-in-from-top-4 duration-500">
           <div className="space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Terminal</h3>
                  <p className="text-slate-500 text-sm font-medium">Paste a thread to generate a high-fidelity report.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_THREADS.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => setThread(s.content)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
             </div>

             <textarea
                className="w-full h-80 p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-[15px] focus:ring-indigo-500/5 transition-all outline-none resize-none font-mono text-sm leading-relaxed text-slate-700"
                placeholder="Paste raw email chain here..."
                value={thread}
                onChange={(e) => setThread(e.target.value)}
                disabled={loading}
             />

             <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                <div className="flex items-center space-x-6">
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Neural Engine Ready</span>
                   </div>
                   {!isPro && (
                     <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                       Credits: {FREE_LIMIT - currentUsed} left
                     </span>
                   )}
                </div>
                <button 
                  onClick={handleSummarize}
                  disabled={loading || !thread.trim()}
                  className={`min-w-[240px] py-5 rounded-2xl font-black text-sm tracking-tight transition-all flex items-center justify-center space-x-4
                    ${loading || !thread.trim() ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl'}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{analyzerSteps[loadingStep]}</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Intelligence</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </>
                  )}
                </button>
             </div>
             {error && <p className="text-rose-600 text-xs font-bold text-center mt-4">Analysis Error: {error}</p>}
           </div>
        </div>
      )}

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* STATS SIDEBAR */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl transition-all">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Metrics</h3>
             <div className="space-y-6">
                <div>
                   <p className="text-3xl font-black text-slate-900 tracking-tighter">{summaries.length}</p>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reports Decoded</p>
                </div>
                <div className="pt-6 border-t border-slate-100">
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Storage</p>
                      <p className="text-[10px] font-bold text-slate-400">{isPro ? 'UNLIMITED' : `${currentUsed}/${FREE_LIMIT}`}</p>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000" 
                        style={{ width: isPro ? '100%' : `${(currentUsed/FREE_LIMIT)*100}%` }}
                      />
                   </div>
                </div>
                {!isPro && (
                  <Link to="/pricing" className="block text-center py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                    Unlock Unlimited
                  </Link>
                )}
             </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 relative z-10">Pro Tip</h4>
             <p className="text-sm font-bold leading-relaxed relative z-10">Action Items with high priority trigger "Urgent" status indicators on your dashboard automatically.</p>
          </div>
        </div>

        {/* REPORTS LIST */}
        <div className="lg:col-span-9">
          {summaries.length === 0 ? (
            <div className="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-24 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No intelligence captured yet.</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">Start by clicking "New Analysis" at the top to decode your first email thread.</p>
              <button 
                onClick={() => setShowAnalyzer(true)}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Launch Intelligence Terminal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {summaries.map((s) => {
                const status = getCardStatus(s);
                return (
                  <div key={s.id} className="group relative bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-start justify-between mb-8">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                        <span>{status.icon}</span>
                        <span>{status.label}</span>
                      </div>
                      
                      <div className="relative" ref={activeMenuId === s.id ? menuRef : null}>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === s.id ? null : s.id);
                          }}
                          className="p-2 text-slate-300 hover:text-slate-900 transition-all rounded-xl hover:bg-slate-50"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>

                        {activeMenuId === s.id && (
                          <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={(e) => handleAction(e, 'email', s.id)}
                              className="w-full text-left px-6 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-4 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              <span>Forward via Email</span>
                            </button>
                            <button 
                              onClick={(e) => handleAction(e, 'pdf', s.id)}
                              className="w-full text-left px-6 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-4 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              <span>Export as PDF</span>
                            </button>
                            <div className="h-px bg-slate-100 my-2 mx-6"></div>
                            <button 
                              onClick={(e) => handleAction(e, 'delete', s.id)}
                              className="w-full text-left px-6 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center space-x-4 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" /></svg>
                              <span>Purge Record</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link to={`/summary/${s.id}`} className="block">
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-4 leading-none tracking-tight">
                        {s.thread_title}
                      </h2>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                        {s.summary}
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span>{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2.5 overflow-hidden">
                            {s.stakeholders.slice(0, 3).map((sh, idx) => (
                              <div key={idx} title={sh.name} className="inline-block h-7 w-7 rounded-xl ring-2 ring-white bg-indigo-50 text-[10px] flex items-center justify-center font-black text-indigo-400 border border-indigo-100">
                                {sh.name[0]}
                              </div>
                            ))}
                            {s.stakeholders.length > 3 && (
                              <div className="inline-block h-7 w-7 rounded-xl ring-2 ring-white bg-slate-100 text-[10px] flex items-center justify-center font-black text-slate-400 border border-slate-200">
                                +{s.stakeholders.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
