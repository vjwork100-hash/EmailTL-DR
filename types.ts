
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
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  assigned_by?: string;
  owner?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  owner_role?: string;
  time_estimate?: string;
  dependencies?: string[];
}

export interface TimelineEvent {
  date: string;
  time?: string;
  event: string;
  is_pending?: boolean;
}

export interface KeyQuote {
  quote: string;
  author: string;
  context: string;
}

export interface Stakeholder {
  name: string;
  role: string;
  involvement_level: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
}

export interface BudgetDetail {
  original_amount?: string;
  approved_amount?: string;
  currency?: string;
  category?: string;
}

export interface EmailSummary {
  id: string;
  thread_title: string;
  summary: string;
  status: SummaryStatus;
  key_decision: string;
  decision_reasoning: string[];
  expected_outcome: string;
  decided_by: string;
  decided_at: string;
  budget?: BudgetDetail;
  your_action_items: ActionItem[];
  others_action_items: ActionItem[];
  stakeholders: Stakeholder[];
  timeline: TimelineEvent[];
  key_quotes: KeyQuote[];
  next_steps: string;
  unresolved_questions: string[];
  confidence_score: number; // 0-100
  extraction_accuracy: string[]; // List of things extracted correctly
  email_count: number;
  time_span: string;
  participant_count: number;
  created_at: string;
  rating?: 'up' | 'down' | 'middle' | null;
  is_public?: boolean;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'pro';
  summaries_used: number;
}
