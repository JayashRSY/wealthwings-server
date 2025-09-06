import { IComment, CommentModel } from '../models/comment.model';
import Blog from '../models/blog.model';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';

export const createComment = async (commentData: Partial<IComment>, user: UserPayload): Promise<IComment> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const comment = new CommentModel({
      ...commentData,
      userId: user.sub,
    });
    
    await comment.save({ session });
    
    // Increment comment count on the blog
    await Blog.findByIdAndUpdate(
      commentData.blogId,
      { $inc: { commentsCount: 1 } },
      { session }
    );
    
    await session.commitTransaction();
    return comment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCommentsByBlog = async (
  blogId: string,
  query: {
    page?: number;
    limit?: number;
  }
) => {
  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    CommentModel.find({ blogId, parentCommentId: null })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments({ blogId, parentCommentId: null })
  ]);

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await CommentModel.find({ parentCommentId: comment._id })
        .populate('userId', 'name email')
        .sort({ createdAt: 1 })
        .lean();
      
      return { ...comment, replies };
    })
  );

  return {
    comments: commentsWithReplies,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const updateComment = async (
  id: string,
  content: string,
  user: UserPayload
): Promise<IComment | null> => {
  return await CommentModel.findOneAndUpdate(
    { _id: id, userId: user.sub },
    { content, isEdited: true },
    { new: true }
  ).lean();
};

export const deleteComment = async (id: string, user: UserPayload): Promise<IComment | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const comment = await CommentModel.findOne({ _id: id, userId: user.sub });
    
    if (!comment) {
      return null;
    }
    
    // Delete the comment
    await CommentModel.findByIdAndDelete(id, { session });
    
    // Decrement comment count on the blog
    await Blog.findByIdAndUpdate(
      comment.blogId,
      { $inc: { commentsCount: -1 } },
      { session }
    );
    
    // Delete all replies if it's a parent comment
    if (!comment.parentCommentId) {
      const replies = await CommentModel.find({ parentCommentId: id });
      
      if (replies.length > 0) {
        await CommentModel.deleteMany({ parentCommentId: id }, { session });
        
        // Decrement comment count for each reply
        await Blog.findByIdAndUpdate(
          comment.blogId,
          { $inc: { commentsCount: -replies.length } },
          { session }
        );
      }
    }
    
    await session.commitTransaction();
    return comment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};