import { geminiChatCompletion } from "../configs/gemini";
import { openAIChatCompletion } from "../configs/openai";
import pdfParse from "pdf-parse";

const aiAgent = async (prompt: string) => {
  // AI Agent Change
  // return await geminiChatCompletion(prompt);
  return await openAIChatCompletion(prompt)
};
export async function getCardRecommendation(
  amount: number,
  platform: string,
  category: string,
  transactionMode: string,
  cards: string[]
): Promise<string> {
  const prompt = `
    You are a credit card recommendation engine.

    The user has the following credit cards: ${cards.join(", ")}.
    They are going to spend ₹${amount} on "${platform}" in the category "${category}" in ${transactionMode} mode.
    Your job is to select the best credit card from the user's wallet to maximize cashback, points, or discounts based on real or commonly known Indian credit card reward programs.
    Respond ONLY with a valid JSON object in this **exact format**:
    {
      "card": "Card Name",
      "savings": "₹XXX",
      "reason": "Explain why this card is best in one sentence"
    }
    Do not include any text, explanation, markdown, or comments outside the JSON object. Only output valid JSON.
    `;

  return (await aiAgent(prompt)) || "No recommendation found.";
}

export async function extractStatementDataFromPdf(
  pdfBuffer: Buffer
): Promise<string> {
  const parsed = await pdfParse(pdfBuffer);
  const pdfText = parsed.text;

  const prompt = `
    You are a financial assistant. Extract the following structured information from the credit card statement text:

    - card_holder_name
    - card_number_last4
    - statement_period: { from: string, to: string }
    - total_due
    - minimum_due
    - due_date
    - transactions: [{ date, description, amount }]
    - reward_points_earned
    - reward_points_redeemed
    - total_spent
    - category_breakdown: { category: string, amount: number }[]

    Statement Text:
    ${pdfText}

    Return as JSON.
  `;

  return (await aiAgent(prompt)) || "No data extracted.";
}

export const getRecommendedFunds = async (
  investmentGoal: string,
  investmentHorizon: string,
  riskTolerance: string,
  investmentAmount: string,
  category: string
) => {
  const prompt = `
    Generate 3 Indian mutual fund recommendations for:
    Goal: ${investmentGoal}, Horizon: ${investmentHorizon}, Risk: ${riskTolerance}, Amount: ₹${investmentAmount}${
    category ? `, Category: ${category}` : ""
  }

    Return JSON only:
    {
      "recommendedFunds": [
        {
          "id": "fund_001",
          "name": "Fund Name",
          "fundHouse": "Fund House",
          "category": "Equity",
          "subCategory": "Large Cap",
          "riskLevel": "${riskTolerance}",
          "rating": 4.2,
          "expenseRatio": 1.85,
          "nav": 125.45,
          "returns": {"1Y": 18.5, "3Y": 22.3, "5Y": 19.8},
          "aum": 25000,
          "minInvestment": 500,
          "description": "Brief description",
          "isActive": true,
          "reason": "Why suitable for this user"
        }
      ],
      "reasoning": "Brief strategy explanation"
    }
  `;

  console.log("Starting AI recommendation...");

  const aiResponse = await aiAgent(prompt);
  console.log("AI Response received:", aiResponse?.substring(0, 100) + "...");

  if (!aiResponse) {
    throw new Error("No response from AI");
  }

  // Parse AI response
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(aiResponse);
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    throw new Error("Invalid AI response format");
  }

  // Validate response structure
  if (
    !parsedResponse.recommendedFunds ||
    !Array.isArray(parsedResponse.recommendedFunds)
  ) {
    throw new Error("Invalid AI response structure");
  }

  // Ensure we have at least some recommendations
  if (parsedResponse.recommendedFunds.length === 0) {
    throw new Error("No recommendations generated");
  }

  return {
    recommendedFunds: parsedResponse.recommendedFunds,
    reasoning:
      parsedResponse.reasoning ||
      "Personalized recommendations based on your profile.",
  };
};

