import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  authorId: Types.ObjectId;
  tags: string[];
  coverImage?: string;
  likesCount: number;
  commentsCount: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    coverImage: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

// Index for tags & createdAt (filter/sort)
BlogSchema.index({ tags: 1, createdAt: -1 });

const BlogModel = mongoose.model<IBlog>("Blog", BlogSchema);
export default BlogModel;
