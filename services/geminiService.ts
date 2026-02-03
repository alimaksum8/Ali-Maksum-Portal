
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePortalGreeting = async (role: 'admin' | 'guest'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, sophisticated, and welcoming one-sentence greeting for a user entering the ${role} section of a premium digital portal. Keep it professional yet warm.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text?.trim() || `Welcome to the ${role} portal.`;
  } catch (error) {
    console.error("Gemini Greeting Error:", error);
    return `Welcome to your personal ${role} workspace.`;
  }
};
