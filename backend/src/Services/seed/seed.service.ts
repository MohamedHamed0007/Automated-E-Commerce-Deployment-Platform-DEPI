import User from '../../config/DB/Models/User/user.models';
import { hashPassword } from '../../utils/PasswordUtils/password.utils';

/**
 * Seed database with default admin user if none exists
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✅ Admin user already exists, skipping seed');
      return;
    }

    const hashedPassword = await hashPassword('admin123');

    const adminUser = await User.create({
      fullName: 'Admin',
      email: 'admin@shipsphere.local',
      passwordHash: hashedPassword,
      role: 'admin',
      isVerified: true,
      isBlocked: false,
    });

    console.log('✅ Default admin user created:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
};
