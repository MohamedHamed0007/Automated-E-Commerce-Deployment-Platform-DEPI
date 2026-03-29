import { createNotFoundError, createUnauthorizedError } from '../../utils/ApiErrors/ApiErrors';
import { comparePassword, hashPassword } from '../../utils/PasswordUtils/password.utils';
import User from '../../config/DB/Models/User/user.models';
import { IUser, IUserSafe } from '../../types/User/user.mongoose.types';

// -------- Get Profile ----------
export const getProfile = async (userId: string): Promise<IUserSafe> => {
  const user = await User.findById(userId).select('-passwordHash -refreshTokens').lean<IUserSafe>();

  if (!user) {
    throw createNotFoundError('user not found');
  }

  return user;
};

// -------- Update Profile ----------
export const updateProfile = async (userId: string, updatedData: any): Promise<IUserSafe> => {

  const { fullName, phone, street, city, country } = updatedData;

  const finalUpdate: any = {
    fullName,
    phone,
    address: {
      street: street || null,
      city: city || null,
      country: country || null
    }
  };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: finalUpdate },
    { new: true, runValidators: true }
  )
    .select('-passwordHash -refreshTokens')
    .lean<IUserSafe>();

  return user;
};

// -------- Change Password Service ----------
export const changePasswordService = async (
  userId: string,
  newPassword: string,
  currentPassword: string
) => {
  const user = await User.findById(userId).select('+passwordHash +refreshTokens');

  if (!user) throw createNotFoundError('user not found');
  if (!user.passwordHash) throw new Error('passwordHash is missing');

  const isCorrect = await comparePassword(currentPassword, user.passwordHash);
  if (!isCorrect) throw createUnauthorizedError('current password is incorrect');

  const newHash = await hashPassword(newPassword);
  user.passwordHash = newHash;
  user.refreshTokens = [];
  await user.save();

  const { passwordHash, refreshTokens, ...safeUser } = user.toObject();

  return safeUser;
};
