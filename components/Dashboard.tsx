
import React from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, SummaryStatus } from '../types';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete }) => {
  const getStatusIcon = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>;
      case SummaryStatus.PENDING_DECISION: return <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>;
      case SummaryStatus.ACTION_REQUIRED: return <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review your past analysis and pending actions.</p>
        </div>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Analyze Thread
        </Link>
      </div>

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
                <button 
                  onClick={() => onDelete(s.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50"
                  title="Delete Report"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
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
  );
};

export default Dashboard;
