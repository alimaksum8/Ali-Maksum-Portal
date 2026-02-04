
import { GoogleGenAI } from "@google/genai";

export const generatePortalGreeting = async (role: 'admin' | 'guest'): Promise<string> => {
  const apiKey = process.env.API_KEY;

  // Jika API Key tidak ada, langsung kembalikan pesan default agar aplikasi tidak error
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    console.warn("Gemini API_KEY belum dikonfigurasi. Menggunakan pesan standar.");
    return role === 'admin' 
      ? "Selamat datang di panel kendali Darul Huda Portal. Siap mengelola hari bahagia Anda?" 
      : "Selamat datang! Suatu kehormatan bagi kami atas kunjungan Anda di portal undangan ini.";
  }

  try {
    // Correctly initialize the GoogleGenAI instance with the API key from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Directly use ai.models.generateContent to query the model with specified name and prompt
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, sophisticated, and welcoming one-sentence greeting in Indonesian for a user entering the ${role} section of a premium digital portal called 'Darul Huda Portal'. Keep it professional yet warm and poetic.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    // Access the .text property directly (not as a method call) as per the latest SDK spec
    return response.text?.trim() || `Selamat datang di portal ${role}.`;
  } catch (error) {
    console.error("Gemini Greeting Error:", error);
    return role === 'admin' 
      ? "Sistem siap. Selamat bekerja di panel admin." 
      : "Terima kasih telah berkunjung ke undangan kami.";
  }
};
