
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(email);
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Identity Check</h1>
          <p className="text-slate-500 mt-2 font-medium">Continue your high-fidelity analysis session.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Email</label>
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
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
              <button type="button" className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-wider">Reset Access</button>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-tight shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-10 flex items-center space-x-3">
          <div className="flex-grow h-px bg-slate-100"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Fast Pass</span>
          <div className="flex-grow h-px bg-slate-100"></div>
        </div>

        <button 
          onClick={() => {
            onLoginSuccess('google-user@example.com');
            navigate('/dashboard');
          }}
          className="w-full mt-8 py-4 px-6 border-2 border-slate-100 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          <span className="text-slate-600">Google Workspace</span>
        </button>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          New here? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Request Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
