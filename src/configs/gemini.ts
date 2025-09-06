import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export const geminiChatCompletion = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // 👈 ensures JSON only
      },
    });

    const text = result.response.text();
    return text;
  } catch (error: any) {
    console.error("❌ Gemini API error:", error);
    return null;
  }
};
