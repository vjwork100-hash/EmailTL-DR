
export enum SummaryStatus {
  DECISION_MADE = 'DECISION_MADE',
  PENDING_DECISION = 'PENDING_DECISION',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  FYI = 'FYI',
  BLOCKED = 'BLOCKED'
}

export interface ActionItem {
  task: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_by?: string;
  owner?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  owner_role?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface KeyQuote {
  quote: string;
  author: string;
}

export interface EmailSummary {
  id: string;
  thread_title: string;
  summary: string;
  status: SummaryStatus;
  key_decision: string;
  decision_reasoning: string[];
  your_action_items: ActionItem[];
  others_action_items: ActionItem[];
  stakeholders: Record<string, string>;
  timeline: TimelineEvent[];
  key_quotes: KeyQuote[];
  next_steps: string;
  unresolved_questions: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  created_at: string;
  raw_thread?: string;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'pro';
  summaries_used: number;
}
