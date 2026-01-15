
import { GoogleGenAI, Type } from "@google/genai";
import { EmailSummary, SummaryStatus } from "./types";
import { SCHEMA_PROMPT } from "./constants";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeEmailThread = async (thread: string): Promise<EmailSummary> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Simplify contents part for single prompt
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
            type: Type.OBJECT,
            // Guideline says Type.OBJECT cannot be empty; additionalProperties is used for dynamic mapping
            additionalProperties: { type: Type.STRING }
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
        required: ["thread_title", "summary", "status", "key_decision"]
      }
    }
  });

  // response.text is a property, use directly
  const rawJson = JSON.parse(response.text || '{}');
  return {
    ...rawJson,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
};
