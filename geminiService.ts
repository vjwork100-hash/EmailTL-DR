
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
            status: { 
              type: Type.STRING, 
              enum: Object.values(SummaryStatus) 
            },
            key_decision: { type: Type.STRING },
            decision_reasoning: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            your_action_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  assigned_by: { type: Type.STRING }
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
                  status: { type: Type.STRING },
                  owner_role: { type: Type.STRING }
                }
              }
            },
            stakeholders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING }
                },
                required: ["name", "role"]
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  event: { type: Type.STRING }
                }
              }
            },
            key_quotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  author: { type: Type.STRING }
                }
              }
            },
            next_steps: { type: Type.STRING },
            unresolved_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            confidence: { type: Type.STRING }
          },
          required: ["thread_title", "summary", "status", "key_decision", "stakeholders"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new EmailSmartError("AI returned an empty response. The thread might be too short or complex.", "EMPTY_RESPONSE");
    
    const rawJson = JSON.parse(text);
    return {
      ...rawJson,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("Gemini Error Details:", error);
    
    if (error?.message?.includes("429")) {
      throw new EmailSmartError("AI is currently busy (Rate limit exceeded). Please wait a moment and try again.", "RATE_LIMIT");
    }
    if (error?.message?.includes("safety")) {
      throw new EmailSmartError("This thread was flagged by safety filters. We cannot summarize sensitive or restricted content.", "SAFETY_BLOCK");
    }
    if (error?.message?.includes("context window")) {
      throw new EmailSmartError("This email thread is too long for the current AI model. Try splitting it into smaller parts.", "CONTEXT_OVERFLOW");
    }
    
    throw new EmailSmartError(error.message || "An unexpected error occurred while analyzing your email.", "UNKNOWN");
  }
};