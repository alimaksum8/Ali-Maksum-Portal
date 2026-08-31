import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const greetingCache: Record<string, { text: string; timestamp: number }> = {};
  const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

  // API route for generating welcoming greetings securely using Gemini
  app.post("/api/greeting", async (req, res) => {
    const { role } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Check cache first
    if (greetingCache[role] && (Date.now() - greetingCache[role].timestamp < CACHE_TTL)) {
      return res.json({ greeting: greetingCache[role].text });
    }

    if (!apiKey || apiKey.trim() === "") {
      const fallback = role === 'admin'
        ? "Selamat datang di panel kendali Darul Huda Portal. Siap mengelola hari bahagia Anda?"
        : "Selamat datang! Suatu kehormatan bagi kami atas kunjungan Anda di portal undangan ini.";
      return res.json({ greeting: fallback });
    }

    try {
      // Initialize the modern GoogleGenAI client with standard User-Agent header
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Call Gemini for Indonesian greeting generation
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Generate a short, sophisticated, and welcoming one-sentence greeting in Indonesian for a user entering the ${role} section of a premium digital portal called 'Darul Huda Portal'. Keep it professional yet warm and poetic.`,
        config: {
          temperature: 0.8,
          topP: 0.9,
        }
      });

      const greeting = response.text?.trim() || `Selamat datang di portal ${role}.`;
      
      // Store in cache
      greetingCache[role] = { text: greeting, timestamp: Date.now() };
      
      res.json({ greeting });
    } catch (error: any) {
      // Graceful fallback without noisy logs for quota issues
      const isQuotaError = error?.message?.includes("quota") || error?.message?.includes("429");
      
      if (!isQuotaError) {
        console.error("Gemini API error:", error);
      }

      const fallback = role === 'admin'
        ? "Sistem siap. Selamat bekerja di panel admin."
        : "Terima kasih telah berkunjung ke undangan kami.";
      
      res.json({ greeting: fallback });
    }
  });

  // Serve front-end assets with Vite middleware in dev or as static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Darul Huda Portal] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
