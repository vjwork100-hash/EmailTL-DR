
import React, { useState } from 'react';
import { EmailSummary, SummaryStatus, ActionItem, TimelineEvent, Stakeholder } from '../types';
import { trackEvent, ANALYTICS_EVENTS } from '../analytics';

interface SummaryDisplayProps {
  summary: EmailSummary;
  readonly?: boolean;
  onRate?: (id: string, rating: 'up' | 'down' | 'middle') => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, readonly = false, onRate }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const getStatusConfig = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return { color: 'bg-emerald-500', text: 'Decision Finalized', icon: '✅' };
      case SummaryStatus.PENDING_DECISION: return { color: 'bg-amber-500', text: 'Decision Pending', icon: '⏳' };
      case SummaryStatus.ACTION_REQUIRED: return { color: 'bg-rose-500', text: 'Urgent Action', icon: '🔴' };
      case SummaryStatus.BLOCKED: return { color: 'bg-violet-600', text: 'Blocked', icon: '🚫' };
      default: return { color: 'bg-slate-400', text: 'FYI / Archived', icon: 'ℹ️' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'HIGH': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'NORMAL': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'LOW': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const handleCopy = () => {
    const text = `REPORT: ${summary.thread_title}\n\nDECISION: ${summary.key_decision}\n\nSUMMARY: ${summary.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = getStatusConfig(summary.status);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <span className="text-2xl">{statusConfig.icon}</span>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{summary.thread_title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>{summary.email_count} Emails</span>
            <span>•</span>
            <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>{summary.time_span}</span>
            <span>•</span>
            <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>{summary.participant_count} Participants</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed On</p>
          <p className="text-sm font-bold text-slate-900">{new Date(summary.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
      </section>

      {/* 2. STATUS BOX (PROMINENT) */}
      <section className={`relative overflow-hidden rounded-[3rem] p-10 text-white shadow-2xl ${statusConfig.color}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/70">Executive Summary</h2>
            <p className="text-2xl font-bold leading-tight tracking-tight">
              {summary.summary}
            </p>
            <div className="pt-4 flex gap-6 border-t border-white/20">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Primary Decider</p>
                <p className="font-bold">{summary.decided_by || 'Collaborative'}</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Execution Health</p>
                <p className="font-bold">{statusConfig.text}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:w-64 border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-3 text-center">AI Intelligence</h4>
            <div className="flex justify-center items-center h-24">
               <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/20" />
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={220} strokeDashoffset={220 - (220 * summary.confidence_score) / 100} className="text-white" />
                  </svg>
                  <span className="absolute text-lg font-black">{summary.confidence_score}%</span>
               </div>
            </div>
            <p className="text-[10px] font-bold text-center mt-3 text-white/80 uppercase">Confidence Score</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN (COL 7) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* 3. YOUR ACTION ITEMS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <span className="text-xl">🔴</span>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Your Action Items</h3>
            </div>
            <div className="space-y-4">
              {summary.your_action_items.length > 0 ? summary.your_action_items.map((item, idx) => (
                <ActionCard key={idx} item={item} isPersonal />
              )) : (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center">
                   <p className="text-slate-400 font-bold italic">"None - You were CC'd on this thread."</p>
                </div>
              )}
            </div>
          </section>

          {/* 4. TEAM ACTION ITEMS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <span className="text-xl">🔵</span>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Team Matrix</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {summary.others_action_items.map((item, idx) => (
                <ActionCard key={idx} item={item} />
              ))}
            </div>
          </section>

          {/* 5. KEY DECISION & BUDGET */}
          <section className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-8 shadow-sm">
             <div className="flex items-center space-x-3">
                <span className="text-xl">💰</span>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Resolution & Impact</h3>
             </div>
             
             <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {summary.key_decision}
                </h4>
                <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl inline-block uppercase tracking-wider">
                  Target Outcome: {summary.expected_outcome}
                </p>
             </div>

             {summary.budget && (summary.budget.original_amount || summary.budget.approved_amount) && (
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-6 py-4">Financial Pillar</th>
                        <th className="px-6 py-4">Proposed</th>
                        <th className="px-6 py-4">Approved</th>
                        <th className="px-6 py-4">Delta</th>
                      </tr>
                    </thead>
                    <tbody className="font-bold text-slate-700">
                      <tr>
                        <td className="px-6 py-4">{summary.budget.category || 'Direct Costs'}</td>
                        <td className="px-6 py-4">{summary.budget.original_amount}</td>
                        <td className="px-6 py-4 text-emerald-600">{summary.budget.approved_amount}</td>
                        <td className="px-6 py-4 text-rose-500">
                          {summary.budget.original_amount && summary.budget.approved_amount ? 'Adjusted' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             )}

             <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reasoning Bullets</p>
                <ul className="grid grid-cols-1 gap-2">
                  {summary.decision_reasoning.map((r, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-600">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN (COL 5) */}
        <div className="lg:col-span-5 space-y-12">
          
          {/* 6. STAKEHOLDERS */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <span className="text-xl">👥</span>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Stakeholder Map</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-[3rem] p-6 shadow-sm divide-y divide-slate-50">
              {summary.stakeholders.map((s, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-lg ${s.involvement_level === 'HIGH' ? 'bg-indigo-600' : s.involvement_level === 'MEDIUM' ? 'bg-indigo-400' : 'bg-slate-300'}`}>
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">{s.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${s.involvement_level === 'HIGH' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 bg-slate-50'}`}>
                    {s.involvement_level} Involvement
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 7. TIMELINE (VISUAL) */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <span className="text-xl">📅</span>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Flow Matrix</h3>
            </div>
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {summary.timeline.map((ev, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute left-[-29px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 transition-all group-hover:scale-125 ${ev.is_pending ? 'bg-slate-200' : 'bg-indigo-500'}`}></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ev.date} {ev.time && `@ ${ev.time}`}</p>
                    <p className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{ev.event}</p>
                  </div>
                </div>
              ))}
              <div className="relative group">
                 <div className="absolute left-[-29px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 bg-amber-500 animate-pulse"></div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Next State</p>
                    <p className="text-sm font-black text-slate-900 tracking-tight leading-snug">{summary.next_steps}</p>
                  </div>
              </div>
            </div>
          </section>

          {/* 8. KEY QUOTES */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <span className="text-xl">💬</span>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Direct Intelligence</h3>
            </div>
            <div className="space-y-4">
              {summary.key_quotes.map((q, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm italic text-slate-600 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.899 14.919 16 16.021 16H18.021V14H16.021C13.261 14 11.021 16.241 11.021 19V21H14.017ZM6.017 21L6.017 18C6.017 16.899 6.919 16 8.021 16H10.021V14H8.021C5.261 14 3.021 16.241 3.021 19V21H6.017Z"/></svg>
                  </div>
                  <p className="text-sm font-medium mb-4">"{q.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context: {q.context}</span>
                    <span className="text-xs font-bold text-slate-900">— {q.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 9. CONFIDENCE & QUALITY */}
          <section className="bg-teal-50 border border-teal-100 rounded-[3rem] p-10 space-y-6">
             <div className="flex items-center space-x-3">
                <span className="text-xl">🔍</span>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-teal-600">Accuracy Guardrails</h3>
             </div>
             <div className="space-y-4">
                <p className="text-sm font-bold text-teal-800">Verified Extractions:</p>
                <ul className="space-y-2">
                  {summary.extraction_accuracy.map((point, i) => (
                    <li key={i} className="flex items-center space-x-2 text-xs font-bold text-teal-600 bg-white/50 px-3 py-1.5 rounded-lg border border-teal-200/50">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
             </div>
             {!readonly && (
               <div className="pt-6 border-t border-teal-200/50 flex items-center justify-between">
                  <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest italic">Report Audit</p>
                  <div className="flex gap-2">
                    {['down', 'middle', 'up'].map((val) => (
                      <button 
                        key={val}
                        onClick={() => onRate?.(summary.id, val as any)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white border border-teal-200 hover:border-teal-500 hover:scale-110 shadow-sm ${summary.rating === val ? 'ring-2 ring-teal-500 bg-teal-500 text-white' : 'text-teal-400'}`}
                      >
                        {val === 'up' ? '👍' : val === 'down' ? '👎' : '😐'}
                      </button>
                    ))}
                  </div>
               </div>
             )}
          </section>
        </div>
      </div>

      {/* 10. ACTION BUTTONS (BOTTOM) */}
      <section className="sticky bottom-8 z-40 px-4">
        <div className="max-w-3xl mx-auto bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl ring-1 ring-white/20 flex flex-wrap items-center justify-center gap-2">
          <ActionButton onClick={handleCopy} icon="📋" label={copied ? 'Copied' : 'Copy'} />
          <ActionButton onClick={() => { setShared(true); setTimeout(() => setShared(false), 2000); }} icon="🔗" label={shared ? 'Link Copied' : 'Share'} />
          <ActionButton onClick={() => alert('PDF rendering...')} icon="📄" label="PDF" />
          <ActionButton onClick={() => alert('Opening mail client...')} icon="📧" label="Email" />
          <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block"></div>
          <ActionButton onClick={() => alert('Showing original raw data...')} icon="⚡" label="Original" highlight />
        </div>
      </section>

    </div>
  );
};

const ActionCard: React.FC<{ item: ActionItem, isPersonal?: boolean }> = ({ item, isPersonal }) => (
  <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] hover:shadow-xl group relative overflow-hidden ${isPersonal ? 'bg-white border-rose-100 shadow-rose-200/20' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
    {isPersonal && <div className="absolute left-0 top-0 w-1.5 h-full bg-rose-500"></div>}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors ${
            item.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 
            item.status === 'BLOCKED' ? 'text-rose-600 bg-rose-50 border-rose-100' :
            'text-slate-400 bg-white border-slate-100'
          }`}>
            {item.status}
          </span>
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-slate-100 bg-white text-slate-500`}>
            {item.priority} Priority
          </span>
        </div>
        <p className={`text-lg font-extrabold tracking-tight ${isPersonal ? 'text-slate-900' : 'text-slate-700'}`}>{item.task}</p>
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>Due {item.deadline}</span>
           {!isPersonal && <span className="flex items-center text-indigo-500"><svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2"/></svg>{item.owner}</span>}
           {item.assigned_by && <span className="flex items-center">Via {item.assigned_by}</span>}
           {item.time_estimate && <span className="flex items-center bg-slate-100 px-1.5 py-0.5 rounded-lg text-slate-500">~{item.time_estimate}</span>}
        </div>
      </div>
      {isPersonal && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200">Complete</button>
           <button className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Snooze</button>
        </div>
      )}
    </div>
  </div>
);

const ActionButton = ({ onClick, icon, label, highlight = false }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${highlight ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default SummaryDisplay;
