import Joi from 'joi';

const createExpense = {
  body: Joi.object().keys({
    amount: Joi.number().required().min(0),
    category: Joi.string().required().valid(
      'Food & Dining',
      'Transportation',
      'Housing',
      'Utilities',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Education',
      'Travel',
      'Personal Care',
      'Gifts & Donations',
      'Investments',
      'Other'
    ),
    description: Joi.string().required().trim(),
    date: Joi.date().default(() => new Date()),
    paymentMethod: Joi.string().required().valid(
      'Cash',
      'Credit Card',
      'Debit Card',
      'Bank Transfer',
      'UPI',
      'Other'
    ),
    tags: Joi.array().items(Joi.string().trim()),
    isRecurring: Joi.boolean().default(false),
    recurringFrequency: Joi.string().when('isRecurring', {
      is: true,
      then: Joi.string().required().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
      otherwise: Joi.string().optional()
    })
  })
};

const updateExpense = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  }),
  body: Joi.object().keys({
    amount: Joi.number().min(0),
    category: Joi.string().valid(
      'Food & Dining',
      'Transportation',
      'Housing',
      'Utilities',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Education',
      'Travel',
      'Personal Care',
      'Gifts & Donations',
      'Investments',
      'Other'
    ),
    description: Joi.string().trim(),
    date: Joi.date(),
    paymentMethod: Joi.string().valid(
      'Cash',
      'Credit Card',
      'Debit Card',
      'Bank Transfer',
      'UPI',
      'Other'
    ),
    tags: Joi.array().items(Joi.string().trim()),
    isRecurring: Joi.boolean(),
    recurringFrequency: Joi.string().when('isRecurring', {
      is: true,
      then: Joi.string().required().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
      otherwise: Joi.string().optional()
    })
  }).min(1)
};

const getExpenses = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    category: Joi.string().valid(
      'Food & Dining',
      'Transportation',
      'Housing',
      'Utilities',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Education',
      'Travel',
      'Personal Care',
      'Gifts & Donations',
      'Investments',
      'Other'
    )
  })
};

const getExpenseById = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const deleteExpense = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const getExpenseStats = {
  query: Joi.object().keys({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
  })
};

export default {
  createExpense,
  updateExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  getExpenseStats
}; 