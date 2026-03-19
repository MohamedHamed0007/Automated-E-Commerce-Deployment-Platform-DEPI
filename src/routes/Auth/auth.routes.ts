import express from 'express';
import {
  ForgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetpassword
} from '../../controllers/auth/auth.controller';
import { authentication, authlimit } from '../../middleware/Auth/auth.middleware';
import { registerValidation } from '../../Validation/Auth/auth.validation';
import { valid } from 'joi';
import { ValidationRequest } from '../../middleware/Validate/validate.middleware';

const authRouter = express.Router();

authRouter.post('/register', authlimit, ValidationRequest(registerValidation), register);

authRouter.post('/login', authlimit, login);

authRouter.post('/refresh-token', refreshToken);

authRouter.post('/forgot-password', ForgotPassword);

authRouter.post('/reset-password/:token', resetpassword);

authRouter.post('/logout', authentication, logout);

export default authRouter;
