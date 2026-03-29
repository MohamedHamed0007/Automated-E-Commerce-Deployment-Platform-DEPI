import express from 'express';
import {
  ForgotPassword,
  login,
  logout,
  refreshTokenController,
  register,
  resetpassword
} from '../../controllers/auth/auth.controller';
import { authentication, authlimit } from '../../middleware/Auth/auth.middleware';
import { registerValidation } from '../../Validation/Auth/auth.validation';
import { validateBody } from '../../middleware/Validate/validate.middleware';

const authRouter = express.Router();

authRouter.post('/register', authlimit, validateBody(registerValidation), register);

authRouter.post('/login', authlimit, login);

authRouter.post('/refresh-token', refreshTokenController);

authRouter.post('/forgot-password', ForgotPassword);

authRouter.post('/reset-password/:token', resetpassword);

authRouter.post('/logout', authentication, logout);

export default authRouter;
