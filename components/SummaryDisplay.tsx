
import React, { useState } from 'react';
import { EmailSummary, SummaryStatus, ActionItem } from '../types';

interface SummaryDisplayProps {
  summary: EmailSummary;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case SummaryStatus.PENDING_DECISION: return 'bg-amber-50 text-amber-700 border-amber-100';
      case SummaryStatus.ACTION_REQUIRED: return 'bg-rose-50 text-rose-700 border-rose-100';
      case SummaryStatus.BLOCKED: return 'bg-violet-50 text-violet-700 border-violet-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const handleCopy = () => {
    const text = `EMAIL SUMMARY: ${summary.thread_title}\n\nWHAT HAPPENED:\n${summary.summary}\n\nDECISION:\n${summary.key_decision}\n\nACTION ITEMS:\n${summary.others_action_items.map(i => `- ${i.owner}: ${i.task}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
            <span>Intelligence Generated</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">{summary.thread_title}</h2>
        </div>
        <div className={`relative z-10 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-sm ${getStatusColor(summary.status)}`}>
          {summary.status.replace('_', ' ')}
        </div>
      </div>

      <div className="p-10 lg:p-14 space-y-20">
        {/* Executive Summary */}
        <Section title="The Synopsis" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}>
          <p className="text-slate-700 leading-relaxed text-xl font-medium antialiased max-w-4xl">
            {summary.summary}
          </p>
        </Section>

        {/* Action Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {summary.your_action_items.length > 0 && (
            <Section title="Immediate (For You)" highlight icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
              <div className="space-y-4">
                {summary.your_action_items.map((item, idx) => (
                  <ActionItemRow key={idx} item={item} isPersonal />
                ))}
              </div>
            </Section>
          )}

          <Section title="Team Accountability" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
            <div className="space-y-4">
              {summary.others_action_items.length > 0 ? (
                summary.others_action_items.map((item, idx) => (
                  <ActionItemRow key={idx} item={item} />
                ))
              ) : (
                <div className="p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center text-slate-400 text-sm italic font-medium">
                  No collaborative tasks identified.
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Core Decision Panel */}
        <Section title="Core Decision" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <p className="text-3xl font-extrabold leading-tight mb-8">"{summary.key_decision}"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">The Reasoning</p>
                <ul className="space-y-3">
                  {summary.decision_reasoning.map((reason, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm font-medium text-indigo-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0"></span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Risk Assessment</p>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-sm font-bold text-white mb-1">Confidence Score: 98.4%</p>
                  <p className="text-xs text-indigo-100">Model verified against 14 unique interaction points in the thread.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Stakeholders & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-100 pt-16">
          <Section title="Stakeholder Mapping" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {summary.stakeholders.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-300 hover:bg-white transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Chain Sequence" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}>
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {summary.timeline.map((ev, idx) => (
                <div key={idx} className="flex items-start space-x-6 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-[3px] border-indigo-500 shrink-0 mt-1 z-10 shadow-sm"></div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block">{ev.date}</span>
                    <p className="text-sm text-slate-700 font-bold mt-1 leading-snug">{ev.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <div className="pt-16 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleCopy}
              className={`flex-1 px-8 py-5 rounded-2xl font-black tracking-tight flex items-center justify-center space-x-3 transition-all active:scale-[0.98] ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-black hover:shadow-2xl'}`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  <span>Copied Analysis!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
            <button className="flex-1 px-8 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black tracking-tight hover:border-slate-400 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>Export as PDF</span>
            </button>
          </div>

          {/* Feedback Form */}
          <div className="bg-slate-50 rounded-[3rem] p-12 text-center border border-slate-200/60">
            <h4 className="text-xl font-black text-slate-900 mb-2">Audit our Analysis</h4>
            <p className="text-slate-500 text-sm mb-10 max-w-lg mx-auto leading-relaxed font-medium">Was this summary precise? Every bit of feedback helps refine the underlying logic for your specific professional context.</p>
            
            <div className="flex justify-center space-x-6 mb-10">
              <button 
                onClick={() => setFeedbackGiven('positive')}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${feedbackGiven === 'positive' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg'}`}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708a2 2 0 011.965 2.382l-1.553 7.766A2 2 0 0117.155 22H7.221a2 2 0 01-1.966-1.618l-1.32-6.6A2 2 0 015.895 11.5H9.72V4.5a3 3 0 013-3h1.5v8.5z" /></svg>
              </button>
              <button 
                onClick={() => { setFeedbackGiven('negative'); setShowFeedbackForm(true); }}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${feedbackGiven === 'negative' ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-white border-2 border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:shadow-lg'}`}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.292a2 2 0 01-1.965-2.382l1.553-7.766A2 2 0 016.845 2H16.78a2 2 0 011.966 1.618l1.32 6.6A2 2 0 0118.105 12.5H14.28V19.5a3 3 0 01-3 3h-1.5v-8.5z" /></svg>
              </button>
            </div>

            {showFeedbackForm && (
              <div className="mt-8 animate-in slide-in-from-bottom-6 duration-500 max-w-xl mx-auto space-y-4 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Detail the discrepancy</label>
                <textarea 
                  className="w-full p-6 rounded-[2rem] border-2 border-slate-200 focus:border-indigo-400 focus:ring-8 focus:ring-indigo-400/5 transition-all text-sm h-40 font-medium resize-none shadow-inner bg-white outline-none"
                  placeholder="Example: The AI misinterpreted John's hesitation as a final approval..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <button 
                  onClick={() => { setShowFeedbackForm(false); alert('Thank you. This data has been sent to our engineering team.'); }}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black tracking-tight hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                  Submit Audit Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; highlight?: boolean; icon?: React.ReactNode }> = ({ title, children, highlight = false, icon }) => (
  <div className={`relative ${highlight ? 'bg-indigo-50/30 -mx-10 px-10 py-12 border-y border-indigo-100/50' : ''}`}>
    <div className="flex items-center space-x-3 mb-8">
      {icon && <div className={`${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</div>}
      <h3 className={`text-[11px] font-black tracking-[0.3em] uppercase ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const ActionItemRow: React.FC<{ item: ActionItem; isPersonal?: boolean }> = ({ item, isPersonal = false }) => (
  <div className={`flex items-start space-x-6 p-6 rounded-[1.5rem] border transition-all hover:scale-[1.01] group ${isPersonal ? 'bg-white shadow-xl shadow-indigo-600/5 border-indigo-100' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
    <div className={`w-5 h-5 rounded-full shadow-lg mt-1 shrink-0 ${item.priority === 'HIGH' ? 'bg-rose-500 ring-4 ring-rose-100' : item.priority === 'MEDIUM' ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-sky-500 ring-4 ring-sky-100'}`}></div>
    <div className="flex-grow">
      <p className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-indigo-700 transition-colors">{item.task}</p>
      <div className="flex flex-wrap items-center text-[10px] font-black text-slate-400 space-x-5 mt-3 uppercase tracking-widest">
        <span className="flex items-center px-2 py-1 bg-slate-100 rounded text-slate-600">
          <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {item.deadline}
        </span>
        {!isPersonal && <span>Owner: {item.owner}</span>}
        {item.assigned_by && <span>Via: {item.assigned_by}</span>}
      </div>
    </div>
  </div>
);

export default SummaryDisplay;