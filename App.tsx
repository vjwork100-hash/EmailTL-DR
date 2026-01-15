
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
import { User, EmailSummary } from './types';
import { FREE_LIMIT } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [summaries, setSummaries] = useState<EmailSummary[]>([]);

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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('email_smart_user');
  };

  const addSummary = (summary: EmailSummary) => {
    const updated = [summary, ...summaries];
    setSummaries(updated);
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
    
    if (!user) {
      const current = Number(localStorage.getItem('email_smart_anon_count') || 0);
      localStorage.setItem('email_smart_anon_count', (current + 1).toString());
    } else {
      const updatedUser = { ...user, summaries_used: user.summaries_used + 1 };
      setUser(updatedUser);
      localStorage.setItem('email_smart_user', JSON.stringify(updatedUser));
    }
  };

  const deleteSummary = (id: string) => {
    const updated = summaries.filter(s => s.id !== id);
    setSummaries(updated);
    localStorage.setItem('email_smart_summaries', JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="min-h-screen gradient-bg flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
          <Routes>
            <Route path="/" element={<Landing user={user} onAddSummary={addSummary} />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuthSuccess} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onSignupSuccess={handleAuthSuccess} />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/deploy" element={<Deployment />} />
            <Route path="/dashboard" element={user ? <Dashboard summaries={summaries} onDelete={deleteSummary} /> : <Navigate to="/login" />} />
            <Route path="/summary/:id" element={<SummaryDetail summaries={summaries} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 py-12 text-center text-slate-400 text-sm">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
          &copy; {new Date().getFullYear()} EmailSmart. Engineering the future of communication.
        </footer>
      </div>
    </Router>
  );
};

export default App;