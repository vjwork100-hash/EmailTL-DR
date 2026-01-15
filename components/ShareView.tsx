
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { EmailSummary } from '../types';
import SummaryDisplay from './SummaryDisplay';

interface ShareViewProps {
  summaries: EmailSummary[];
}

const ShareView: React.FC<ShareViewProps> = ({ summaries }) => {
  const { id } = useParams<{ id: string }>();
  // In a real app, this would fetch from a database using the ID.
  // For the MVP, we check local session.
  const summary = summaries.find(s => s.id === id);

  if (!summary) {
    return (
      <div className="py-24 text-center space-y-6">
        <h2 className="text-3xl font-black text-slate-900">Intelligence report expired or private.</h2>
        <p className="text-slate-500 font-medium">The link you're following might have been revoked by the owner.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
        <p className="text-sm font-bold text-indigo-700">
          You are viewing a shared report. 
          <a href="#" className="underline ml-2">Analyze your own threads for free.</a>
        </p>
      </div>
      <SummaryDisplay summary={summary} readonly />
    </div>
  );
};

export default ShareView;
