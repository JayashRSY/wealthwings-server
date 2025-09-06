import express from 'express';
import {
  recommendFunds,
  compareFunds,
  getAllFunds,
  getFundDetails,
  getFundPerformance,
  getFundHoldings,
  calculateSIPReturns,
  calculateLumpSumReturns,
} from '../controllers/mutualFund.controller';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  recommendFundsValidation,
  compareFundsValidation,
  getAllFundsValidation,
  getFundDetailsValidation,
  getFundPerformanceValidation,
  getFundHoldingsValidation,
  sipCalculatorValidation,
  lumpSumCalculatorValidation,
} from '../validations/mutualFund.validation';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Fund recommendation
router.post(
  '/recommend',
  validate(recommendFundsValidation),
  recommendFunds
);

// Fund comparison
router.post(
  '/compare',
  validate(compareFundsValidation),
  compareFunds
);

// Get all funds with filters
router.get(
  '/',
  validate(getAllFundsValidation),
  getAllFunds
);

// Get fund details
router.get(
  '/:fundId',
  validate(getFundDetailsValidation),
  getFundDetails
);

// Get fund performance
router.get(
  '/:fundId/performance',
  validate(getFundPerformanceValidation),
  getFundPerformance
);

// Get fund holdings
router.get(
  '/:fundId/holdings',
  validate(getFundHoldingsValidation),
  getFundHoldings
);

// SIP Calculator
router.post(
  '/sip-calculator',
  validate(sipCalculatorValidation),
  calculateSIPReturns
);

// Lump Sum Calculator
router.post(
  '/lumpsum-calculator',
  validate(lumpSumCalculatorValidation),
  calculateLumpSumReturns
);

export default router; 