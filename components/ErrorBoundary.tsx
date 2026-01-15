
import React, { ReactNode } from 'react';
import { trackError } from '../analytics';

// Fix: Made children optional to satisfy JSX usage when the compiler is strict about Prop types
interface Props { children?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

// Fix: Explicitly declaring state and ensuring inheritance from React.Component works with the compiler
export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Property 'state' declaration addresses errors on line 11 and 23
  public state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
    // Initial state is set via class property initialization above
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    trackError(error, 'GlobalErrorBoundary');
  }

  render() {
    // Fix: Accessing this.state is now safe as it's declared in the class
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border border-rose-200">
            <div className="bg-rose-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Unexpected Shutdown</h2>
            <p className="text-slate-500 mb-6 font-medium">EmailSmart encountered a critical state error. Your data is safe in local storage.</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Re-initialize Workspace
            </button>
          </div>
        </div>
      );
    }
    // Fix: Accessing this.props is now recognized by the compiler after property initialization fixes
    return this.props.children;
  }
}

export default ErrorBoundary;
