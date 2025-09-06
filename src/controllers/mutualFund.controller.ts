import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import * as mutualFundService from "../services/mutualFund.service";
import { getRecommendedFunds, getFundComparison } from "../services/ai.service";
import { MUTUAL_FUNDS, findFundById } from "../constants/mutualFunds.constants";

export const recommendFunds = catchAsync(
  async (req: Request, res: Response) => {
    const {
      investmentGoal,
      investmentHorizon,
      riskTolerance,
      investmentAmount,
      category,
    } = req.body;

    try {
      // Try to get AI recommendations first
      const result = await getRecommendedFunds(
        investmentGoal,
        investmentHorizon,
        riskTolerance,
        investmentAmount,
        category
      );

      return res.status(httpStatus.OK).json({
        success: true,
        message: "AI-powered fund recommendations generated successfully",
        data: result,
      });
    } catch (error) {
      console.error("AI recommendation failed:", error);
      
      // Return proper response when AI is not able to suggest
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Unable to generate AI recommendations at this time. Please try again later.",
        data: {
          recommendedFunds: [],
          reasoning: "Our AI recommendation service is currently unavailable. Please try again in a few moments or contact our support team for assistance."
        },
      });
    }
  }
);

export const compareFunds = catchAsync(async (req: Request, res: Response) => {
  const { funds } = req.body;
  console.log("======", funds);

  // Validate input - funds should be an array of fund names (strings)
  if (!funds || !Array.isArray(funds) || funds.length < 2) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Please provide at least 2 fund names to compare",
      data: null,
    });
  }

  // Validate that all fund names are strings
  for (const fundName of funds) {
    if (typeof fundName !== 'string' || fundName.trim() === '') {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "All fund names must be valid strings",
        data: null,
      });
    }
  }

  // Find funds by name from constants
  const fundData = [];
  const notFoundFunds = [];

  for (const fundName of funds) {
    const fund = MUTUAL_FUNDS.find(f => 
      f.name.toLowerCase().includes(fundName.toLowerCase()) || 
      fundName.toLowerCase().includes(f.name.toLowerCase())
    );
    
    if (fund) {
      fundData.push(fund);
    } else {
      notFoundFunds.push(fundName);
    }
  }

  // Check if we found enough funds
  if (fundData.length < 2) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: `Not enough funds found. Found: ${fundData.length}, Required: 2. Not found: ${notFoundFunds.join(', ')}`,
      data: null,
    });
  }

  // Warn about not found funds but proceed with found ones
  if (notFoundFunds.length > 0) {
    console.log(`Some funds not found: ${notFoundFunds.join(', ')}`);
  }

  try {
    // Use AI to compare funds
    const comparisonResult = await getFundComparison(fundData);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Fund comparison completed successfully",
      data: {
        funds: fundData,
        comparison: comparisonResult,
        notFoundFunds: notFoundFunds.length > 0 ? notFoundFunds : undefined
      },
    });
  } catch (error) {
    console.error("AI fund comparison failed:", error);
    
    // Return proper response when AI is not able to compare
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Unable to generate AI comparison at this time. Please try again later.",
      data: {
        funds: fundData,
        comparison: {
          comparison: {
            performance: {
              analysis: "Performance comparison unavailable"
            },
            risk: {
              analysis: "Risk comparison unavailable"
            },
            cost: {
              analysis: "Cost comparison unavailable"
            },
            rating: {
              analysis: "Rating comparison unavailable"
            },
            aum: {
              analysis: "AUM comparison unavailable"
            }
          },
          recommendations: {
            reasoning: "Recommendations unavailable due to service issues"
          },
          summary: "Comparison service is currently unavailable. Please try again in a few moments.",
          detailedAnalysis: {
            strengths: {},
            weaknesses: {},
            suitability: {}
          }
        },
        notFoundFunds: notFoundFunds.length > 0 ? notFoundFunds : undefined
      },
    });
  }
});

export const getAllFunds = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;

  const result = await mutualFundService.getAllFunds(filters);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Funds fetched successfully",
    data: result,
  });
});

export const getFundDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { fundId } = req.params;

    const fund = await mutualFundService.getFundDetails(fundId);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Fund details fetched successfully",
      data: fund,
    });
  }
);

export const getFundPerformance = catchAsync(
  async (req: Request, res: Response) => {
    const { fundId } = req.params;
    const { period } = req.query;

    const performance = await mutualFundService.getFundPerformance(
      fundId,
      period as string
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Fund performance data fetched successfully",
      data: performance,
    });
  }
);

export const getFundHoldings = catchAsync(
  async (req: Request, res: Response) => {
    const { fundId } = req.params;

    const holdings = await mutualFundService.getFundHoldings(fundId);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Fund holdings fetched successfully",
      data: holdings,
    });
  }
);

export const calculateSIPReturns = catchAsync(
  async (req: Request, res: Response) => {
    const calculationData = req.body;

    const result = await mutualFundService.calculateSIPReturns(calculationData);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "SIP calculation completed successfully",
      data: result,
    });
  }
);

export const calculateLumpSumReturns = catchAsync(
  async (req: Request, res: Response) => {
    const calculationData = req.body;

    const result = await mutualFundService.calculateLumpSumReturns(
      calculationData
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Lump sum calculation completed successfully",
      data: result,
    });
  }
);
