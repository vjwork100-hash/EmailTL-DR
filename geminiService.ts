
import { GoogleGenAI, Type } from "@google/genai";
import { EmailSummary, SummaryStatus } from "./types";
import { SCHEMA_PROMPT } from "./constants";

export class EmailSmartError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = 'EmailSmartError';
  }
}

export const summarizeEmailThread = async (thread: string): Promise<EmailSummary> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
                  assigned_by: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] },
                  time_estimate: { type: Type.STRING }
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
                  status: { type: Type.STRING },
                  dependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
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
                  involvement_level: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                  status: { type: Type.STRING }
                },
                required: ["name", "role", "involvement_level"]
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
            key_quotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  author: { type: Type.STRING },
                  context: { type: Type.STRING }
                }
              }
            },
            next_steps: { type: Type.STRING },
            unresolved_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence_score: { type: Type.INTEGER },
            extraction_accuracy: { type: Type.ARRAY, items: { type: Type.STRING } },
            email_count: { type: Type.INTEGER },
            time_span: { type: Type.STRING },
            participant_count: { type: Type.INTEGER }
          },
          required: [
            "thread_title", 
            "summary", 
            "status", 
            "key_decision", 
            "stakeholders", 
            "confidence_score", 
            "email_count", 
            "time_span", 
            "your_action_items", 
            "others_action_items"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new EmailSmartError("AI returned an empty response.", "EMPTY_RESPONSE");
    
    const rawJson = JSON.parse(text);
    return {
      ...rawJson,
      your_action_items: rawJson.your_action_items || [],
      others_action_items: rawJson.others_action_items || [],
      stakeholders: rawJson.stakeholders || [],
      timeline: rawJson.timeline || [],
      key_quotes: rawJson.key_quotes || [],
      decision_reasoning: rawJson.decision_reasoning || [],
      unresolved_questions: rawJson.unresolved_questions || [],
      extraction_accuracy: rawJson.extraction_accuracy || [],
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      raw_thread: thread
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new EmailSmartError(error.message || "Failed to analyze thread.", "UNKNOWN");
  }
};
