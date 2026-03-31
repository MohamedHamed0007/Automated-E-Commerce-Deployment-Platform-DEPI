import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

/* ================= SCHEMA ================= */
const schema = z.object({
  email: z.string().email('Please enter a valid email')
});

type FormData = z.infer<typeof schema>;

/* ================= PAGE ================= */
export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
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
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: data.email
      });

      setSent(true);
      toast.success(response.data.message || 'Reset link sent to your email!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
                 bg-gradient-to-br from-gray-100 to-gray-200
                 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500"
    >
      <div
        className="w-full max-w-md
                   bg-white dark:bg-slate-900
                   p-8 rounded-2xl shadow-xl text-center
                   border border-transparent dark:border-slate-800
                   transition-all duration-300"
      >
        {/* ICON */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl
                     bg-blue-600 text-white
                     flex items-center justify-center
                     text-3xl shadow-lg shadow-blue-500/20"
        >
          🚚
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Forgot your password?
        </h2>

        <p className="text-gray-500 dark:text-slate-400 mb-8">
          Enter your email and we’ll send you a reset link
        </p>

        {sent ? (
          <div className="space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
            <p className="text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2">
              <span>Reset link sent successfully</span>
              <span className="text-xl">✅</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-300 leading-relaxed">
              Please check your inbox (and spam folder) to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  disabled={isLoading}
                  placeholder="name@company.com"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${
                      errors.email
                        ? 'border-red-500 dark:border-red-500/50 bg-red-50/30'
                        : 'border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950'
                    }
                    text-gray-900 dark:text-slate-100
                    placeholder-gray-400 dark:placeholder-gray-600
                    disabled:opacity-60
                  `}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold
                         hover:bg-blue-700 active:scale-[0.98] transition-all
                         disabled:opacity-50 disabled:active:scale-100
                         flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                'Send Reset Link →'
              )}
            </button>
          </form>
        )}

        {/* BACK TO LOGIN */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-500 dark:text-slate-400
                       hover:text-blue-600 dark:hover:text-blue-400 transition-colors
                       flex items-center justify-center gap-1.5"
          >
            <span>←</span>
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