export const getFundComparison = async (funds: any[]) => {
  const prompt = `
    You are a financial analyst specializing in Indian mutual fund analysis. Compare the following ${
      funds.length
    } mutual funds and provide a comprehensive comparison analysis.

    Funds to compare:
    ${funds
      .map(
        (fund, index) => `
    Fund ${index + 1}: ${fund.name}
    - Fund House: ${fund.fundHouse}
    - Category: ${fund.category}
    - Sub-Category: ${fund.subCategory}
    - Risk Level: ${fund.riskLevel}
    - Rating: ${fund.rating}/5
    - Expense Ratio: ${fund.expenseRatio}%
    - NAV: ₹${fund.nav}
    - Returns: 1Y: ${fund.returns["1Y"]}%, 3Y: ${fund.returns["3Y"]}%, 5Y: ${
          fund.returns["5Y"]
        }%
    - AUM: ₹${fund.aum} crores
    - Min Investment: ₹${fund.minInvestment}
    - Description: ${fund.description}
    `
      )
      .join("")}

    Provide a comprehensive comparison in this exact JSON format:
    {
      "comparison": {
        "performance": {
          "best1Year": "${funds[0]?.name || "Fund 1"}",
          "best3Year": "${funds[0]?.name || "Fund 1"}", 
          "best5Year": "${funds[0]?.name || "Fund 1"}",
          "analysis": "Detailed performance comparison analysis based on 1Y, 3Y, and 5Y returns"
        },
        "risk": {
          "lowestRisk": "${funds[0]?.name || "Fund 1"}",
          "highestRisk": "${funds[0]?.name || "Fund 1"}",
          "analysis": "Risk level comparison and suitability analysis for different investor profiles"
        },
        "cost": {
          "lowestExpense": "${funds[0]?.name || "Fund 1"}",
          "highestExpense": "${funds[0]?.name || "Fund 1"}",
          "analysis": "Cost efficiency comparison based on expense ratios"
        },
        "rating": {
          "highestRated": "${funds[0]?.name || "Fund 1"}",
          "analysis": "Rating comparison and quality assessment"
        },
        "aum": {
          "largest": "${funds[0]?.name || "Fund 1"}",
          "smallest": "${funds[0]?.name || "Fund 1"}",
          "analysis": "AUM comparison and fund size implications for stability and liquidity"
        }
      },
      "recommendations": {
        "bestOverall": "${funds[0]?.name || "Fund 1"}",
        "bestForConservative": "${funds[0]?.name || "Fund 1"}",
        "bestForAggressive": "${funds[0]?.name || "Fund 1"}",
        "bestValue": "${funds[0]?.name || "Fund 1"}",
        "reasoning": "Detailed reasoning for each recommendation based on performance, risk, cost, and suitability"
      },
      "summary": "Overall comparison summary highlighting key differences and insights",
      "detailedAnalysis": {
        "strengths": {
          "${
            funds[0]?.name || "Fund 1"
          }": ["strength1", "strength2", "strength3"],
          "${funds[1]?.name || "Fund 2"}": ["strength1", "strength2"]
        },
        "weaknesses": {
          "${funds[0]?.name || "Fund 1"}": ["weakness1", "weakness2"],
          "${funds[1]?.name || "Fund 2"}": ["weakness1"]
        },
        "suitability": {
          "${
            funds[0]?.name || "Fund 1"
          }": "Detailed suitability analysis for different investor types",
          "${
            funds[1]?.name || "Fund 2"
          }": "Detailed suitability analysis for different investor types"
        }
      }
    }

    Important guidelines:
    - Provide objective, data-driven analysis based on the actual fund data provided
    - Consider multiple factors: performance (1Y, 3Y, 5Y returns), risk level, cost (expense ratio), rating, AUM
    - Give specific recommendations for different investor profiles (conservative, aggressive, value-seeking)
    - Include both quantitative and qualitative analysis
    - Be thorough but concise in explanations
    - Use the exact fund names as provided in the data
    - Focus on actionable insights for investors
    
    Return ONLY a valid JSON object in the following exact structure. 
    Do not include explanations, markdown, or arrays. 
    Do not add extra fields. 
    Your output must be valid JSON parseable with JSON.parse in JavaScript.
  `;

  console.log("Starting AI fund comparison...");

  const aiResponse = await aiAgent(prompt);
  console.log(
    "AI Comparison Response received:",
    aiResponse?.substring(0, 100) + "..."
  );

  if (!aiResponse) {
    throw new Error("No response from AI");
  }

  // Parse AI response
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(aiResponse);

    // ✅ Unwrap if Gemini returns an array
    if (Array.isArray(parsedResponse)) {
      parsedResponse = parsedResponse[0];
    }
  } catch (parseError) {
    console.error("Failed to parse AI comparison response:", parseError);
    throw new Error("Invalid AI response format");
  }

  // Validate response structure
  if (!parsedResponse.comparison || !parsedResponse.recommendations) {
    throw new Error("Invalid AI response structure");
  }

  return parsedResponse;
};
