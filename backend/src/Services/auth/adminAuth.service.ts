import User from "../../config/DB/Models/User/user.models";
import { comparePassword } from "../../utils/PasswordUtils/password.utils";
import { generateAccessToken } from "../../utils/Token/token.utils";
import {
  createBadRequestError,
  createUnauthorizedError,
  createForbiddenError,
  createNotFoundError,
} from "../../utils/ApiErrors/ApiErrors";

export const adminLoginService = async (body: any): Promise<string> => {
  const { email, password } = body;

  // 1. Validate input
  if (!email || !password) {
    throw createBadRequestError("Email and password are required");
  }

  // 2. Find user by email
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw createNotFoundError("User not found");
  }

  // 3. Verify password
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw createUnauthorizedError("Invalid credentials");
  }

  // 4. Check if user is an admin
  if (user.role !== "admin") {
    throw createForbiddenError("Forbidden: User is not an admin");
  }

  // 5. Generate and return JWT token
  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const token = generateAccessToken(tokenPayload);

  return token;
};
