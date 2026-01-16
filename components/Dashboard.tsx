
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmailSummary, User } from '../types';
import { SAMPLE_THREADS, FREE_LIMIT } from '../constants';
import { summarizeEmailThread, EmailSmartError } from '../geminiService';
import { validateEmailThread } from '../services/validationService';

interface DashboardProps {
  summaries: EmailSummary[];
  onDelete: (id: string) => void;
  onAddSummary: (s: EmailSummary) => void;
  user?: User | null;
}

// Extend Window interface for AI Studio tools
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

type FilterStatus = 'ALL' | 'URGENT' | 'PENDING' | 'SNOOZED' | 'RESOLVED' | 'INFO';

const Dashboard: React.FC<DashboardProps> = ({ summaries, onDelete, onAddSummary, user }) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, code?: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

  const handleSummarize = async () => {
    const validation = validateEmailThread(thread);
    if (!validation.isValid) {
      setError({ message: validation.error || 'Invalid thread.' });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const summary = await summarizeEmailThread(thread);
      onAddSummary(summary);
      setThread('');
      setShowAnalyzer(false);
    } catch (err: any) {
      if (err instanceof EmailSmartError) {
        setError({ message: err.message, code: err.code });
      } else {
        setError({ message: err.message || 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Proceeding directly after trigger as per race condition guidelines
      setError(null);
      if (thread) {
        handleSummarize();
      }
    } catch (err) {
      console.error("Failed to open key selection", err);
    }
  };

  const getCardStatus = (summary: EmailSummary) => {
    const allActions = [...(summary.your_action_items || []), ...(summary.others_action_items || [])];
    if (allActions.length === 0) return { id: 'INFO', label: 'Informational', color: 'bg-slate-100 text-slate-500', icon: 'ℹ️' };

    const pending = allActions.filter(a => a.status !== 'COMPLETED');
    if (pending.length === 0) return { id: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-50 text-emerald-600 border-emerald-