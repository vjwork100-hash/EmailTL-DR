
import React, { useState } from 'react';
import { User, EmailSummary } from '../types.ts';
import { FREE_LIMIT } from '../constants.ts';
import { Link } from 'react-router-dom';

interface SettingsProps {
  user: User;
  summaries: EmailSummary[];
  onClearAll: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, summaries, onClearAll }) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [preferences, setPreferences] = useState({
    autoShare: false,
    emailDigest: true,
    compactMode: false
  });

  const isPro = user.subscription_tier === 'pro';
  const usagePercent = Math.min((user.summaries_used / FREE_LIMIT) * 100, 100);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearData = () => {
    onClearAll();
    setShowConfirmClear(false);
    alert("Local analysis history cleared.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* 1. PROFILE & ACCOUNT */}
      <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32 -z-10"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-100">
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h2>
              <p className="text-slate-500 font-medium">Managing identity and secure access.</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account ID</span>
             <code className="text-[10px] bg-slate-50 px-3 py-1 rounded-lg text-slate-500 font-mono border border-slate-100">
               {user.id}
             </code>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
             <div className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 text-sm flex items-center justify-between">
                <span>{user.email}</span>
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 9.503l7.834-4.603A2 2 0 0016 4H4a2 2 0 00-1.834.9zM3 8v5a2 2 0 002 2h10a2 2 0 002-2V8l-7 4.118L3 8z" clipRule="evenodd"/></svg>
             </div>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
             <button className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 text-sm hover:bg-slate-50 transition-all text-left flex items-center justify-between">
                <span>••••••••••••</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest underline">Update Access</span>
             </button>
           </div>
        </div>
      </section>

      {/* 2. SUBSCRIPTION & USAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-8 opacity-5">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">Intelligence Tier</h3>
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-end justify-between">
               <div>
                  <p className="text-4xl font-black tracking-tighter uppercase">{user.subscription_tier}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Membership Status</p>
               </div>
               {!isPro && (
                 <Link to="/pricing" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                    Upgrade to Pro
                 </Link>
               )}
            </div>

            <div className="pt-8 border-t border-white/10">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Usage</span>
                  <span className="text-[10px] font-black text-white">{isPro ? 'UNLIMITED' : `${user.summaries_used} / ${FREE_LIMIT}`}</span>
               </div>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: isPro ? '100%' : `${usagePercent}%` }}></div>
               </div>
               <p className="text-[9px] text-slate-500 mt-3 italic font-medium">Credits reset on the 1st of every month.</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Workspace Preferences</h3>
           <div className="space-y-6">
              <PreferenceToggle 
                label="Auto-share Summaries" 
                desc="Generate public links automatically for every analysis." 
                active={preferences.autoShare} 
                onClick={() => togglePreference('autoShare')} 
              />
              <PreferenceToggle 
                label="Executive Email Digest" 
                desc="Receive a weekly summary of all decision items." 
                active={preferences.emailDigest} 
                onClick={() => togglePreference('emailDigest')} 
              />
              <PreferenceToggle 
                label="Compact Mode" 
                desc="Use high-density layout for analysis reports." 
                active={preferences.compactMode} 
                onClick={() => togglePreference('compactMode')} 
              />
           </div>
        </section>
      </div>

      {/* 3. DATA & PRIVACY */}
      <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10">
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Data Management</h3>
           <p className="text-slate-500 text-sm font-medium">Manage how your intelligence and history is stored.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-8 rounded-[2rem] bg-rose-50 border border-rose-100 gap-8">
           <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg font-black text-rose-600">Flush Neural History</h4>
              <p className="text-xs font-bold text-rose-500/70 max-w-sm uppercase tracking-wider">Warning: This action is irreversible and deletes all stored reports.</p>
           </div>
           
           {!showConfirmClear ? (
             <button 
               onClick={() => setShowConfirmClear(true)}
               className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
             >
               Purge Local Storage
             </button>
           ) : (
             <div className="flex items-center gap-4 animate-in zoom-in-95 duration-200">
               <button 
                 onClick={handleClearData}
                 className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl"
               >
                 Confirm Delete
               </button>
               <button 
                 onClick={() => setShowConfirmClear(false)}
                 className="text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-600"
               >
                 Cancel
               </button>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
           <div className="text-center p-6">
              <p className="text-2xl font-black text-slate-900 tracking-tight">{summaries.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Stored Reports</p>
           </div>
           <div className="text-center p-6 border-x border-slate-100">
              <p className="text-2xl font-black text-slate-900 tracking-tight">AES-256</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Encryption Protocol</p>
           </div>
           <div className="text-center p-6">
              <p className="text-2xl font-black text-slate-900 tracking-tight">GDPR</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Compliance Status</p>
           </div>
        </div>
      </section>

      {/* FOOTER ACTION */}
      <div className="text-center">
         <p className="text-xs font-bold text-slate-400 mb-8">Engineering the future of professional communication.</p>
         <Link to="/dashboard" className="inline-flex items-center space-x-2 text-indigo-600 font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform">
           <span>Back to Workspace</span>
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
         </Link>
      </div>
    </div>
  );
};

const PreferenceToggle = ({ label, desc, active, onClick }: { label: string, desc: string, active: boolean, onClick: () => void }) => (
  <div className="flex items-center justify-between group">
     <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-900">{label}</h4>
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[240px]">{desc}</p>
     </div>
     <button 
       onClick={onClick}
       className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-indigo-600' : 'bg-slate-100 border border-slate-200'}`}
     >
        <div className={`absolute top-1 w-4 h-4 rounded-full transition-all shadow-sm ${active ? 'left-7 bg-white' : 'left-1 bg-slate-300'}`}></div>
     </button>
  </div>
);

export default Settings;
