import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import incomeValidation from '../validations/income.validation';
import {
  createIncomeHandler,
  getIncomesHandler,
  getIncomeByIdHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
  getIncomeStatsHandler
} from '../controllers/income.controller';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(validate(incomeValidation.createIncome), createIncomeHandler)
  .get(validate(incomeValidation.getIncomes), getIncomesHandler);

router
  .route('/stats')
  .get(validate(incomeValidation.getIncomeStats), getIncomeStatsHandler);

router
  .route('/:id')
  .get(validate(incomeValidation.getIncomeById), getIncomeByIdHandler)
  .put(validate(incomeValidation.updateIncome), updateIncomeHandler)
  .delete(validate(incomeValidation.deleteIncome), deleteIncomeHandler);

export default router; 