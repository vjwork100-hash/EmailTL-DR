
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import SummaryDetail from './components/SummaryDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import Roadmap from './components/Roadmap';
import Deployment from './components/Deployment';
import Pricing from './components/Pricing';
import ShareView from './components/ShareView';
import UpgradeModal from './components/UpgradeModal';
import PaymentSuccess from './components/PaymentSuccess';
import Settings from './components/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { EmailSummary, ActionItem } from './types';
import { FREE_LIMIT, STORAGE_KEYS } from './constants';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, login, signup, logout, upgrade, incrementUsage } = useAuth();
  const [summaries, setSummaries] = useState<EmailSummary[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const savedSummaries = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    if (savedSummaries) setSummaries(JSON.parse(savedSummaries));
  }, []);

  const addSummary = (summary: EmailSummary) => {
    const currentUsed = user ? user.summaries_used : Number(localStorage.getItem(STORAGE_KEYS.ANON_COUNT) || 0);
    const isPro = user?.subscription_tier === 'pro';
    
    if (!isPro && currentUsed >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    const updated = [summary, ...summaries];
    setSummaries(updated);
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(updated));
    incrementUsage();
  };

  const deleteSummary = (id: string) => {
    const updated = summaries.filter(s => s.id !== id);
    setSummaries(updated);
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(updated));
  };

  const updateActionItem = (summaryId: string, itemIdx: number, isPersonal: boolean, newStatus: ActionItem['status'], snoozeUntil?: string) => {
    const updated = summaries.map(s => {
      if (s.id !== summaryId) return s;
      const key = isPersonal ? 'your_action_items' : 'others_action_items';
      const items = [...(s[key] as ActionItem[])];
      items[itemIdx] = { 
        ...items[itemIdx], 
        status: newStatus,
        snoozed_until: snoozeUntil || (newStatus === 'COMPLETED' ? undefined : items[itemIdx].snoozed_until)
      };
      return { ...s, [key]: items };
    });
    setSummaries(updated);
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(updated));
  };

  return (
    // The ErrorBoundary correctly wraps the app to catch rendering errors.
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen gradient-bg flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
          <Header user={user} onLogout={logout} />
          
          <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
            <Routes>
              <Route path="/" element={<Landing user={user} />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={login} />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSignupSuccess={signup} />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/deploy" element={<Deployment />} />
              <Route path="/pricing" element={<Pricing user={user} />} />
              <Route path="/payment-success" element={<PaymentSuccess onUpgrade={upgrade} />} />
              <Route path="/share/:id" element={<ShareView summaries={summaries} onUpdateActionItem={updateActionItem} />} />
              <Route path="/dashboard" element={user ? <Dashboard summaries={summaries} onDelete={deleteSummary} onAddSummary={addSummary} user={user} /> : <Navigate to="/login" />} />
              <Route path="/summary/:id" element={<SummaryDetail summaries={summaries} onRate={() => {}} onUpdateActionItem={updateActionItem} />} />
              <Route path="/settings" element={user ? <Settings user={user} summaries={summaries} onClearAll={() => setSummaries([])} /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200 py-12 text-center text-slate-400 text-sm no-print">
            &copy; {new Date().getFullYear()} EmailSmart. Engineering the future of communication.
          </footer>

          <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
