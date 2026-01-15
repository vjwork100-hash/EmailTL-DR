
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItem = (to: string, label: string) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${location.pathname === to ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 glass-card no-print">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-5xl">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-xl group-hover:scale-105 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">EmailSmart</span>
        </Link>

        <nav className="flex items-center space-x-8">
          <div className="hidden md:flex items-center space-x-8">
            {navItem('/roadmap', 'Roadmap')}
            {user && navItem('/dashboard', 'Dashboard')}
            {user && navItem('/settings', 'Settings')}
            {user?.subscription_tier !== 'pro' && navItem('/pricing', 'Pricing')}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/settings" className="flex flex-col items-end hover:opacity-70 transition-opacity">
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">{user.email.split('@')[0]}</span>
                {user.subscription_tier === 'pro' && (
                  <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest leading-none mt-0.5">Pro Member</span>
                )}
              </Link>
              <button 
                onClick={onLogout}
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
