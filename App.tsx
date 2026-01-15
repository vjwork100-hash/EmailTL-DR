
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
import { User, EmailSummary, ActionItem } from './types';
import { FREE_LIMIT } from './constants';
import { trackEvent, ANALYTICS_EVENTS } from './analytics';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [summaries, setSummaries] = useState<EmailSummary[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('email_smart_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedSummaries = localStorage.getItem('email_smart_summaries');
    if (savedSummaries) setSummaries(JSON.parse(savedSummaries));
  }, []);

  const handleAuthSuccess = (email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      subscription_tier: 'free',
      summaries_used: Number(localStorage.getItem('email_smart_anon_count') || 0)
    };
    setUser(newUser);
    localStorage.setItem('email_smart_user', JSON.stringify(newUser));
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser: User = { ...user, subscription_tier: 'pro' };
      setUser(updatedUser);
      localStorage.setItem('email_smart_user', JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('email_smart_user');
  };

  const addSummary = (summary: EmailSummary) => {
    const currentUsed = user ? user.summaries_used : Number(localStorage.getItem('email_smart_anon_count') || 0);
    const isPro = user?.subscription_tier === 'pro';
    
    if (!isPro && currentUsed >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      trackEvent(ANALYTICS_EVENTS.UPGRADE_MODAL_VIEWED, { reason: 'limit_reached' });
      return;
    }

    const updated = [summary, ...summaries];
    setSummaries(updated);
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
    
    if (user) {
      const updatedUser = { ...user, summaries_used: user.summaries_used + 1 };
      setUser(updatedUser);
      localStorage.setItem('email_smart_user', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('email_smart_anon_count', (currentUsed + 1).toString());
    }
  };

  const deleteSummary = (id: string) => {
    const updated = summaries.filter(s => s.id !== id);
    setSummaries(updated);
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
  };

  const rateSummary = (id: string, rating: 'up' | 'down' | 'middle') => {
    const updated = summaries.map(s => s.id === id ? { ...s, rating } : s);
    setSummaries(updated);
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
    trackEvent(ANALYTICS_EVENTS.SUMMARY_RATED, { summary_id: id, rating });
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
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="min-h-screen gradient-bg flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
          <Routes>
            <Route path="/" element={<Landing user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuthSuccess} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSignupSuccess={handleAuthSuccess} />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/deploy" element={<Deployment />} />
            <Route path="/pricing" element={<Pricing user={user} />} />
            <Route path="/payment-success" element={<PaymentSuccess onUpgrade={handleUpgrade} />} />
            <Route path="/share/:id" element={<ShareView summaries={summaries} onUpdateActionItem={updateActionItem} />} />
            <Route path="/dashboard" element={user ? <Dashboard summaries={summaries} onDelete={deleteSummary} onAddSummary={addSummary} user={user} /> : <Navigate to="/login" />} />
            <Route path="/summary/:id" element={<SummaryDetail summaries={summaries} onRate={rateSummary} onUpdateActionItem={updateActionItem} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 py-12 text-center text-slate-400 text-sm no-print">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
          &copy; {new Date().getFullYear()} EmailSmart. Engineering the future of communication.
        </footer>

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      </div>
    </Router>
  );
};

export default App;
