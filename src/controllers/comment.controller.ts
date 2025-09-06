import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/apiResponse';
import {
  createComment,
  getCommentsByBlog,
  updateComment,
  deleteComment
} from '../services/comment.service';
import { UserPayload } from '../types/custom';

export const createCommentHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const comment = await createComment(req.body, user);
  return sendResponse(res, httpStatus.CREATED, true, 'Comment added successfully', comment);
});

export const getCommentsByBlogHandler = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const result = await getCommentsByBlog(blogId, { page, limit });
  return sendResponse(res, httpStatus.OK, true, 'Comments fetched successfully', result);
});

export const updateCommentHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const { id } = req.params;
  const { content } = req.body;
  
  const comment = await updateComment(id, content, user);
  
  if (!comment) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Comment not found or you are not authorized to update it');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Comment updated successfully', comment);
});

export const deleteCommentHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const { id } = req.params;
  
  const comment = await deleteComment(id, user);
  
  if (!comment) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Comment not found or you are not authorized to delete it');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Comment deleted successfully');
});