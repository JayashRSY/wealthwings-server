import Like from '../models/like.model';
import Blog from '../models/blog.model';
import Comment from '../models/comment.model';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';

export const toggleLike = async (
  entityType: 'blog' | 'comment',
  entityId: string,
  user: UserPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Check if user already liked this entity
    const existingLike = await Like.findOne({
      userId: user.sub,
      entityType,
      entityId
    });
    
    let action: 'liked' | 'unliked';
    
    if (existingLike) {
      // Unlike: Remove the like
      await Like.findByIdAndDelete(existingLike._id, { session });
      action = 'unliked';
      
      // Decrement like count
      if (entityType === 'blog') {
        await Blog.findByIdAndUpdate(
          entityId,
          { $inc: { likesCount: -1 } },
          { session }
        );
      } else {
        await Comment.findByIdAndUpdate(
          entityId,
          { $inc: { likesCount: -1 } },
          { session }
        );
      }
    } else {
      // Like: Create new like
      const newLike = new Like({
        userId: user.sub,
        entityType,
        entityId
      });
      
      await newLike.save({ session });
      action = 'liked';
      
      // Increment like count
      if (entityType === 'blog') {
        await Blog.findByIdAndUpdate(
          entityId,
          { $inc: { likesCount: 1 } },
          { session }
        );
      } else {
        await Comment.findByIdAndUpdate(
          entityId,
          { $inc: { likesCount: 1 } },
          { session }
        );
      }
    }
    
    await session.commitTransaction();
    
    // Get updated like count and user's like status
    let updatedEntity;
    if (entityType === 'blog') {
      updatedEntity = await Blog.findById(entityId).select('likesCount');
    } else {
      updatedEntity = await Comment.findById(entityId).select('likesCount');
    }
    
    const likesCount = updatedEntity?.likesCount || 0;
    const liked = action === 'liked';
    
    return { action, likesCount, liked };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserLikeStatus = async (
  entityType: 'blog' | 'comment',
  entityId: string,
  user: UserPayload
): Promise<boolean> => {
  const like = await Like.findOne({
    userId: user.sub,
    entityType,
    entityId
  });
  
  return !!like;
};