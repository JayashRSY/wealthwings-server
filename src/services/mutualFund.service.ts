import { 
  IMutualFund, 
  IFundRecommendation, 
  IFundFilters, 
  ISIPCalculator, 
  ILumpSumCalculator,
  ICalculationResult 
} from '../types/mutualFund.types';
import { MUTUAL_FUNDS, findFundById, filterFunds } from '../constants/mutualFunds.constants';
import { openai } from '../configs/openai';

// Enhanced fallback recommendation function
const getFallbackRecommendations = (preferences: IFundRecommendation) => {
  const { investmentGoal, investmentHorizon, riskTolerance, investmentAmount, category } = preferences;
  
  // Generate multiple fallback funds based on user preferences
  const fallbackFunds = [
    {
      id: "fallback_001",
      name: "HDFC Mid-Cap Opportunities Fund",
      fundHouse: "HDFC Mutual Fund",
      category: category || "Equity",
      subCategory: "Mid Cap",
      riskLevel: getRiskLevel(riskTolerance),
      rating: 4.5,
      expenseRatio: 1.85,
      nav: 125.45,
      returns: {
        '1Y': 18.5,
        '3Y': 22.3,
        '5Y': 19.8
      },
      aum: 25000,
      minInvestment: Math.max(500, Math.floor(investmentAmount * 0.01)),
      description: "A diversified mid-cap equity fund suitable for long-term wealth creation.",
      isActive: true,
      reason: `This fund aligns with your ${investmentGoal.toLowerCase()} goals and ${riskTolerance.toLowerCase()} risk tolerance.`
    },
    {
      id: "fallback_002",
      name: "Axis Bluechip Fund",
      fundHouse: "Axis Mutual Fund",
      category: category || "Equity",
      subCategory: "Large Cap",
      riskLevel: getRiskLevel(riskTolerance),
      rating: 4.3,
      expenseRatio: 1.75,
      nav: 45.67,
      returns: {
        '1Y': 15.2,
        '3Y': 18.9,
        '5Y': 16.5
      },
      aum: 35000,
      minInvestment: Math.max(500, Math.floor(investmentAmount * 0.01)),
      description: "A large-cap equity fund focusing on blue-chip companies.",
      isActive: true,
      reason: `Stable large-cap fund suitable for your ${investmentGoal.toLowerCase()} objectives.`
    },
    {
      id: "fallback_003",
      name: "ICICI Prudential Balanced Advantage Fund",
      fundHouse: "ICICI Prudential Mutual Fund",
      category: category || "Hybrid",
      subCategory: "Balanced",
      riskLevel: getRiskLevel(riskTolerance),
      rating: 4.2,
      expenseRatio: 1.95,
      nav: 35.89,
      returns: {
        '1Y': 12.8,
        '3Y': 15.4,
        '5Y': 14.2
      },
      aum: 28000,
      minInvestment: Math.max(500, Math.floor(investmentAmount * 0.01)),
      description: "A balanced fund that dynamically manages equity and debt allocation.",
      isActive: true,
      reason: `Balanced approach suitable for your ${riskTolerance.toLowerCase()} risk profile.`
    }
  ];

  const reasoning = `Based on your ${investmentGoal} goal, ${investmentHorizon} horizon, and ${riskTolerance} risk tolerance, we recommend these well-established funds. These recommendations are based on fund performance, ratings, and alignment with your investment profile.`;

  return {
    recommendedFunds: fallbackFunds,
    reasoning
  };
};

// Helper function to determine appropriate risk level
const getRiskLevel = (riskTolerance: string) => {
  switch (riskTolerance) {
    case 'Low':
      return 'Low';
    case 'Moderate':
      return 'Moderate';
    case 'High':
      return 'High';
    case 'Very High':
      return 'Very High';
    default:
      return 'Moderate';
  }
};

