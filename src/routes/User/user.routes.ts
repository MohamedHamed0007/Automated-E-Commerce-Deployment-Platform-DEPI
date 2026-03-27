import { authentication, authorization } from '../../middleware/Auth/auth.middleware';
import express from 'express';
import {
  changeUserPassword,
  getUserProfile,
  UpdateProfile
} from '../../controllers/user/user.controller';
const userRouter = express.Router();

userRouter.get('/profile', authentication, authorization('user'), getUserProfile);

userRouter.put('/profile', authentication, UpdateProfile);

userRouter.post('/change-password', authentication, changeUserPassword);

export default userRouter;
