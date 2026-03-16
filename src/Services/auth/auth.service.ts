import { createConflictError } from '@/utils/ApiErrors/ApiErrors';
import { RegisterData, IUserSafe } from '../../types/user';
import { User } from '../../config/DB/Models/User/user.models';
import { hashPassword } from '@/utils/password.utils';
import { sendWelcomeEmail } from '@/utils/email.utils';

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
    role: userData.role || 'user',
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Send welcome email (non-blocking)
  try {
    await sendWelcomeEmail({
      fullName: user.fullName,
      email: user.email,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role
    });
  } catch (error) {
    console.error('Welcome email failed:', error);
  }

  // Return safe user
  const safeUser = user.toObject() as IUserSafe;
  delete safeUser.passwordHash;
  return safeUser;
};