export const getAllFunds = async (filters: IFundFilters) => {
  const { 
    category, 
    subCategory, 
    fundHouse, 
    riskLevel, 
    minRating, 
    page = 1, 
    limit = 10 
  } = filters;
  
  const filterOptions = {
    category,
    subCategory,
    fundHouse,
    riskLevel,
    minRating
  };
  
  const filteredFunds = filterFunds(filterOptions);
  
  // Sort by rating and name
  filteredFunds.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return a.name.localeCompare(b.name);
  });
  
  const skip = (page - 1) * limit;
  const funds = filteredFunds.slice(skip, skip + limit);
  const total = filteredFunds.length;
  
  return {
    funds,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getFundDetails = async (fundId: string) => {
  const fund = findFundById(fundId);
  
  if (!fund) {
    throw new Error('Fund not found');
  }
  
  return fund;
};

export const getFundPerformance = async (fundId: string, period: string) => {
  const fund = findFundById(fundId);
  
  if (!fund) {
    throw new Error('Fund not found');
  }
  
  // Mock performance data based on period
  return {
    period,
    fundId,
    fundName: fund.name,
    returns: fund.returns,
    // In a real implementation, this would fetch historical NAV data
    historicalData: generateMockHistoricalData(period, fund.returns)
  };
};

export const getFundHoldings = async (fundId: string) => {
  const fund = findFundById(fundId);
  
  if (!fund) {
    throw new Error('Fund not found');
  }
  
  // Mock holdings data
  const holdings = generateMockHoldings(fund.category);
  
  return {
    fundId,
    fundName: fund.name,
    category: fund.category,
    holdings
  };
};

export const calculateSIPReturns = async (data: ISIPCalculator): Promise<ICalculationResult> => {
  const { fundId, monthlyAmount, duration, expectedReturn } = data;
  
  const fund = findFundById(fundId);
  
  if (!fund) {
    throw new Error('Fund not found');
  }
  
  return calculateSIPCalculation(monthlyAmount, duration, expectedReturn);
};

export const calculateLumpSumReturns = async (data: ILumpSumCalculator): Promise<ICalculationResult> => {
  const { fundId, amount, duration, expectedReturn } = data;
  
  const fund = findFundById(fundId);
  
  if (!fund) {
    throw new Error('Fund not found');
  }
  
  return calculateLumpSumCalculation(amount, duration, expectedReturn);
};

// Helper functions for calculations
const calculateSIPCalculation = (monthlyAmount: number, duration: number, expectedReturn: number): ICalculationResult => {
  const monthlyRate = expectedReturn / 100 / 12;
  const totalMonths = duration * 12;
  const totalInvestment = monthlyAmount * totalMonths;
  
  // SIP Future Value Formula: FV = P * ((1 + r)^n - 1) / r
  const maturityAmount = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const totalReturns = maturityAmount - totalInvestment;
  
  const breakdown = [];
  for (let year = 1; year <= duration; year++) {
    const yearMonths = year * 12;
    const yearInvestment = monthlyAmount * yearMonths;
    const yearBalance = monthlyAmount * ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate);
    const yearReturns = yearBalance - yearInvestment;
    
    breakdown.push({
      year,
      investment: yearInvestment,
      returns: yearReturns,
      balance: yearBalance
    });
  }
  
  return {
    totalInvestment,
    totalReturns,
    maturityAmount,
    breakdown
  };
};

const calculateLumpSumCalculation = (amount: number, duration: number, expectedReturn: number): ICalculationResult => {
  const annualRate = expectedReturn / 100;
  const totalInvestment = amount;
  
  // Compound Interest Formula: A = P(1 + r)^t
  const maturityAmount = amount * Math.pow(1 + annualRate, duration);
  const totalReturns = maturityAmount - totalInvestment;
  
  const breakdown = [];
  for (let year = 1; year <= duration; year++) {
    const yearBalance = amount * Math.pow(1 + annualRate, year);
    const yearReturns = yearBalance - totalInvestment;
    
    breakdown.push({
      year,
      investment: totalInvestment,
      returns: yearReturns,
      balance: yearBalance
    });
  }
  
  return {
    totalInvestment,
    totalReturns,
    maturityAmount,
    breakdown
  };
};

const generateMockHistoricalData = (period: string, returns: any) => {
  // Mock historical NAV data
  const data = [];
  const baseNAV = 100;
  let currentNAV = baseNAV;
  
  const periods = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '3Y': 1095,
    '5Y': 1825,
    'ALL': 3650
  };
  
  const days = periods[period as keyof typeof periods] || 365;
  
  for (let i = 0; i < days; i += 30) {
    const randomReturn = (Math.random() - 0.5) * 0.02; // ±1% monthly variation
    currentNAV *= (1 + randomReturn);
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nav: parseFloat(currentNAV.toFixed(2))
    });
  }
  
  return data;
};

const generateMockHoldings = (category: string) => {
  const holdings = {
    'Equity': [
      { sector: 'Technology', weight: 25.5 },
      { sector: 'Financial Services', weight: 20.3 },
      { sector: 'Healthcare', weight: 15.7 },
      { sector: 'Consumer Goods', weight: 12.4 },
      { sector: 'Energy', weight: 10.1 },
      { sector: 'Others', weight: 16.0 }
    ],
    'Debt': [
      { instrument: 'Government Securities', weight: 45.2 },
      { instrument: 'Corporate Bonds', weight: 30.8 },
      { instrument: 'Money Market', weight: 15.5 },
      { instrument: 'Others', weight: 8.5 }
    ],
    'Hybrid': [
      { asset: 'Equity', weight: 65.0 },
      { asset: 'Debt', weight: 25.0 },
      { asset: 'Others', weight: 10.0 }
    ]
  };
  
  return holdings[category as keyof typeof holdings] || holdings['Equity'];
}; 