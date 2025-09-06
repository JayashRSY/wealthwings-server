import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/apiResponse';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
  toggleBlogStatus,
  getBlogBySlug
} from '../services/blog.service';
import { UserPayload } from '../types/custom';
import mongoose from 'mongoose';

export const createBlogHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const blog = await createBlog(req.body, user);
  return sendResponse(res, httpStatus.CREATED, true, 'Blog created successfully', blog);
});

export const getBlogsHandler = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const tag = req.query.tag as string;
  const status = req.query.status as 'draft' | 'published';
  
  const result = await getBlogs({ page, limit, tag, status });
  return sendResponse(res, httpStatus.OK, true, 'Blogs fetched successfully', result);
});

export const getBlogByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const blog = await getBlogById(req.params.id);
  
  if (!blog) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Blog not found');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Blog fetched successfully', blog);
});

export const updateBlogHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const blog = await updateBlog(req.params.id, req.body, user);

  if (!blog) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Blog not found or you are not authorized to update it');
  }

  return sendResponse(res, httpStatus.OK, true, 'Blog updated successfully', blog);
});

export const deleteBlogHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const blog = await deleteBlog(req.params.id, user);

  if (!blog) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Blog not found or you are not authorized to delete it');
  }

  return sendResponse(res, httpStatus.OK, true, 'Blog deleted successfully');
});

export const getUserBlogsHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as 'draft' | 'published';
  
  const result = await getBlogsByUser(user, { page, limit, status });
  return sendResponse(res, httpStatus.OK, true, 'User blogs fetched successfully', result);
});

export const toggleBlogStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as UserPayload;
  const { id } = req.params;
  const { status } = req.body;
  
  const blog = await toggleBlogStatus(id, status, user);
  
  if (!blog) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Blog not found or you are not authorized to update it');
  }
  
  return sendResponse(res, httpStatus.OK, true, `Blog ${status === 'published' ? 'published' : 'moved to draft'} successfully`, blog);
});

export const getBlogBySlugHandler = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, 'Blog not found');
  }
  
  return sendResponse(res, httpStatus.OK, true, 'Blog fetched successfully', blog);
});