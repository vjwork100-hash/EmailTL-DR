
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { summarizeEmailThread } from '../geminiService';
import { User, EmailSummary } from '../types';
import { FREE_LIMIT, SAMPLE_THREAD } from '../constants';
import SummaryDisplay from './SummaryDisplay';

interface LandingProps {
  user: User | null;
  onAddSummary: (s: EmailSummary) => void;
  onAuthRequired: () => void;
}

const Landing: React.FC<LandingProps> = ({ user, onAddSummary, onAuthRequired }) => {
  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [currentSummary, setCurrentSummary] = useState<EmailSummary | null>(null);

  const steps = ["Analyzing thread...", "Extracting decisions...", "Identifying action items...", "Finalizing summary..."];

  const summariesUsed = user 
    ? user.summaries_used 
    : Number(localStorage.getItem('email_smart_anon_count') || 0);

  const isLimitReached = !user && summariesUsed >= FREE_LIMIT;

  const handleSummarize = async () => {
    if (isLimitReached) {
      onAuthRequired();
      return;
    }

    if (!thread.trim()) return;

    setLoading(true);
    setError('');
    
    // Simulate loading steps for UX
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % steps.length);
    }, 1200);

    try {
      const summary = await summarizeEmailThread(thread);
      onAddSummary(summary);
      setCurrentSummary(summary);
      setThread('');
    } catch (err) {
      console.error(err);
      setError('Failed to summarize thread. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (currentSummary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Summary</h2>
          <button 
            onClick={() => setCurrentSummary(null)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to paster
          </button>
        </div>
        <SummaryDisplay summary={currentSummary} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight">
          Summarize emails in <span className="text-blue-600">seconds.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Stop digging through endless chains. Get clear decisions, tasks, and deadlines from any email thread instantly.
        </p>
        {!user && (
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium inline-block border border-blue-100">
            {FREE_LIMIT - summariesUsed} of {FREE_LIMIT} free summaries remaining
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-xl border p-2 sm:p-4 overflow-hidden">
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
            Paste your email thread below
          </label>
          <textarea
            className="w-full h-64 p-4 rounded-lg border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none font-mono text-sm"
            placeholder="From: Sarah... To: Team... Subject: Budget..."
            value={thread}
            onChange={(e) => setThread(e.target.value)}
            disabled={loading}
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setThread(SAMPLE_THREAD)}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              disabled={loading}
            >
              Try with an example thread
            </button>
            <button
              onClick={handleSummarize}
              disabled={loading || !thread.trim()}
              className={`w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-all flex items-center justify-center space-x-3
                ${loading || !thread.trim() 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{steps[loadingStep]}</span>
                </>
              ) : (
                <>
                  <span>Summarize Now</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon="1️⃣" 
          title="Paste Thread" 
          desc="Copy your entire Gmail or Outlook thread and drop it in." 
        />
        <FeatureCard 
          icon="2️⃣" 
          title="AI Analysis" 
          desc="Our expert model parses context, tone, and specific asks." 
        />
        <FeatureCard 
          icon="3️⃣" 
          title="Get Results" 
          desc="Scannable summary, key decisions, and prioritized tasks." 
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
