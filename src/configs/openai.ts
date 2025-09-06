import OpenAI from "openai";
const openaiModel = "gpt-5";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const openAIChatCompletion = async (prompt: string)=>{

  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2, // Lower temperature for more consistent analysis
    max_tokens: 1500, // More tokens for detailed comparison
  });

  return completion.choices[0].message?.content
}