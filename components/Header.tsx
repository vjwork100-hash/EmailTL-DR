
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">EmailSmart</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                My Summaries
              </Link>
              <div className="h-4 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
                <button 
                  onClick={onLogout}
                  className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
