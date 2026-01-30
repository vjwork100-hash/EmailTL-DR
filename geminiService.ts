
import { GoogleGenAI, Type } from "@google/genai";
import { EmailSummary, SummaryStatus } from "./types.ts";
import { SCHEMA_PROMPT, API_CONFIG, ERROR_MESSAGES } from "./constants.ts";
import { trackEvent, ANALYTICS_EVENTS, trackError } from "./analytics.ts";

export class EmailSmartError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = 'EmailSmartError';
  }
}

// Fixed to align with the latest Google GenAI SDK guidelines
export const summarizeEmailThread = async (thread: string): Promise<EmailSummary> => {
  // Always initialize a new GoogleGenAI instance right before the call to ensure up-to-date configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  trackEvent(ANALYTICS_EVENTS.SUMMARIZE_CLICKED);
  
  try {
    const response = await ai.models.generateContent({
      model: API_CONFIG.GEMINI_MODEL,
      contents: thread,
      config: {
        systemInstruction: SCHEMA_PROMPT,
        responseMimeType: "application/json",
        // Added thinkingBudget to allow for deep reasoning on complex business threads
        thinkingConfig: { thinkingBudget: 4096 },
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
            next_steps: { type: Type.STRING },
            unresolved_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            extraction_accuracy: { type: Type.ARRAY, items: { type: Type.STRING } },
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
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  event: { type: Type.STRING },
                  is_pending: { type: Type.BOOLEAN }
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

    // Access text property directly (it's a property, not a method)
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
      unresolved_questions: rawJson.unresolved_questions || [],
      extraction_accuracy: rawJson.extraction_accuracy || [],
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      raw_thread: thread
    };
  } catch (error: any) {
    trackError(error, 'GeminiService');
    const msg = error.message || "";
    if (msg.includes("429") || msg.includes("quota")) {
      throw new EmailSmartError("Quota exceeded. Please select a paid API key.", "QUOTA_EXHAUSTED");
    }
    // Specific check for entity not found which relates to API key availability issues
    if (msg.includes("not found")) {
      throw new EmailSmartError("API Key mismatch. Please re-select.", "ENTITY_NOT_FOUND");
    }
    throw new EmailSmartError(error.message || ERROR_MESSAGES.API_ERROR, "UNKNOWN");
  }
};
