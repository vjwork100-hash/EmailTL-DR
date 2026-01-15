
export const FREE_LIMIT = 2;

export const SCHEMA_PROMPT = `You are an elite email analyst specializing in business intelligence extraction.

Your task: Parse complex email threads and extract structured intelligence.

Instructions:
1. Read all emails in chronological order.
2. Identify the primary decision (if any).
3. Extract ALL action items (yours and others).
4. Map stakeholders and their roles.
5. Build a timeline of events.
6. Find key quotes that matter.
7. Calculate confidence score (0-100) based on clarity.

For action items:
- Identify owner, task, deadline, and priority (URGENT, HIGH, NORMAL, LOW).
- "John should do X" = Owner: John, Task: X.
- "We need to X by Friday" = Deadline: Friday, Task: X.

Output only valid JSON.`;

export const SAMPLE_THREADS = [
  {
    id: 'budget-q4',
    label: '💰 Q4 Budget',
    content: `From: sarah@company.com\nTo: team@company.com\nSubject: Q4 Campaign Budget - need approval\n\nHi team,\n\nWe need to finalize Q4 campaign budget by Friday. Proposed budget: $500k across channels.\n\n---\n\nFrom: dave@company.com\nTo: sarah@company.com\nSubject: RE: Q4 Campaign Budget - DECISION\n\nSarah, approved at $425k. Dave, handle CEO approval by Friday. John, update the forecast.`
  },
  {
    id: 'hiring-plan',
    label: '🤝 Hiring',
    content: `From: hr@company.com\nTo: leadership@company.com\nSubject: 2025 Hiring Plan\n\nHi team, we need to approve headcount. Engineering +5, Sales +3.\n\n---\n\nFrom: cfo@company.com\nSubject: RE: 2025 Hiring Plan\n\nCash runway supports $1.5M total. Approved.`
  }
];

export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-3-flash-preview',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
  MAX_EMAIL_LENGTH: 100000,
  MIN_EMAIL_LENGTH: 10
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL_LENGTH: 'Email thread must be between 10 and 100,000 characters.',
  INVALID_EMAIL_FORMAT: 'Please paste a valid email thread with headers.',
  API_TIMEOUT: 'Analysis is taking too long. Please try again.',
  API_ERROR: 'Failed to analyze thread. Please try a different email.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.'
};

export const STORAGE_KEYS = {
  USER: 'email_smart_user',
  SUMMARIES: 'email_smart_summaries',
  ANON_COUNT: 'email_smart_anon_count',
  PREFERENCES: 'email_smart_preferences'
};
