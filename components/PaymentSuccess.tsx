
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifySession } from '../stripeService';

interface PaymentSuccessProps {
  onUpgrade: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onUpgrade }) => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySession(sessionId).then(isValid => {
        if (isValid) {
          onUpgrade();
          setVerifying(false);
        } else {
          navigate('/pricing');
        }
      });
    } else {
      navigate('/pricing');
    }
  }, [searchParams, onUpgrade, navigate]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Finalizing Intelligence Access...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-10 animate-in zoom-in-95 duration-700">
      <div className="bg-emerald-100 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-100/50">
        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Welcome to Pro.</h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          Your payment was successful. All intelligence limits have been lifted. You now have unlimited neural parsing and priority access.
        </p>
      </div>

      <div className="pt-10">
        <Link 
          to="/dashboard" 
          className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all inline-block"
        >
          Go to Pro Dashboard
        </Link>
      </div>

      <div className="pt-20 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
          Encryption Handshake Complete • ID: {searchParams.get('session_id')}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
