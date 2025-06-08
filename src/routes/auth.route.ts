import express from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  google, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { 
  loginValidation, 
  registerValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} from '../validations/auth.validation';

const router = express.Router();

// router.post('/register', validate(registerValidation), register);
router.post('/register', register);
// router.post('/login', validate(loginValidation), login);
router.post('/login', login);
router.post('/refresh-token', refresh);
router.post('/logout', logout);
router.post('/google', google);
// router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);
router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', validate(resetPasswordValidation), resetPassword);
router.post('/reset-password', resetPassword);

export default router;