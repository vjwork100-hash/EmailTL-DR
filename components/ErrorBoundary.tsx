import React, { Component, ErrorInfo, ReactNode } from 'react';
import { trackError } from '../analytics.ts';

// Proper interfaces for component props and state to ensure type safety for children and error state
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component that catches runtime errors in child components.
 * Extending Component directly ensures that 'props' and 'state' are correctly typed.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  /**
   * Standard getDerivedStateFromError implementation to update state on error.
   * This is a static method as per React documentation for Error Boundaries.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Using ErrorInfo from React and tracking error in analytics for debugging.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackError(error, 'GlobalErrorBoundary');
  }

  render() {
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

    return this.props.children;
  }
}

export default ErrorBoundary;