
import React from 'react';

const Deployment: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-700">
      <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl overflow-hidden relative mb-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-6">Deploy EmailSmart</h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Take your local MVP and scale it to millions. Follow these steps to set up your production environment.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold">Vercel Setup</h2>
          </div>
          <ul className="space-y-4 text-slate-600 text-sm">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-indigo-400">●</span>
              <span>Push your code to a GitHub repository.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-indigo-400">●</span>
              <span>Connect repository to Vercel via dashboard.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-indigo-400">●</span>
              <span>Add <code>API_KEY</code> environment variable with your Gemini Key.</span>
            </li>
          </ul>
          <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs overflow-x-auto">
            vercel env add API_KEY your_key_here
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">2</div>
            <h2 className="text-xl font-bold">Supabase Backend</h2>
          </div>
          <p className="text-slate-600 text-sm">To move beyond local storage, swap out the hooks in <code>App.tsx</code> for Supabase Client.</p>
          <ul className="space-y-4 text-slate-600 text-sm">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-emerald-400">●</span>
              <span>Create a <code>summaries</code> table with JSONB for storage.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-emerald-400">●</span>
              <span>Enable RLS (Row Level Security) so users only see their own data.</span>
            </li>
          </ul>
          <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs overflow-x-auto">
            npm install @supabase/supabase-js
          </div>
        </div>
      </div>

      <div className="mt-12 bg-indigo-600 p-8 rounded-3xl text-white text-center">
        <h3 className="text-xl font-bold mb-4">Ready for Production?</h3>
        <p className="text-indigo-100 text-sm mb-6 max-w-xl mx-auto">Get your Google Cloud Console API Key to start processing real-world data at scale.</p>
        <a href="https://ai.google.dev" className="inline-block px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl">Get API Key</a>
      </div>
    </div>
  );
};

export default Deployment;