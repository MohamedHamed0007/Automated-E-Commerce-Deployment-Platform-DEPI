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
                    dark:bg-slate-800 transition-colors"
    >
      <div
        className="w-full max-w-md
                      bg-white dark:bg-slate-700
                      p-8 rounded-2xl shadow-xl text-center
                      transition-colors"
      >
        {/* ICON */}
        <div
          className="w-14 h-14 mx-auto mb-4 rounded-xl
                        bg-blue-600 text-white
                        flex items-center justify-center
                        text-2xl shadow"
        >
          🚚
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Forgot your password?
        </h2>

        <p className="text-gray-500 dark:text-slate-400 mb-6">
          Enter your email and we’ll send you a reset link
        </p>

        {sent ? (
          <div className="space-y-4">
            <p className="text-green-600 dark:text-green-400 font-medium">
              Reset link sent successfully ✅
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-300">
              Please check your inbox (and spam folder) to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL INPUT */}
            <div className="relative mb-4">
              <input
                {...register('email')}
                type="email"
                disabled={isLoading}
                placeholder="name@company.com"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-blue-500
                    ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}
                    bg-white dark:bg-slate-800
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder:text-gray-500
                    disabled:opacity-60
                `}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mb-3 text-left">{errors.email.message}</p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                         hover:bg-blue-700 transition
                         disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                'Send Reset Link →'
              )}
            </button>
          </form>
        )}

        {/* BACK TO LOGIN */}
        <Link
          to="/login"
          className="block mt-6 text-sm text-gray-500 dark:text-slate-400
                     hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
