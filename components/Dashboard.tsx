
import React from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, SummaryStatus } from '../types';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete }) => {
  const getStatusIcon = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return <span className="text-green-500">✓</span>;
      case SummaryStatus.PENDING_DECISION: return <span className="text-yellow-500">⌛</span>;
      case SummaryStatus.ACTION_REQUIRED: return <span className="text-red-500">⚠</span>;
      default: return <span className="text-gray-400">●</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Summaries</h1>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
          + New Summary
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-20 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No summaries yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start summarizing your email threads to see them listed here for easy reference.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Go to paster →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaries.map((s) => (
            <div key={s.id} className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                    {getStatusIcon(s.status)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {s.status.replace('_', ' ')}
                  </span>
                </div>
                <button 
                  onClick={() => onDelete(s.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <Link to={`/summary/${s.id}`}>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {s.thread_title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {s.summary}
                </p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>{new Date(s.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span>{s.your_action_items.length} Tasks</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
