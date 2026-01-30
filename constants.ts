
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
    id: 'product-pivot',
    label: '🚀 Product Pivot',
    content: `From: alex.pm@techcorp.io\nTo: eng-leads@techcorp.io, marketing@techcorp.io\nSubject: URGENT: Q3 Roadmap Adjustment - Mobile First?\n\nHi team,\n\nUser metrics from the beta show 82% of engagement is on mobile, but our desktop features are taking 70% of dev time. I propose we halt the "Desktop Pro" dashboard and shift all resources to the Mobile App for the Sept 15 launch.\n\n---\n\nFrom: sarah.eng@techcorp.io\nTo: alex.pm@techcorp.io\nSubject: RE: URGENT: Q3 Roadmap Adjustment\n\nAlex, halting Desktop Pro now means throwing away 4 weeks of work. John and the backend team already finished the API. If we shift, we need to redesign the mobile auth flow. Sept 15 is too tight. Oct 1 is more realistic.\n\n---\n\nFrom: mark.marketing@techcorp.io\nTo: alex.pm@techcorp.io, sarah.eng@techcorp.io\nSubject: RE: URGENT: Q3 Roadmap Adjustment\n\nWe already committed to the Sept 15 launch with our ad partners. A delay to Oct 1 will cost us $45k in non-refundable deposits. Can we do a "Lite" mobile release on the 15th?\n\n---\n\nFrom: alex.pm@techcorp.io\nTo: all\nSubject: DECISION: Mobile Lite Launch\n\nOkay, decision made: Sept 15 launch of Mobile Lite. Sarah, focus the team on Auth and Core Feed only. Oct 15 will be the full V2. Marketing, keep the Sept 15 date but change messaging to "Early Access".\n\nSarah, I need a revised sprint plan by Thursday. Mark, confirm the ad copy change by Friday.`
  },
  {
    id: 'hiring-plan',
    label: '🤝 2025 Hiring',
    content: `From: hr.director@global.co\nTo: leadership@global.co\nSubject: 2025 Engineering & Sales Headcount Request\n\nHi team, we've analyzed the growth targets for next year. We are requesting 5 new Backend Engineers and 3 Account Executives. Total estimated payroll impact: $1.4M.\n\n---\n\nFrom: cto@global.co\nTo: hr.director@global.co\nSubject: RE: 2025 Hiring Request\n\nI need at least 1 Senior DevOps in that mix. We can sacrifice one Backend role for a DevOps lead. Is the budget flexible?\n\n---\n\nFrom: cfo@global.co\nTo: all\nSubject: Financial Constraints\n\nWe can only approve $1.2M total for new headcount. Please revise. If we hire DevOps, we must delay the Sales hires until Q2.\n\n---\n\nFrom: ceo@global.co\nTo: all\nSubject: FINAL DECISION: Hiring Plan\n\nApproved at $1.2M. The mix will be: 4 Backend Engineers, 1 Senior DevOps, and 2 Sales AEs starting in Jan. HR, please post the DevOps role immediately. CTO, finalize the job descriptions by end of week.`
  },
  {
    id: 'meeting-reschedule',
    label: '📅 Global Sync',
    content: `From: admin@ny-office.com\nTo: team-leads@global.com\nSubject: Board Meeting Reschedule - Conflict in London\n\nHi everyone, the Monday 9 AM GMT slot is no longer working for the London team due to the transport strike. Can we move to Tuesday 4 PM GMT?\n\n---\n\nFrom: kenji.tokyo@global.com\nTo: admin@ny-office.com\nSubject: RE: Board Meeting Reschedule\n\nTuesday 4 PM GMT is 1 AM in Tokyo. I cannot make that. Can we do Wednesday 1 PM GMT? That covers NY, London, and Tokyo reasonably.\n\n---\n\nFrom: director.ny@global.com\nTo: all\nSubject: RE: Board Meeting Reschedule\n\nWednesday 1 PM GMT works for New York. Admin, please update the invite. Also, make sure the Q3 deck is uploaded to the portal before we start.`
  },
  {
    id: 'security-breach',
    label: '🛡️ Security Crisis',
    content: `From: security-alert@internal.net\nTo: ops-team@company.com, cto@company.com\nSubject: CRITICAL: Potential Data Leak - Server 04\n\nLogs show an unauthorized IP (45.xx.xx.9) accessed the customer_meta table at 02:00 UTC.\n\n---\n\nFrom: kim.ops@company.com\nTo: all\nSubject: RE: CRITICAL: Potential Data Leak\n\nI have isolated Server 04. Rotating all DB credentials now. Steve, check the auth logs for compromised tokens. We need to know if any PII was exported.\n\n---\n\nFrom: steve.dev@company.com\nTo: kim.ops@company.com\nSubject: RE: CRITICAL: Potential Data Leak\n\nPII was NOT accessed, but encrypted email addresses were. Approx 12,000 records. We need to decide if we trigger a full notification to users.\n\n---\n\nFrom: linda.legal@company.com\nTo: all\nSubject: Legal Guidance\n\nUnder our terms, we must notify within 72 hours. Kim, get me a final count of affected users by 5 PM today. CTO, please draft the disclosure email for CEO review by tomorrow morning.`
  },
  {
    id: 'office-move',
    label: '🏢 HQ Relocation',
    content: `From: facility.manager@firm.com\nTo: leadership@firm.com\nSubject: New Office Selection - Final 2 Options\n\nOption A: Downtown (12k sqft, $40/sqft)\nOption B: Suburban (20k sqft, $25/sqft)\n\n---\n\nFrom: elena.cfo@firm.com\nTo: facility.manager@firm.com\nSubject: RE: New Office Selection\n\nOur current budget is capped at $450k/year for rent. Option A fits the budget but is tight on space. Option B is over budget ($500k) but allows for the 2025 growth plan.\n\n---\n\nFrom: robert.ceo@firm.com\nTo: all\nSubject: RE: New Office Selection\n\nLet's go with Option B. I'll authorize the extra $50k from the "Operations Reserve" fund. We need the space for the new engineering hires.\n\n---\n\nFrom: facility.manager@firm.com\nTo: all\nSubject: DECISION & NEXT STEPS\n\nOption B approved. Signing the lease on Monday. Tom, start the furniture audit. Elena, please wire the security deposit ($100k) by Wednesday. Move date set for Oct 1.`
  },
  {
    id: 'partner-summit',
    label: '🤝 Partner Summit',
    content: `From: grace.events@global.com\nTo: sales-leads@global.com, design@global.com\nSubject: Partner Summit 2025 - Venue & Swag\n\nWe are down to Vegas or Lisbon for Feb 2025. Costs are similar. Thoughts?\n\n---\n\nFrom: bob.sales@global.com\nTo: grace.events@global.com\nSubject: RE: Partner Summit 2025\n\nLisbon is better for our EMEA partners. Vegas is easier for the US team. However, Lisbon is 20% cheaper for catering. \n\n---\n\nFrom: chloe.design@global.com\nTo: grace.events@global.com\nSubject: Swag Deadlines\n\nRegardless of venue, I need the final attendee count by Dec 1 to order the custom jackets. Last year we over-ordered by 200 units ($10k waste).\n\n---\n\nFrom: grace.events@global.com\nTo: all\nSubject: DECISION: Lisbon 2025\n\nWe are going with Lisbon. Bob, get the sales team to confirm their VIP guest list by Nov 15. Chloe, jackets are approved but limited to 500 units max.`
  },
  {
    id: 'series-b-audit',
    label: '📊 Series B Audit',
    content: `From: founder@startup.io\nTo: legal-team@startup.io, finance@startup.io\nSubject: Due Diligence Checklist - Series B\n\nInvestors are asking for the IP assignment docs and a 3-year revenue forecast by EOW.\n\n---\n\nFrom: rachel.legal@startup.io\nTo: founder@startup.io\nSubject: IP Docs status\n\nFound all but 2 contracts from the early 2022 contractors. We need them signed to close the round. I'm reaching out to them today.\n\n---\n\nFrom: sam.finance@startup.io\nTo: founder@startup.io\nSubject: Revenue Forecast\n\nI have the model ready but it assumes the "Enterprise Sync" product launches in Q4. If that slips, the forecast drops by 30%. \n\n---\n\nFrom: founder@startup.io\nTo: all\nSubject: RE: Due Diligence Checklist\n\nRachel, keep me updated on those 2 contracts. Sam, use the "Conservative" forecast for the data room. We will present the "Aggressive" one in person. Sam, upload the final PDF to the Dropbox by Thursday 9 AM.`
  }
];

// Upgraded to gemini-3-pro-preview for complex reasoning tasks
export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-3-pro-preview',
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
