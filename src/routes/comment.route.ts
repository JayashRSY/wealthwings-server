import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import commentValidation from '../validations/comment.validation';
import {
  createCommentHandler,
  getCommentsByBlogHandler,
  updateCommentHandler,
  deleteCommentHandler
} from '../controllers/comment.controller';

const router = express.Router();

// Public routes
router.get('/blog/:blogId', validate(commentValidation.getCommentsByBlog), getCommentsByBlogHandler);

// Protected routes
router.use(authenticate);

router.post('/', validate(commentValidation.createComment), createCommentHandler);
router.put('/:id', validate(commentValidation.updateComment), updateCommentHandler);
router.delete('/:id', validate(commentValidation.deleteComment), deleteCommentHandler);

export default router;