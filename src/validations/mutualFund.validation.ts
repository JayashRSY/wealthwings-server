import Joi from 'joi';

const recommendFundsValidation = Joi.object({
  investmentGoal: Joi.string().required().messages({
    'string.empty': 'Investment goal is required',
    'any.required': 'Investment goal is required',
  }),
  investmentHorizon: Joi.string().required().messages({
    'string.empty': 'Investment horizon is required',
    'any.required': 'Investment horizon is required',
  }),
  riskTolerance: Joi.string().valid('Low', 'Moderate', 'High', 'Very High').required().messages({
    'any.only': 'Risk tolerance must be Low, Moderate, High, or Very High',
    'any.required': 'Risk tolerance is required',
  }),
  investmentAmount: Joi.number().positive().required().messages({
    'number.base': 'Investment amount must be a number',
    'number.positive': 'Investment amount must be positive',
    'any.required': 'Investment amount is required',
  }),
  category: Joi.string().optional(),
});

const compareFundsValidation = Joi.object({
  funds: Joi.array().items(Joi.string().required()).min(2).max(5).required().messages({
    'array.min': 'At least 2 funds must be selected for comparison',
    'array.max': 'Maximum 5 funds can be compared at once',
    'any.required': 'Fund IDs are required',
  }),
});

const getAllFundsValidation = Joi.object({
  category: Joi.string().optional(),
  subCategory: Joi.string().optional(),
  fundHouse: Joi.string().optional(),
  riskLevel: Joi.string().valid('Low', 'Moderate', 'High', 'Very High').optional().messages({
    'any.only': 'Risk level must be Low, Moderate, High, or Very High',
  }),
  minRating: Joi.number().min(1).max(5).optional().messages({
    'number.min': 'Minimum rating must be at least 1',
    'number.max': 'Maximum rating cannot exceed 5',
  }),
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
  }),
});

const getFundDetailsValidation = Joi.object({
  fundId: Joi.string().required().messages({
    'string.empty': 'Fund ID is required',
    'any.required': 'Fund ID is required',
  }),
});

const getFundPerformanceValidation = Joi.object({
  fundId: Joi.string().required().messages({
    'string.empty': 'Fund ID is required',
    'any.required': 'Fund ID is required',
  }),
  period: Joi.string().valid('1M', '3M', '6M', '1Y', '3Y', '5Y', 'ALL').required().messages({
    'any.only': 'Period must be 1M, 3M, 6M, 1Y, 3Y, 5Y, or ALL',
    'any.required': 'Period is required',
  }),
});

const getFundHoldingsValidation = Joi.object({
  fundId: Joi.string().required().messages({
    'string.empty': 'Fund ID is required',
    'any.required': 'Fund ID is required',
  }),
});

const sipCalculatorValidation = Joi.object({
  fundId: Joi.string().required().messages({
    'string.empty': 'Fund ID is required',
    'any.required': 'Fund ID is required',
  }),
  monthlyAmount: Joi.number().positive().required().messages({
    'number.base': 'Monthly amount must be a number',
    'number.positive': 'Monthly amount must be positive',
    'any.required': 'Monthly amount is required',
  }),
  duration: Joi.number().integer().positive().max(50).required().messages({
    'number.base': 'Duration must be a number',
    'number.integer': 'Duration must be an integer',
    'number.positive': 'Duration must be positive',
    'number.max': 'Duration cannot exceed 50 years',
    'any.required': 'Duration is required',
  }),
  expectedReturn: Joi.number().positive().max(50).required().messages({
    'number.base': 'Expected return must be a number',
    'number.positive': 'Expected return must be positive',
    'number.max': 'Expected return cannot exceed 50%',
    'any.required': 'Expected return is required',
  }),
});

const lumpSumCalculatorValidation = Joi.object({
  fundId: Joi.string().required().messages({
    'string.empty': 'Fund ID is required',
    'any.required': 'Fund ID is required',
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be positive',
    'any.required': 'Amount is required',
  }),
  duration: Joi.number().integer().positive().max(50).required().messages({
    'number.base': 'Duration must be a number',
    'number.integer': 'Duration must be an integer',
    'number.positive': 'Duration must be positive',
    'number.max': 'Duration cannot exceed 50 years',
    'any.required': 'Duration is required',
  }),
  expectedReturn: Joi.number().positive().max(50).required().messages({
    'number.base': 'Expected return must be a number',
    'number.positive': 'Expected return must be positive',
    'number.max': 'Expected return cannot exceed 50%',
    'any.required': 'Expected return is required',
  }),
});

export {
  recommendFundsValidation,
  compareFundsValidation,
  getAllFundsValidation,
  getFundDetailsValidation,
  getFundPerformanceValidation,
  getFundHoldingsValidation,
  sipCalculatorValidation,
  lumpSumCalculatorValidation,
}; 