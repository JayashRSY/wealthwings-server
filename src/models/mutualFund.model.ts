import mongoose, { Document, Schema } from "mongoose";
import { IMutualFund } from "../types/mutualFund.types";

interface IMutualFundDocument extends Omit<IMutualFund, 'id'>, Document {}

const mutualFundSchema: Schema<IMutualFundDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fundHouse: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    required: true,
    trim: true,
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  expenseRatio: {
    type: Number,
    required: true,
    min: 0,
  },
  nav: {
    type: Number,
    required: true,
    min: 0,
  },
  returns: {
    '1Y': {
      type: Number,
      required: true,
    },
    '3Y': {
      type: Number,
      required: true,
    },
    '5Y': {
      type: Number,
      required: true,
    },
  },
  aum: {
    type: Number,
    required: true,
    min: 0,
  },
  minInvestment: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
mutualFundSchema.index({ category: 1, subCategory: 1 });
mutualFundSchema.index({ fundHouse: 1 });
mutualFundSchema.index({ riskLevel: 1 });
mutualFundSchema.index({ rating: -1 });
mutualFundSchema.index({ isActive: 1 });

// Virtual for fund ID
mutualFundSchema.virtual('id').get(function() {
  return this._id?.toString();
});

// Ensure virtual fields are serialized
mutualFundSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const MutualFundModel = mongoose.model<IMutualFundDocument>("MutualFund", mutualFundSchema);
export default MutualFundModel; 