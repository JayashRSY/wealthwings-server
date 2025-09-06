import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/apiResponse';
import {
  toggleLike,
  getUserLikeStatus
} from '../services/like.service';
import { UserPayload } from '../types/custom';

export const toggleLikeHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const { entityType, entityId } = req.body;
  
  const result = await toggleLike(entityType, entityId, user);
  return sendResponse(
    res, 
    httpStatus.OK, 
    true, 
    result.action === 'liked' ? 'Successfully liked' : 'Successfully unliked', 
    {
      action: result.action,
      likesCount: result.likesCount,
      liked: result.liked
    }
  );
});

export const getUserLikeStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const { entityType, entityId } = req.query as { entityType: 'blog' | 'comment', entityId: string };
  
  const isLiked = await getUserLikeStatus(entityType, entityId, user);
  return sendResponse(res, httpStatus.OK, true, 'Like status fetched', { isLiked });
});