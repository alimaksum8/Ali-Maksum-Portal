import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for generating welcoming greetings securely using Gemini
  app.post("/api/greeting", async (req, res) => {
    const { role } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured.");
      return res.json({
        greeting: role === 'admin'
          ? "Selamat datang di panel kendali Darul Huda Portal. Siap mengelola hari bahagia Anda?"
          : "Selamat datang! Suatu kehormatan bagi kami atas kunjungan Anda di portal undangan ini."
      });
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

      // Call Gemini 3.7 Flash for Indonesian greeting generation
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Generate a short, sophisticated, and welcoming one-sentence greeting in Indonesian for a user entering the ${role} section of a premium digital portal called 'Darul Huda Portal'. Keep it professional yet warm and poetic.`,
        config: {
          temperature: 0.8,
          topP: 0.9,
        }
      });

      const greeting = response.text?.trim() || `Selamat datang di portal ${role}.`;
      res.json({ greeting });
    } catch (error) {
      console.error("Gemini server-side greeting error:", error);
      res.json({
        greeting: role === 'admin'
          ? "Sistem siap. Selamat bekerja di panel admin."
          : "Terima kasih telah berkunjung ke undangan kami."
      });
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
