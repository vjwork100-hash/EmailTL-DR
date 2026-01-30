
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trackEvent, ANALYTICS_EVENTS } from '../analytics.ts';

interface SignupProps {
  onSignupSuccess: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.SIGNUP_VIEWED);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSignupSuccess(email);
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Onboarding</h1>
          <p className="text-slate-500 mt-2 font-medium">Join 2,400+ professionals using EmailSmart.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Work Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-sm"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-sm"
              placeholder="Secure Passphrase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">✓</div>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">Beta Tier: 5 Free Monthly Reports</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-tight shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Initialize Account'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          Existing member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
