
import React, { useState, useMemo } from 'react';
import { EmailSummary, User } from '../types.ts';
import { summarizeEmailThread, EmailSmartError } from '../geminiService.ts';
import { validateEmailThread } from '../services/validationService.ts';
import { Link } from 'react-router-dom';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
  onAddSummary: (s: EmailSummary) => void;
  user?: User | null;
}

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
      await (window as any).aistudio.openSelectKey();
      setError(null);
      if (thread) handleSummarize();
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
          {showAnalyzer ? "Close Terminal" : "New Analysis"}
        </button>
      </div>

      {showAnalyzer && (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-12 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-6">
            <textarea
              className="w-full h-80 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all font-mono text-sm"
              placeholder="Paste raw email chain here..."
              value={thread}
              onChange={(e) => setThread(e.target.value)}
            />
            <button 
              onClick={handleSummarize}
              disabled={loading || !thread.trim()}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Mapping Decisions..." : "Generate Intelligence"}
            </button>
            {error && (
              <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold text-center">
                {error.message}
                {(error.code === 'QUOTA_EXHAUSTED' || error.code === 'ENTITY_NOT_FOUND') && (
                  <button onClick={handleSelectKey} className="ml-4 underline">Select API Key</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full md:w-96 pl-6 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {(['ALL', 'URGENT', 'PENDING', 'RESOLVED'] as FilterStatus[]).map(f => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFilter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSummaries.map(s => {
          const status = getCardStatus(s);
          return (
            <Link key={s.id} to={`/summary/${s.id}`} className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all">
              <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase mb-6 ${status.color}`}>
                {status.icon} {status.label}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2">{s.thread_title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{s.summary}</p>
              <div className="pt-6 border-t border-slate-50 flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
                <span>{s.email_count} Emails</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
