
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, User } from '../types';
import { SAMPLE_THREADS, FREE_LIMIT } from '../constants';
import { summarizeEmailThread } from '../geminiService';
import { validateEmailThread } from '../services/validationService';

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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

  const handleSummarize = async () => {
    const validation = validateEmailThread(thread);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid thread.');
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
      setError(err.message);
    } finally {
      setLoading(false);
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
      const matchesSearch = (s.thread_title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const status = getCardStatus(s);
      return matchesSearch && (activeFilter === 'ALL' || status.id === activeFilter);
    });
  }, [summaries, searchQuery, activeFilter]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Workspace</h1>
          <p className="text-slate-500 font-medium">Capture decisions and map project outcomes.</p>
        </div>
        <button 
          onClick={() => setShowAnalyzer(!showAnalyzer)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all"
        >
          {showAnalyzer ? 'Close Terminal' : 'New Analysis'}
        </button>
      </div>

      {showAnalyzer && (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Intelligence Terminal</h3>
            <div className="flex gap-2">
              {SAMPLE_THREADS.map(s => (
                <button key={s.id} onClick={() => setThread(s.content)} className="px-3 py-1 bg-slate-50 border rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full h-64 p-6 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-mono text-sm"
            placeholder="Paste raw email chain here..."
            value={thread}
            onChange={(e) => setThread(e.target.value)}
          />
          <button 
            onClick={handleSummarize}
            disabled={loading || !thread.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg disabled:opacity-50"
          >
            {loading ? 'Analyzing Neural Patterns...' : 'Generate Intelligence'}
          </button>
          {error && <p className="text-rose-500 text-center font-bold text-sm">{error}</p>}
        </div>
      )}

      <div className="bg-white p-4 rounded-3xl border flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Filter workspace..." 
          className="flex-grow px-4 py-2 outline-none font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {['ALL', 'URGENT', 'PENDING', 'RESOLVED'].map(f => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f as any)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFilter === f ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-slate-400'}`}
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
            <Link key={s.id} to={`/summary/${s.id}`} className="group block bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                  {status.icon} {status.label}
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-1">{s.thread_title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">{s.summary}</p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
                <span>{s.email_count || 0} Emails</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
