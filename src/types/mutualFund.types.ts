export interface IMutualFund {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  rating: number;
  expenseRatio: number;
  nav: number;
  returns: {
    '1Y': number;
    '3Y': number;
    '5Y': number;
  };
  aum: number;
  minInvestment: number;
  description?: string;
  isActive: boolean;
}

export interface IFundRecommendation {
  investmentGoal: string;
  investmentHorizon: string;
  riskTolerance: string;
  investmentAmount: number;
  category?: string;
}

export interface IFundComparison {
  funds: string[];
}

export interface IFundFilters {
  category?: string;
  subCategory?: string;
  fundHouse?: string;
  riskLevel?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface ISIPCalculator {
  fundId: string;
  monthlyAmount: number;
  duration: number;
  expectedReturn: number;
}

export interface ILumpSumCalculator {
  fundId: string;
  amount: number;
  duration: number;
  expectedReturn: number;
}

export interface IPerformancePeriod {
  period: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';
}

export interface ICalculationResult {
  totalInvestment: number;
  totalReturns: number;
  maturityAmount: number;
  breakdown: {
    year: number;
    investment: number;
    returns: number;
    balance: number;
  }[];
} 