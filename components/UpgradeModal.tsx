
import React from 'react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 animate-in zoom-in-95 duration-300 text-center">
        <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">You've hit the edge of free.</h2>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          You've used all your free intelligence credits. Upgrade to Pro to unlock unlimited deep-thread parsing and Slack exports.
        </p>

        <div className="space-y-4">
          <Link 
            to="/pricing" 
            onClick={onClose}
            className="block w-full py-5 bg-indigo-600 text-white rounded-2xl font-black tracking-tight shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1"
          >
            See Pro Plans
          </Link>
          <button 
            onClick={onClose}
            className="block w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
