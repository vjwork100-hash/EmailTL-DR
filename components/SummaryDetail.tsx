
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { EmailSummary } from '../types';
import SummaryDisplay from './SummaryDisplay';

interface SummaryDetailProps {
  summaries: EmailSummary[];
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ summaries }) => {
  const { id } = useParams<{ id: string }>();
  const summary = summaries.find(s => s.id === id);

  if (!summary) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">My Summaries</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{summary.thread_title}</span>
      </div>
      <SummaryDisplay summary={summary} />
    </div>
  );
};

export default SummaryDetail;
