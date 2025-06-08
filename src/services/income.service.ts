import Income, { IIncome } from '../models/income.model';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';

export const createIncome = async (incomeData: Partial<IIncome>, user: UserPayload): Promise<IIncome> => {
  const income = new Income({
    ...incomeData,
    user: user.sub,
  });
  return await income.save();
};

export const getIncomes = async (
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

  const [incomes, total] = await Promise.all([
    Income.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Income.countDocuments(filter)
  ]);

  return {
    incomes,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getIncomeById = async (id: string, user: UserPayload): Promise<IIncome | null> => {
  return await Income.findOne({ _id: id, user: user.sub }).lean();
};

export const updateIncome = async (
  id: string,
  updateData: Partial<IIncome>,
  user: UserPayload
): Promise<IIncome | null> => {
  return await Income.findOneAndUpdate(
    { _id: id, user: user.sub },
    updateData,
    { new: true, runValidators: true }
  ).lean();
};

export const deleteIncome = async (id: string, user: UserPayload): Promise<IIncome | null> => {
  return await Income.findOneAndDelete({ _id: id, user: user.sub }).lean();
};

export const getIncomeStats = async (
  user: UserPayload,
  startDate: Date,
  endDate: Date
) => {
  const stats = await Income.aggregate([
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