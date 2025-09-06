import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  parentCommentId?: Types.ObjectId | null;
  content: string;
  likesCount: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast lookup
CommentSchema.index({ blogId: 1, parentCommentId: 1, createdAt: -1 });

export const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
