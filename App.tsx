
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import SummaryDetail from './components/SummaryDetail';
import AuthModal from './components/AuthModal';
import { User, EmailSummary } from './types';
import { FREE_LIMIT } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [summaries, setSummaries] = useState<EmailSummary[]>([]);

  // Local storage based persistence for MVP demo
  useEffect(() => {
    const savedUser = localStorage.getItem('email_smart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Initialize anonymous count if not present
      const anonCount = localStorage.getItem('email_smart_anon_count');
      if (!anonCount) localStorage.setItem('email_smart_anon_count', '0');
    }

    const savedSummaries = localStorage.getItem('email_smart_summaries');
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries));
    }
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
    setIsAuthOpen(false);
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
      <div className="min-h-screen gradient-bg flex flex-col">
        <Header 
          user={user} 
          onLoginClick={() => setIsAuthOpen(true)} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
          <Routes>
            <Route path="/" element={
              <Landing 
                user={user} 
                onAddSummary={addSummary} 
                onAuthRequired={() => setIsAuthOpen(true)} 
              />
            } />
            <Route path="/dashboard" element={
              user ? (
                <Dashboard 
                  summaries={summaries} 
                  onDelete={deleteSummary} 
                />
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/summary/:id" element={<SummaryDetail summaries={summaries} />} />
          </Routes>
        </main>

        <footer className="border-t py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} EmailSmart. All rights reserved. Built for busy professionals.
        </footer>

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      </div>
    </Router>
  );
};

export default App;
