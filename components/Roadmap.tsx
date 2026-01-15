
import React from 'react';

const Roadmap: React.FC = () => {
  const items = [
    { status: 'LIVE', title: 'Gemini 3 Powered Analysis', date: 'March 2024', desc: 'Full email thread extraction using latest multimodal reasoning.' },
    { status: 'NEXT', title: 'Slack & Teams Integration', date: 'Q2 2024', desc: 'Push decisions directly to your team channels.' },
    { status: 'NEXT', title: 'Chrome Extension', date: 'Q2 2024', desc: 'Summarize inside Gmail and Outlook with one click.' },
    { status: 'LATER', title: 'Document Intelligence', date: 'Q3 2024', desc: 'Summarize attached PDFs and slide decks alongside the email thread.' },
    { status: 'LATER', title: 'AI Reply Suggestion', date: 'Q4 2024', desc: 'Draft context-aware replies based on extracted decisions.' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">The Roadmap</h1>
        <p className="text-slate-500 text-lg">Building the operating system for modern communication.</p>
      </div>

      <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {items.map((item, idx) => (
          <div key={idx} className="relative pl-12 group">
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${item.status === 'LIVE' ? 'bg-emerald-500' : item.status === 'NEXT' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase ${item.status === 'LIVE' ? 'bg-emerald-50 text-emerald-600' : item.status === 'NEXT' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                  {item.status}
                </span>
                <span className="text-xs font-bold text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;