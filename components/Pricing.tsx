
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../stripeService';
import { User } from '../types';

interface PricingProps {
  user?: User | null;
}

const Pricing: React.FC<PricingProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setLoading(true);
    try {
      const { url } = await createCheckoutSession('price_pro_monthly');
      // Simulate Stripe redirect
      window.location.href = url;
    } catch (error) {
      console.error("Payment failed", error);
      setLoading(false);
    }
  };

  const isPro = user?.subscription_tier === 'pro';

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Simple, performance-based pricing.</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Choose the plan that fits your professional workload. No hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className={`bg-white border border-slate-200 p-12 rounded-[3rem] shadow-sm flex flex-col transition-all ${!isPro ? 'ring-4 ring-indigo-500/10' : 'opacity-60'}`}>
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
          <div className="block w-full py-4 border-2 border-slate-200 text-slate-400 rounded-2xl text-center font-black tracking-tight cursor-default">
            {!isPro ? 'Current Plan' : 'Free Forever'}
          </div>
        </div>

        {/* Pro Tier */}
        <div className={`bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border-4 transition-all ${isPro ? 'border-emerald-500/50' : 'border-indigo-500/20'}`}>
          <div className="absolute top-0 right-0 p-8">
            <div className={`${isPro ? 'bg-emerald-600' : 'bg-indigo-600'} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg`}>
              {isPro ? 'Active' : 'Popular'}
            </div>
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
          
          <button 
            onClick={handleUpgrade}
            disabled={loading || isPro}
            className={`relative z-10 block w-full py-4 rounded-2xl text-center font-black tracking-tight transition-all shadow-xl flex items-center justify-center space-x-3
              ${isPro 
                ? 'bg-emerald-500/20 text-emerald-400 cursor-default' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Securing Session...</span>
              </>
            ) : isPro ? (
              <span>Membership Active</span>
            ) : (
              <span>Upgrade to Pro</span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Secure payments powered by</p>
        <div className="flex justify-center items-center opacity-30">
           <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13.911 10.155c0-.687-.506-1.127-1.378-1.127-1.155 0-2.343.344-3.328 1.012l-.563-2.12c1.247-.687 2.803-1.096 4.398-1.096 2.503 0 4.197 1.256 4.197 3.511 0 2.56-1.556 3.653-3.003 3.653-1.012 0-1.786-.496-1.786-1.378 0-.82.687-1.427 1.549-1.427.709 0 1.214.314 1.416.738zm-1.194 6.945c-1.346 0-2.459-.971-2.459-2.318 0-1.346 1.113-2.317 2.459-2.317 1.346 0 2.459.971 2.459 2.317 0 1.347-1.113 2.318-2.459 2.318z"/></svg>
           <span className="text-xl font-black ml-1">Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
