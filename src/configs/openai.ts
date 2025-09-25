import OpenAI from "openai";
const openaiModel = "gpt-4o";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const openAIChatCompletion = async (prompt: string)=>{

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2, // Lower temperature for more consistent analysis
    max_tokens: 1500, // More tokens for detailed comparison
  });
  // Clean the response by removing markdown code block formatting
  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) return null;
  
  const cleanedResponse = rawContent
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
    
  return cleanedResponse;
}
