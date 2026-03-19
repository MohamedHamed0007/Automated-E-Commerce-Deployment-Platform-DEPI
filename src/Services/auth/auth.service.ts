import { RegisterData, IUserSafe } from '../../types/user';
import { User } from '../../config/DB/Models/User/user.models';
import {
  createConflictError,
  createNotFoundError,
  createUnauthorizedError
} from '../../utils/ApiErrors/ApiErrors';
import { comparePassword, hashPassword } from '../../utils/PasswordUtils/password.utils';
import { sendWelcomeEmail } from '../../utils/EmailUtils/email.utils';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '../../utils/Token/token.utils';

export const registerUser = async (userData: RegisterData): Promise<IUserSafe> => {
  const email = userData.email.toLowerCase().trim();

  // Check if user exists
  const existUser = await User.findOne({ email });
  if (existUser) throw createConflictError('Email already exists');

  // Hash password
  const passwordHash = await hashPassword(userData.password);

  // Create user
  const user = await User.create({
    fullName: userData.fullName,
    email,
    role: userData.role || 'customer',
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Send welcome email (non-blocking)
  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }

  // Convert to object and remove sensitive fields
  const userObj = user.toObject();
  const { passwordHash: _, resetPasswordToken, refreshToken, ...safeUser } = userObj;

  return safeUser as unknown as IUserSafe;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) throw createUnauthorizedError('Invalid email or password');

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) throw createUnauthorizedError('Invalid email or password');

  const access_token = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  const refresh_token = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  // Save refresh token in DB
  user.refreshToken.push({
    token: refresh_token,
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
  });
  user.lastLogin = new Date();
  await user.save();

  // Remove sensitive info
  const { passwordHash, refreshToken: _, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    tokens: { access_token, refresh_token }
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  // 1. Decode refresh token
  const decoded = verifyToken(refreshToken);
  if (typeof decoded === 'string') throw createUnauthorizedError('Invalid token');

  // 2. Get user by ID
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw createNotFoundError('User not found');
  }

  // 3. Find refresh token inside array
  const storedToken = user.refreshToken.find((rt) => rt.token === refreshToken);

  // 4. Validate token
  if (!storedToken) {
    throw createUnauthorizedError('Refresh token not found');
  }

  if (storedToken.expireAt < new Date()) {
    throw createUnauthorizedError('Refresh token expired');
  }

  // 5. Issue fresh access token
  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return newAccessToken;
};
