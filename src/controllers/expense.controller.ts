import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/apiResponse';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
} from '../services/expense.service';
import { UserPayload } from '../types/custom';

export const createExpenseHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const expense = await createExpense(req.body, user);
  return sendResponse(res, httpStatus.CREATED, true, 'Expense created successfully', expense);
});

export const getExpensesHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const category = req.query.category as string;

  const result = await getExpenses(user, { page, limit, startDate, endDate, category });
  return sendResponse(res, httpStatus.OK, true, 'Expenses fetched successfully', result);
});

export const getExpenseByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const expense = await getExpenseById(req.params.id, user);
  
  if (!expense) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Expense not found');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Expense fetched successfully', expense);
});

export const updateExpenseHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const expense = await updateExpense(req.params.id, req.body, user);

  if (!expense) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Expense not found');
  }

  return sendResponse(res, httpStatus.OK, true, 'Expense updated successfully', expense);
});

export const deleteExpenseHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const expense = await deleteExpense(req.params.id, user);

  if (!expense) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Expense not found');
  }

  return sendResponse(res, httpStatus.OK, true, 'Expense deleted successfully');
});

export const getExpenseStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

  const stats = await getExpenseStats(user, startDate, endDate);
  return sendResponse(res, httpStatus.OK, true, 'Expense statistics fetched successfully', stats);
}); 