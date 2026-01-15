
import React from 'react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Simple, performance-based pricing.</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Choose the plan that fits your professional workload. No hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">The Starter</h3>
            <div className="text-4xl font-black text-slate-900">$0<span className="text-lg text-slate-400 font-bold">/mo</span></div>
          </div>
          <ul className="space-y-4 mb-12 flex-grow">
            {['2 Thread Summaries / month', 'Basic Decision Mapping', 'Local History Storage', 'Standard Latency'].map((f, i) => (
              <li key={i} className="flex items-center text-sm font-bold text-slate-600">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="block w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl text-center font-black tracking-tight hover:bg-slate-50 transition-all">
            Current Plan
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border-4 border-indigo-500/20">
          <div className="absolute top-0 right-0 p-8">
            <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Popular</div>
          </div>
          <div className="mb-8 relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Pro Intelligence</h3>
            <div className="text-4xl font-black text-white">$19<span className="text-lg text-slate-500 font-bold">/mo</span></div>
          </div>
          <ul className="space-y-4 mb-12 flex-grow relative z-10">
            {['Unlimited Summaries', 'High-Fidelity Neural Parsing', 'Export to Slack & PDF', 'Cloud Sync Across Devices', 'Priority API Access'].map((f, i) => (
              <li key={i} className="flex items-center text-sm font-bold text-slate-300">
                <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <button className="relative z-10 block w-full py-4 bg-indigo-600 text-white rounded-2xl text-center font-black tracking-tight hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
