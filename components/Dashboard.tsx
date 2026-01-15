
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, SummaryStatus, User } from '../types';
import { FREE_LIMIT } from '../constants';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
  user?: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete, user }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusIcon = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>;
      case SummaryStatus.PENDING_DECISION: return <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>;
      case SummaryStatus.ACTION_REQUIRED: return <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
    }
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
        window.location.href = `mailto:?subject=EmailSmart Report&body=Check out this summary: ${window.location.origin}/#/summary/${id}`;
        break;
      case 'pdf':
        // Navigation to detail and triggering print is a clean way to handle this in SPA
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review your past analysis and pending actions.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Analyze Thread
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Usage Stats Widget */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col justify-between h-fit">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Subscription Status</h3>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPro ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {isPro ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Monthly Credits</span>
                <span>{isPro ? '∞' : `${currentUsed}/${FREE_LIMIT}`}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000" 
                  style={{ width: isPro ? '100%' : `${(currentUsed / FREE_LIMIT) * 100}%` }}
                />
              </div>
            </div>
          </div>
          {!isPro && (
            <Link to="/pricing" className="mt-6 block text-center py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-colors">
              Upgrade Account
            </Link>
          )}
        </div>

        {/* Summaries List */}
        <div className="lg:col-span-3">
          {summaries.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-24 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Archives are empty</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium leading-relaxed">Your summarized reports will appear here once you start feeding intelligence into the engine.</p>
              <Link to="/" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center justify-center space-x-2 transition-colors">
                <span>Get your first summary</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summaries.map((s) => (
                <div key={s.id} className="group relative bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(s.status)}
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {s.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {/* 3-DOT MENU */}
                    <div className="relative" ref={activeMenuId === s.id ? menuRef : null}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === s.id ? null : s.id);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-50"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {activeMenuId === s.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={(e) => handleAction(e, 'email', s.id)}
                            className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span>Forward via Email</span>
                          </button>
                          <button 
                            onClick={(e) => handleAction(e, 'pdf', s.id)}
                            className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            <span>Save as PDF</span>
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-4"></div>
                          <button 
                            onClick={(e) => handleAction(e, 'delete', s.id)}
                            className="w-full text-left px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center space-x-3"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" /></svg>
                            <span>Delete Report</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link to={`/summary/${s.id}`} className="block">
                    <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 leading-tight tracking-tight">
                      {s.thread_title}
                    </h2>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                      {s.summary}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2 overflow-hidden">
                          {s.stakeholders.slice(0, 3).map((sh, idx) => (
                            <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-50 text-[8px] flex items-center justify-center font-bold text-indigo-400">
                              {sh.name[0]}
                            </div>
                          ))}
                        </div>
                        <span className="text-indigo-500">{s.your_action_items.length + s.others_action_items.length} Points</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
