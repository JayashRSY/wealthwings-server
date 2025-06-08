import mongoose, { Document, Schema } from 'mongoose';
import { UserPayload } from '../types/custom';

export interface IIncome extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: Date;
  source: string;
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const incomeSchema = new Schema<IIncome>(
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
        'Salary',
        'Freelance',
        'Business',
        'Investments',
        'Rental',
        'Gifts',
        'Refunds',
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
    source: {
      type: String,
      required: true,
      trim: true,
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
incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ user: 1, category: 1 });

const Income = mongoose.model<IIncome>('Income', incomeSchema);

export default Income; 