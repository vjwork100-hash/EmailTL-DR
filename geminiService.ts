
import { GoogleGenAI, Type } from "@google/genai";
import { EmailSummary, SummaryStatus } from "./types";
import { SCHEMA_PROMPT, API_CONFIG, ERROR_MESSAGES } from "./constants";
import { trackEvent, ANALYTICS_EVENTS, trackError } from "./analytics";

export class EmailSmartError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = 'EmailSmartError';
  }
}

export const summarizeEmailThread = async (thread: string): Promise<EmailSummary> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  trackEvent(ANALYTICS_EVENTS.SUMMARIZE_CLICKED);
  
  try {
    const response = await ai.models.generateContent({
      model: API_CONFIG.GEMINI_MODEL,
      contents: thread,
      config: {
        systemInstruction: SCHEMA_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thread_title: { type: Type.STRING },
            summary: { type: Type.STRING },
            status: { type: Type.STRING, enum: Object.values(SummaryStatus) },
            key_decision: { type: Type.STRING },
            decision_reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            expected_outcome: { type: Type.STRING },
            decided_by: { type: Type.STRING },
            decided_at: { type: Type.STRING },
            budget: {
              type: Type.OBJECT,
              properties: {
                original_amount: { type: Type.STRING },
                approved_amount: { type: Type.STRING },
                currency: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            },
            your_action_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW'] },
                  status: { type: Type.STRING, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] }
                }
              }
            },
            others_action_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  status: { type: Type.STRING }
                }
              }
            },
            stakeholders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  involvement_level: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] }
                }
              }
            },
            confidence_score: { type: Type.INTEGER },
            email_count: { type: Type.INTEGER },
            time_span: { type: Type.STRING },
            participant_count: { type: Type.INTEGER }
          },
          required: ["thread_title", "summary", "status", "key_decision", "confidence_score"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new EmailSmartError(ERROR_MESSAGES.API_ERROR, "EMPTY_RESPONSE");
    
    const rawJson = JSON.parse(text);
    trackEvent(ANALYTICS_EVENTS.SUMMARIZE_COMPLETED);

    return {
      ...rawJson,
      your_action_items: rawJson.your_action_items || [],
      others_action_items: rawJson.others_action_items || [],
      stakeholders: rawJson.stakeholders || [],
      timeline: rawJson.timeline || [],
      decision_reasoning: rawJson.decision_reasoning || [],
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      raw_thread: thread
    };
  } catch (error: any) {
    trackError(error, 'GeminiService');
    throw new EmailSmartError(error.message || ERROR_MESSAGES.API_ERROR, "UNKNOWN");
  }
};
