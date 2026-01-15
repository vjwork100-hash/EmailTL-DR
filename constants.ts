
export const FREE_LIMIT = 2;

export const SAMPLE_THREAD = `From: sarah@company.com
To: team@company.com
Subject: Q4 Campaign Budget - need approval

Hi team,

We need to finalize Q4 campaign budget by Friday. Proposed budget: $500k across 
channels (product launch, holiday promo, partner collab).

Looking for feedback.

---

From: john@company.com
To: sarah@company.com
Subject: RE: Q4 Campaign Budget - need approval

Sarah,

$500k seems high given economic outlook. I'd suggest $350k instead. We should be 
more conservative.

John

---

From: dave@company.com
To: sarah@company.com
Subject: RE: Q4 Campaign Budget - DECISION

Yes, I'll get CEO approval by Friday EOD.
`;

export const SCHEMA_PROMPT = `You are an expert email analyst. Your job is to extract and summarize critical information from email threads so busy professionals can understand what happened WITHOUT reading all emails.

Analyze the thread and identify key decisions, action items, stakeholders, and timeline. Output ONLY valid JSON.
Assume the user receiving this summary is the primary recipient.`;
