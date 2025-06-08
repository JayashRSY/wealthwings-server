import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import expenseValidation from '../validations/expense.validation';
import {
  createExpenseHandler,
  getExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
  getExpenseStatsHandler
} from '../controllers/expense.controller';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(validate(expenseValidation.createExpense), createExpenseHandler)
  .get(validate(expenseValidation.getExpenses), getExpensesHandler);

router
  .route('/stats')
  .get(validate(expenseValidation.getExpenseStats), getExpenseStatsHandler);

router
  .route('/:id')
  .get(validate(expenseValidation.getExpenseById), getExpenseByIdHandler)
  .put(validate(expenseValidation.updateExpense), updateExpenseHandler)
  .delete(validate(expenseValidation.deleteExpense), deleteExpenseHandler);

export default router; 