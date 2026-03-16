import { successResponse } from '../../utils/Response/api.response.utils';
import { RegisterData } from '@/types/user';
import { loginUser, registerUser } from '../../Services/auth/auth.service';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';

export const register = asyncHandler(async (req, res) => {
  const userData = req.body as RegisterData;

  const user = await registerUser(userData);

  successResponse(res, 'User has been created', user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await loginUser(req.body.email, req.body.password);

  successResponse(res, 'Login successful', user, 200);
});

// export const refreshToken = asyncHandler(async (req, res) => {
//   const refreshToken = req.headers.refreshtoken || req.cookies.refreshtoken;

//   if (!refreshToken) {
//     throw new Error('refresh token is required');
//   }

//   const token = await refreshAccessToken(refreshToken);

//   successResponse(res, 'Token refreshed successfully', { accessToken: token });
// });
