import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike extends Document {
  userId: Types.ObjectId;
  entityType: "blog" | "comment";
  entityId: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    entityType: { type: String, enum: ["blog", "comment"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate likes
LikeSchema.index({ userId: 1, entityType: 1, entityId: 1 }, { unique: true });

const LikeModel = mongoose.model<ILike>("Like", LikeSchema);
export default LikeModel;
