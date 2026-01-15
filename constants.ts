
export const FREE_LIMIT = 2;

export const SAMPLE_THREADS = [
  {
    id: 'budget',
    label: '💰 Budget Approval',
    content: `From: sarah@company.com\nTo: team@company.com\nSubject: Q4 Campaign Budget - need approval\n\nHi team,\n\nWe need to finalize Q4 campaign budget by Friday. Proposed budget: $500k across channels (product launch, holiday promo, partner collab).\n\nLooking for feedback.\n\n---\n\nFrom: john@company.com\nTo: sarah@company.com\nSubject: RE: Q4 Campaign Budget - need approval\n\nSarah,\n\n$500k seems high given economic outlook. I'd suggest $350k instead. We should be more conservative.\n\nJohn\n\n---\n\nFrom: dave@company.com\nTo: sarah@company.com\nSubject: RE: Q4 Campaign Budget - DECISION\n\nYes, I'll get CEO approval for $400k (middle ground) by Friday EOD.`
  },
  {
    id: 'hiring',
    label: '🤝 Hiring Decision',
    content: `From: recruiter@tech.com\nTo: engineering-leads@tech.com\nSubject: Feedback: Alex for Senior Frontend Role\n\nHi all,\n\nAlex just finished the final round. Thoughts?\n\n---\n\nFrom: dev-lead@tech.com\nSubject: RE: Feedback: Alex\n\nSolid technical skills. React knowledge is top tier. A bit quiet on system design but overall a "Strong Hire" from me.\n\n---\n\nFrom: cto@tech.com\nSubject: RE: Feedback: Alex\n\nI agree. Let's make an offer. Sarah, please prep the package by Tuesday.`
  },
  {
    id: 'scheduling',
    label: '📅 Meeting Shuffle',
    content: `From: client@partner.com\nTo: account-mgr@agency.com\nSubject: Rescheduling our QBR\n\nHi, can we move Thursday's 2pm to Friday? Something came up.\n\n---\n\nFrom: account-mgr@agency.com\nSubject: RE: Rescheduling our QBR\n\nFriday morning at 10am works for our team. Does that work for you?\n\n---\n\nFrom: client@partner.com\nSubject: RE: Rescheduling our QBR\n\n10am is perfect. See you then.`
  }
];

export const SAMPLE_THREAD = SAMPLE_THREADS[0].content;

export const SCHEMA_PROMPT = `You are an expert email analyst. Your job is to extract and summarize critical information from email threads so busy professionals can understand what happened WITHOUT reading all emails.

Analyze the thread and identify key decisions, action items, stakeholders, and timeline. Output ONLY valid JSON.
Assume the user receiving this summary is the primary recipient.`;
