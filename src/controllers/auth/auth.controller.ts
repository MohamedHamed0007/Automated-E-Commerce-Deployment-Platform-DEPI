import { asyncHandler } from '@/utils/AsyncHandler/asyncHandler.utils';
import { successResponse } from '../../utils/Response/api.response.utils';
import { RegisterData } from '@/types/user';
import { registerUser } from '../../Services/auth/auth.service';

export const register = asyncHandler(async (req, res) => {
  const userData = req.body as RegisterData;

  const user = await registerUser(userData);

  successResponse(res, 'User has been created', user, 201);
});
