import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

/* ================= SCHEMA ================= */
const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type FormData = z.infer<typeof schema>;

/* ================= PAGE ================= */
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: data.password
      });
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                    bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500 p-4"
    >
      {/* Card Container */}
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800/50 
                      backdrop-blur-xl border border-white dark:border-slate-700/50
                      p-8 rounded-3xl shadow-2xl dark:shadow-blue-900/20 
                      text-center transition-all"
      >
        {/* ICON - Animated pulse for better look */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl
                        bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400
                        flex items-center justify-center
                        text-3xl shadow-inner animate-pulse"
        >
          🔒
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white tracking-tight">
          New Password
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Set a strong password to protect your{' '}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">ShipSphere</span>{' '}
          account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* NEW PASSWORD */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200
                focus:ring-4 focus:ring-blue-500/20
                ${
                  errors.password
                    ? 'border-red-500 dark:border-red-500/50'
                    : 'border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                }
                bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100
                placeholder-slate-400 dark:placeholder-slate-600
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200
                focus:ring-4 focus:ring-blue-500/20
                ${
                  errors.confirmPassword
                    ? 'border-red-500 dark:border-red-500/50'
                    : 'border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                }
                bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100
                placeholder-slate-400 dark:placeholder-slate-600
              `}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 
                       transition-all active:scale-[0.98] disabled:opacity-50 
                       disabled:hover:bg-blue-600 flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <Link
          to="/login"
          className="inline-block mt-8 text-sm font-medium text-slate-500 dark:text-slate-400
                      hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}
