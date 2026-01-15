
import React from 'react';
import { EmailSummary, SummaryStatus, ActionItem } from '../types';

interface SummaryDisplayProps {
  summary: EmailSummary;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const getStatusColor = (status: SummaryStatus) => {
    switch (status) {
      case SummaryStatus.DECISION_MADE: return 'bg-green-100 text-green-800 border-green-200';
      case SummaryStatus.PENDING_DECISION: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SummaryStatus.ACTION_REQUIRED: return 'bg-red-100 text-red-800 border-red-200';
      case SummaryStatus.BLOCKED: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCopy = () => {
    const text = `EMAIL SUMMARY: ${summary.thread_title}\n\nWHAT HAPPENED:\n${summary.summary}\n\nDECISION:\n${summary.key_decision}\n\nACTION ITEMS:\n${summary.others_action_items.map(i => `- ${i.owner}: ${i.task}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  return (
    <div className="bg-white border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-gray-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{summary.thread_title}</h2>
          <p className="text-gray-400 text-sm mt-1">Generated: {new Date(summary.created_at).toLocaleString()}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(summary.status)}`}>
          {summary.status.replace('_', ' ')}
        </div>
      </div>

      <div className="p-6 space-y-10">
        <Section title="WHAT HAPPENED">
          <p className="text-gray-700 leading-relaxed text-lg">{summary.summary}</p>
        </Section>

        {summary.your_action_items.length > 0 && (
          <Section title="YOUR ACTION ITEMS" highlight>
            <div className="space-y-3">
              {summary.your_action_items.map((item, idx) => (
                <ActionItemRow key={idx} item={item} />
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Section title="TEAM ACTION ITEMS">
            <div className="space-y-4">
              {summary.others_action_items.length > 0 ? (
                summary.others_action_items.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.task}</p>
                      <p className="text-xs text-gray-500">
                        {item.owner} {item.owner_role && `(${item.owner_role})`} • Due: {item.deadline}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No team items specified.</p>
              )}
            </div>
          </Section>

          <Section title="KEY DECISION">
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <p className="font-bold text-blue-900 text-lg mb-2">{summary.key_decision}</p>
              <ul className="space-y-2">
                {summary.decision_reasoning.map((reason, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t pt-10">
          <Section title="STAKEHOLDERS">
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.stakeholders).map(([name, role]) => (
                <div key={name} className="px-3 py-1 bg-gray-100 rounded-lg text-sm group relative">
                  <span className="font-semibold">{name}</span>
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-0 w-48 bg-gray-900 text-white p-2 rounded text-xs z-10">
                    {role}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="TIMELINE">
            <div className="space-y-3">
              {summary.timeline.map((ev, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <span className="text-xs font-mono text-gray-400 w-24 shrink-0 uppercase mt-1">{ev.date}</span>
                  <p className="text-sm text-gray-700">{ev.event}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {summary.key_quotes.length > 0 && (
          <Section title="IMPORTANT QUOTES">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.key_quotes.map((q, idx) => (
                <blockquote key={idx} className="border-l-4 border-blue-200 pl-4 py-2 italic text-gray-600 text-sm">
                  "{q.quote}"
                  <cite className="block not-italic font-bold text-gray-900 mt-1">— {q.author}</cite>
                </blockquote>
              ))}
            </div>
          </Section>
        )}

        <div className="flex flex-wrap gap-4 pt-6 border-t">
          <button 
            onClick={handleCopy}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy Summary</span>
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Section sub-component properly typed as React.FC to handle children correctly in JSX
const Section: React.FC<{ title: string; children: React.ReactNode; highlight?: boolean }> = ({ title, children, highlight = false }) => (
  <div className={highlight ? 'bg-orange-50 -mx-6 px-6 py-6 border-y border-orange-100' : ''}>
    <h3 className={`text-xs font-black tracking-widest mb-4 uppercase ${highlight ? 'text-orange-600' : 'text-gray-400'}`}>
      {title}
    </h3>
    {children}
  </div>
);

// ActionItemRow sub-component properly typed as React.FC to handle key prop correctly in JSX
const ActionItemRow: React.FC<{ item: ActionItem }> = ({ item }) => (
  <div className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-sm border border-orange-200">
    <div className={`w-3 h-3 rounded-full ${item.priority === 'HIGH' ? 'bg-red-500' : item.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
    <div className="flex-grow">
      <p className="font-bold text-gray-900">{item.task}</p>
      <div className="flex items-center text-xs text-gray-500 space-x-3 mt-0.5">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {item.deadline}
        </span>
        {item.assigned_by && <span>By {item.assigned_by}</span>}
      </div>
    </div>
  </div>
);

export default SummaryDisplay;
