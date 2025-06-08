import mongoose, { Document, Schema } from 'mongoose';
import { UserPayload } from '../types/custom';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      required: function() {
        return this.isRecurring;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

const Expense = mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense; 