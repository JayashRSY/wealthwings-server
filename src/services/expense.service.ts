import Expense, { IExpense } from '../models/expense.model';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';

export const createExpense = async (expenseData: Partial<IExpense>, user: UserPayload): Promise<IExpense> => {
  const expense = new Expense({
    ...expenseData,
    user: user.sub,
  });
  return await expense.save();
};

export const getExpenses = async (
  user: UserPayload,
  query: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }
) => {
  const { page = 1, limit = 10, startDate, endDate, category } = query;
  const skip = (page - 1) * limit;

  const filter: any = { user: user.sub };
  if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  }
  if (category) {
    filter.category = category;
  }

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Expense.countDocuments(filter)
  ]);

  return {
    expenses,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getExpenseById = async (id: string, user: UserPayload): Promise<IExpense | null> => {
  return await Expense.findOne({ _id: id, user: user.sub }).lean();
};

export const updateExpense = async (
  id: string,
  updateData: Partial<IExpense>,
  user: UserPayload
): Promise<IExpense | null> => {
  return await Expense.findOneAndUpdate(
    { _id: id, user: user.sub },
    updateData,
    { new: true, runValidators: true }
  ).lean();
};

export const deleteExpense = async (id: string, user: UserPayload): Promise<IExpense | null> => {
  return await Expense.findOneAndDelete({ _id: id, user: user.sub }).lean();
};

export const getExpenseStats = async (
  user: UserPayload,
  startDate: Date,
  endDate: Date
) => {
  const stats = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user.sub),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);

  const totalAmount = stats.reduce((acc, curr) => acc + curr.total, 0);

  return {
    stats,
    totalAmount,
    period: {
      startDate,
      endDate
    }
  };
}; 