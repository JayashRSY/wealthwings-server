import express from 'express'; 
import {
//   createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.ts';
import { authenticate } from '../middlewares/auth.middleware.ts'; 
import validate from '../middlewares/validate.middleware.ts';
import { createUserValidation, updateUserValidation, getUserValidation, deleteUserValidation } from '../validations/user.validation.ts';

const router = express.Router();
router.use(authenticate);

// router.post('/', validate(createUserValidation), createUser);
router.get('/', getUsers);
router.get(
  '/:id',
  validate(getUserValidation),
  getUser
);
router.put('/:id', validate(updateUserValidation), updateUser);
router.delete('/:id', validate(deleteUserValidation), deleteUser);

export default router;