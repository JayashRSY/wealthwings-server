import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/apiResponse';
import {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
  getIncomeStats
} from '../services/income.service';
import { UserPayload } from '../types/custom';

export const createIncomeHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const income = await createIncome(req.body, user);
  return sendResponse(res, httpStatus.CREATED, true, 'Income created successfully', income);
});

export const getIncomesHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const category = req.query.category as string;

  const result = await getIncomes(user, { page, limit, startDate, endDate, category });
  return sendResponse(res, httpStatus.OK, true, 'Incomes fetched successfully', result);
});

export const getIncomeByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const income = await getIncomeById(req.params.id, user);
  
  if (!income) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Income not found');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Income fetched successfully', income);
});

export const updateIncomeHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const income = await updateIncome(req.params.id, req.body, user);

  if (!income) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Income not found');
  }

  return sendResponse(res, httpStatus.OK, true, 'Income updated successfully', income);
});

export const deleteIncomeHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const income = await deleteIncome(req.params.id, user);

  if (!income) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Income not found');
  }

  return sendResponse(res, httpStatus.OK, true, 'Income deleted successfully');
});

export const getIncomeStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

  const stats = await getIncomeStats(user, startDate, endDate);
  return sendResponse(res, httpStatus.OK, true, 'Income statistics fetched successfully', stats);
}); 