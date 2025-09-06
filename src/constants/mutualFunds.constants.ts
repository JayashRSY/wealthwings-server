import { IMutualFund } from '../types/mutualFund.types';

export const MUTUAL_FUNDS: IMutualFund[] = [
  {
    id: "fund_001",
    name: "HDFC Mid-Cap Opportunities Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subCategory: "Mid Cap",
    riskLevel: "High",
    rating: 4.5,
    expenseRatio: 1.85,
    nav: 125.45,
    returns: {
      '1Y': 18.5,
      '3Y': 22.3,
      '5Y': 19.8
    },
    aum: 25000,
    minInvestment: 500,
    description: "A mid-cap equity fund focusing on growth opportunities in mid-sized companies.",
    isActive: true
  },
  {
    id: "fund_002",
    name: "Axis Bluechip Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Equity",
    subCategory: "Large Cap",
    riskLevel: "Moderate",
    rating: 4.2,
    expenseRatio: 1.75,
    nav: 45.67,
    returns: {
      '1Y': 15.2,
      '3Y': 18.9,
      '5Y': 16.5
    },
    aum: 35000,
    minInvestment: 500,
    description: "A large-cap equity fund investing in blue-chip companies.",
    isActive: true
  },
  {
    id: "fund_003",
    name: "ICICI Prudential Balanced Advantage Fund",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "Hybrid",
    subCategory: "Balanced",
    riskLevel: "Moderate",
    rating: 4.0,
    expenseRatio: 1.95,
    nav: 28.90,
    returns: {
      '1Y': 12.8,
      '3Y': 15.6,
      '5Y': 13.2
    },
    aum: 18000,
    minInvestment: 1000,
    description: "A balanced fund with dynamic asset allocation between equity and debt.",
    isActive: true
  },
  {
    id: "fund_004",
    name: "SBI Magnum Gilt Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Debt",
    subCategory: "Gilt",
    riskLevel: "Low",
    rating: 3.8,
    expenseRatio: 1.25,
    nav: 35.20,
    returns: {
      '1Y': 8.5,
      '3Y': 9.2,
      '5Y': 8.8
    },
    aum: 12000,
    minInvestment: 5000,
    description: "A government securities fund with low risk and stable returns.",
    isActive: true
  },
  {
    id: "fund_005",
    name: "Kotak Emerging Equity Fund",
    fundHouse: "Kotak Mutual Fund",
    category: "Equity",
    subCategory: "Small Cap",
    riskLevel: "Very High",
    rating: 4.3,
    expenseRatio: 2.10,
    nav: 85.30,
    returns: {
      '1Y': 25.6,
      '3Y': 28.4,
      '5Y': 24.7
    },
    aum: 8500,
    minInvestment: 1000,
    description: "A small-cap equity fund targeting high growth potential companies.",
    isActive: true
  },
  {
    id: "fund_006",
    name: "Aditya Birla Sun Life Corporate Bond Fund",
    fundHouse: "Aditya Birla Sun Life Mutual Fund",
    category: "Debt",
    subCategory: "Corporate Bond",
    riskLevel: "Low",
    rating: 4.1,
    expenseRatio: 1.45,
    nav: 42.15,
    returns: {
      '1Y': 9.8,
      '3Y': 10.5,
      '5Y': 9.9
    },
    aum: 15000,
    minInvestment: 5000,
    description: "A corporate bond fund with focus on high-quality debt instruments.",
    isActive: true
  },
  {
    id: "fund_007",
    name: "Mirae Asset Tax Saver Fund",
    fundHouse: "Mirae Asset Mutual Fund",
    category: "Equity",
    subCategory: "ELSS",
    riskLevel: "High",
    rating: 4.4,
    expenseRatio: 1.80,
    nav: 65.80,
    returns: {
      '1Y': 20.3,
      '3Y': 24.1,
      '5Y': 21.5
    },
    aum: 9500,
    minInvestment: 500,
    description: "An ELSS fund offering tax benefits under Section 80C.",
    isActive: true
  },
  {
    id: "fund_008",
    name: "Nippon India Large Cap Fund",
    fundHouse: "Nippon India Mutual Fund",
    category: "Equity",
    subCategory: "Large Cap",
    riskLevel: "Moderate",
    rating: 3.9,
    expenseRatio: 1.70,
    nav: 38.45,
    returns: {
      '1Y': 14.7,
      '3Y': 17.2,
      '5Y': 15.1
    },
    aum: 22000,
    minInvestment: 500,
    description: "A large-cap fund with focus on established companies.",
    isActive: true
  },
  {
    id: "fund_009",
    name: "UTI Banking and Financial Services Fund",
    fundHouse: "UTI Mutual Fund",
    category: "Equity",
    subCategory: "Sectoral",
    riskLevel: "Very High",
    rating: 4.0,
    expenseRatio: 2.05,
    nav: 55.20,
    returns: {
      '1Y': 16.8,
      '3Y': 19.5,
      '5Y': 17.2
    },
    aum: 6800,
    minInvestment: 1000,
    description: "A sectoral fund focused on banking and financial services.",
    isActive: true
  },
  {
    id: "fund_010",
    name: "Franklin India Low Duration Fund",
    fundHouse: "Franklin Templeton Mutual Fund",
    category: "Debt",
    subCategory: "Low Duration",
    riskLevel: "Low",
    rating: 3.7,
    expenseRatio: 1.35,
    nav: 25.90,
    returns: {
      '1Y': 7.2,
      '3Y': 7.8,
      '5Y': 7.5
    },
    aum: 8500,
    minInvestment: 5000,
    description: "A low duration debt fund with minimal interest rate risk.",
    isActive: true
  }
];

// Helper function to find fund by ID
export const findFundById = (fundId: string): IMutualFund | undefined => {
  return MUTUAL_FUNDS.find(fund => fund.id === fundId && fund.isActive);
};

// Helper function to filter funds
export const filterFunds = (filters: {
  category?: string;
  subCategory?: string;
  fundHouse?: string;
  riskLevel?: string;
  minRating?: number;
  minInvestment?: number;
}): IMutualFund[] => {
  return MUTUAL_FUNDS.filter(fund => {
    if (!fund.isActive) return false;
    
    if (filters.category && fund.category !== filters.category) return false;
    if (filters.subCategory && fund.subCategory !== filters.subCategory) return false;
    if (filters.fundHouse && fund.fundHouse !== filters.fundHouse) return false;
    if (filters.riskLevel && fund.riskLevel !== filters.riskLevel) return false;
    if (filters.minRating && fund.rating < filters.minRating) return false;
    if (filters.minInvestment && fund.minInvestment > filters.minInvestment) return false;
    
    return true;
  });
}; 