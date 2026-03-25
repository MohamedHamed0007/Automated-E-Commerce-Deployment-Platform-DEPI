import { RegisterData, IUserSafe } from '../../types/User/user.mongoose.types';
import User from '../../config/DB/Models/User/user.models';
import {
  createConflictError,
  createNotFoundError,
  createUnauthorizedError
} from '../../utils/ApiErrors/ApiErrors';
import { comparePassword, hashPassword } from '../../utils/PasswordUtils/password.utils';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../utils/EmailUtils/email.utils';
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken
} from '../../utils/Token/token.utils';

// ========================= REGISTER =========================
export const registerUser = async (userData: RegisterData): Promise<IUserSafe> => {
  const email = userData.email.toLowerCase().trim();

  const existUser = await User.findOne({ email });
  if (existUser) throw createConflictError('Email already exists');

  const passwordHash = await hashPassword(userData.password);

  const user = await User.create({
    fullName: userData.fullName,
    email,
    role: userData.role || 'customer',
    passwordHash,
    refreshTokens: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }

  const { passwordHash: _, resetPasswordToken, refreshTokens, ...safeUser } = user.toObject();

  return safeUser as unknown as IUserSafe;
};

// ========================= LOGIN =========================

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw createUnauthorizedError('Invalid email or password');

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) throw createUnauthorizedError('Invalid email or password');

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push({
    token: refreshToken,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  user.lastLogin = new Date();
  await user.save();

  const { passwordHash: _, refreshTokens: __, ...safeUser } = user.toObject();

  return { user: safeUser as IUserSafe, accessToken, refreshToken };
};

// ========================= REFRESH TOKEN
export const refreshAccessTokenService = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) throw createUnauthorizedError('Refresh token missing');

  const decoded = verifyToken(refreshToken);
  if (typeof decoded === 'string') throw createUnauthorizedError('Invalid token');

  const user = await User.findById(decoded.userId);
  if (!user) throw createNotFoundError('User not found');

  const storedToken = user.refreshTokens?.find((rt) => rt.token === refreshToken);
  if (!storedToken) throw createUnauthorizedError('Refresh token not found');

  if (storedToken.expireAt < new Date()) throw createUnauthorizedError('Refresh token expired');

  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return newAccessToken;
};
// ========================= FORGOT PASSWORD =========================
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { message: 'If an account with this email exists, a reset link has been sent.' };
  }

  const resetToken = generateResetToken({ userId: user._id.toString() });

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetEmail({ firstName: user.fullName, email: user.email }, resetToken);
    console.log('Reset token:', resetToken);
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    throw error;
  }

  return { message: 'Password reset link has been sent to your email' };
};

// ========================= RESET PASSWORD =========================
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) throw createUnauthorizedError('Invalid or expired reset token');

  const hashpassword = await hashPassword(newPassword);
  user.passwordHash = hashpassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
};

// ========================= LOGOUT =========================
export const logoutService = async (refreshToken: string | null | undefined) => {
  if (!refreshToken) return;

  const user = await User.findOne({ 'refreshTokens.token': refreshToken });

  if (user && user.refreshTokens) {
    user.refreshTokens = user.refreshTokens.filter((tokenObj) => tokenObj.token !== refreshToken);
    await user.save();
  }
};
