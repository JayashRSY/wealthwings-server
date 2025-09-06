import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import likeValidation from '../validations/like.validation';
import {
  toggleLikeHandler,
  getUserLikeStatusHandler
} from '../controllers/like.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/toggle', validate(likeValidation.toggleLike), toggleLikeHandler);
router.get('/status', validate(likeValidation.getUserLikeStatus), getUserLikeStatusHandler);

export default router;