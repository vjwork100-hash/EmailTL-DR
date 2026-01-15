
export const FREE_LIMIT = 2;

export const SAMPLE_THREADS = [
  {
    id: 'budget',
    label: '💰 Budget Approval',
    content: `From: sarah@company.com\nTo: team@company.com\nDate: Oct 12, 10:00 AM\nSubject: Q4 Campaign Budget - need approval\n\nHi team,\n\nWe need to finalize Q4 campaign budget by Friday. Proposed budget: $500,000 across channels (product launch, holiday promo, partner collab).\n\nLooking for feedback.\n\n---\n\nFrom: john@company.com\nTo: sarah@company.com\nDate: Oct 12, 2:30 PM\nSubject: RE: Q4 Campaign Budget - need approval\n\nSarah,\n\n$500k seems high given economic outlook. I'd suggest $350k instead. We should be more conservative.\n\nJohn\n\n---\n\nFrom: dave@company.com\nTo: sarah@company.com\nDate: Oct 13, 9:15 AM\nSubject: RE: Q4 Campaign Budget - DECISION\n\nYes, I've reviewed the numbers. I'll get CEO approval for $400k (middle ground) by Friday EOD. This should provide enough ROI for the product launch while staying lean.`
  },
  {
    id: 'hiring',
    label: '🤝 Hiring Decision',
    content: `From: recruiter@tech.com\nTo: engineering-leads@tech.com\nDate: Nov 5, 11:00 AM\nSubject: Feedback: Alex for Senior Frontend Role\n\nHi all,\n\nAlex just finished the final round. Thoughts?\n\n---\n\nFrom: dev-lead@tech.com\nDate: Nov 5, 1:45 PM\nSubject: RE: Feedback: Alex\n\nSolid technical skills. React knowledge is top tier. A bit quiet on system design but overall a "Strong Hire" from me.\n\n---\n\nFrom: cto@tech.com\nDate: Nov 6, 8:00 AM\nSubject: RE: Feedback: Alex\n\nI agree. Let's make an offer. Sarah, please prep the package by Tuesday. We need him starting by the 1st.`
  },
  {
    id: 'scheduling',
    label: '📅 Meeting Shuffle',
    content: `From: client@partner.com\nTo: account-mgr@agency.com\nDate: Jan 20, 3:00 PM\nSubject: Rescheduling our QBR\n\nHi, can we move Thursday's 2pm to Friday? Something came up.\n\n---\n\nFrom: account-mgr@agency.com\nDate: Jan 20, 3:45 PM\nSubject: RE: Rescheduling our QBR\n\nFriday morning at 10am works for our team. Does that work for you?\n\n---\n\nFrom: client@partner.com\nDate: Jan 21, 9:00 AM\nSubject: RE: Rescheduling our QBR\n\n10am is perfect. See you then.`
  }
];

export const SCHEMA_PROMPT = `You are a world-class Executive Intelligence Analyst. Your task is to transform messy email threads into high-density intelligence reports.

CRITICAL EXTRACTION RULES:
1. Identify the core DECISION: What was agreed upon? Who decided it? When?
2. Distinguish OWNERSHIP: Clearly identify tasks for "you" (the recipient/user) vs "others".
3. Financials: If money is mentioned, extract original vs approved amounts.
4. Timeline: Create a sequential flow of events.
5. Confidence: Estimate how certain you are of the summary (0-100) and list specific accurate points.
6. Stats: Count emails, participants, and determine the time span of the conversation.

Output ONLY valid JSON matching the provided schema. Assume the user is 'You'. Use professional, sharp, and concise language.`;
