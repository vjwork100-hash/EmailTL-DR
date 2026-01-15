
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { EmailSummary } from '../types';
import SummaryDisplay from './SummaryDisplay';

interface SummaryDetailProps {
  summaries: EmailSummary[];
  onRate: (id: string, rating: 'up' | 'down') => void;
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ summaries, onRate }) => {
  const { id } = useParams<{ id: string }>();
  const summary = summaries.find(s => s.id === id);

  if (!summary) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" /></svg>
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-black">{summary.thread_title}</span>
      </div>
      <SummaryDisplay summary={summary} onRate={onRate} />
    </div>
  );
};

export default SummaryDetail;
