import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import blogValidation from '../validations/blog.validation';
import {
  createBlogHandler,
  getBlogsHandler,
  getBlogByIdHandler,
  updateBlogHandler,
  deleteBlogHandler,
  getUserBlogsHandler,
  toggleBlogStatusHandler,
  getBlogBySlugHandler
} from '../controllers/blog.controller';

const router = express.Router();

// Public routes
router.get('/', validate(blogValidation.getBlogs), getBlogsHandler);
router.get('/slug/:slug', validate(blogValidation.getBlogBySlug), getBlogBySlugHandler);
router.get('/:id', validate(blogValidation.getBlogById), getBlogByIdHandler);

// Protected routes
router.use(authenticate);

router.post('/', validate(blogValidation.createBlog), createBlogHandler);
router.put('/:id', validate(blogValidation.updateBlog), updateBlogHandler);
router.delete('/:id', validate(blogValidation.deleteBlog), deleteBlogHandler);
router.get('/user/me', validate(blogValidation.getUserBlogs), getUserBlogsHandler);
router.patch('/:id/status', validate(blogValidation.toggleBlogStatus), toggleBlogStatusHandler);

export default router;