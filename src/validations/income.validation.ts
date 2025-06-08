import Joi from 'joi';

const createIncome = {
  body: Joi.object().keys({
    amount: Joi.number().required().min(0),
    category: Joi.string().required().valid(
      'Salary',
      'Freelance',
      'Business',
      'Investments',
      'Rental',
      'Gifts',
      'Refunds',
      'Other'
    ),
    description: Joi.string().required().trim(),
    date: Joi.date().default(() => new Date()),
    source: Joi.string().required().trim(),
    tags: Joi.array().items(Joi.string().trim()),
    isRecurring: Joi.boolean().default(false),
    recurringFrequency: Joi.string().when('isRecurring', {
      is: true,
      then: Joi.string().required().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
      otherwise: Joi.string().optional()
    })
  })
};

const updateIncome = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  }),
  body: Joi.object().keys({
    amount: Joi.number().min(0),
    category: Joi.string().valid(
      'Salary',
      'Freelance',
      'Business',
      'Investments',
      'Rental',
      'Gifts',
      'Refunds',
      'Other'
    ),
    description: Joi.string().trim(),
    date: Joi.date(),
    source: Joi.string().trim(),
    tags: Joi.array().items(Joi.string().trim()),
    isRecurring: Joi.boolean(),
    recurringFrequency: Joi.string().when('isRecurring', {
      is: true,
      then: Joi.string().required().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
      otherwise: Joi.string().optional()
    })
  }).min(1)
};

const getIncomes = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    category: Joi.string().valid(
      'Salary',
      'Freelance',
      'Business',
      'Investments',
      'Rental',
      'Gifts',
      'Refunds',
      'Other'
    )
  })
};

const getIncomeById = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const deleteIncome = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24)
  })
};

const getIncomeStats = {
  query: Joi.object().keys({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
  })
};

export default {
  createIncome,
  updateIncome,
  getIncomes,
  getIncomeById,
  deleteIncome,
  getIncomeStats
}; 