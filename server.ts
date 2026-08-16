import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Tutor Explain and Coach
  app.post("/api/ai/ask-tutor", async (req, res) => {
    try {
      const { prompt, studentName, studentClass, currentQuestion, context } = req.body;

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          reply: `Chào em ${studentName || "học sinh"}! Thầy/Cô Gia sư Tiếng Việt Lớp 4 (Trần Thị Phượng - AI) luôn sẵn sàng đồng hành cùng em. Hãy đọc kỹ lại nội dung bài học trong SGK Tiếng Việt 4 tập 2 và phần Ghi nhớ để làm bài thật tốt nhé!`
        });
      }

      const systemInstruction = `Bạn là "Gia sư Tiếng Việt Lớp 4" (sản phẩm của tác giả Trần Thị Phượng - AI), một gia sư tận tâm, ân cần, yêu thương trẻ nhỏ, chuyên giảng dạy chương trình Tiếng Việt 4 Tập 2 (Bộ sách Kết nối tri thức với cuộc sống).
Nhiệm vụ của bạn là giải thích ngắn gọn, dễ hiểu, chuẩn xác theo phương pháp sư phạm tiểu học, khích lệ học sinh tự tin tư duy.
Học sinh đang hỏi bạn: Tên: ${studentName || "Em học sinh"}, Lớp: ${studentClass || "Lớp 4"}.
Thông tin câu hỏi hiện tại (nếu có): ${JSON.stringify(currentQuestion || {})}
Bối cảnh kiến thức: ${context || "Tiếng Việt 4 Tập 2"}
Hãy trả lời thân thiện bằng tiếng Việt, xưng "thầy/cô" và gọi em là "em" hoặc tên em. Dùng cách giải thích trực quan, sinh động.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt || "Hãy giải thích chi tiết câu hỏi này giúp em.",
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({
        reply: response.text || "Em hãy nhớ đọc kĩ yêu cầu đề bài và xem lại phần Ghi nhớ trong sách giáo khoa nhé!"
      });
    } catch (error: any) {
      console.error("AI Tutor Error:", error);
      res.status(500).json({ error: "Lỗi kết nối gia sư AI. Vui lòng thử lại!" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "GIA SƯ TIẾNG VIỆT LỚP 4", author: "Trần Thị Phượng - AI" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gia sư Tiếng Việt Lớp 4 server running on http://localhost:${PORT}`);
  });
}

startServer();
