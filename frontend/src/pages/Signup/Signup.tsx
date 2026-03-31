import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../redux/thunk/loginThunk';

const schema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, 'You must accept terms')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    const resultAction = await dispatch(
      registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 'user'
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Account created! Please login.');
      navigate('/login');
    } else {
      toast.error((resultAction.payload as string) || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-white to-slate-100 dark:from-[#080B15] dark:to-[#0E1424] text-slate-900 dark:text-slate-100 font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col h-full px-20 py-12 bg-[#0E1526] border-r border-slate-700/20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-600/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-purple-600/30 rounded-full blur-[160px]" />
        </div>


        {/* Title */}
        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[0.9] mb-6 text-white tracking-tight mix-blend-screen">
            Start your <br />
            <span className="text-blue-400 italic drop-shadow-lg">Journey</span> now.
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-sm leading-relaxed">
            Join the world’s most advanced logistics platform and optimize your global supply chain.
          </p>
        </div>

        {/* Image */}
        <div className="relative z-10 group">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            alt="Logistics"
            className="rounded-2xl shadow-2xl w-full aspect-video object-cover border border-white/10
          grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-4 lg:px-8 py-8 overflow-y-auto min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/50 rounded-3xl shadow-2xl p-6 animate-fadeIn">
          {/* Header */}
          <header className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium text-sm">
              Join thousands of businesses globally.
            </p>
          </header>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="label text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                {...register('fullName')}
                placeholder="Ex: John Doe"
                className={`input mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.fullName && 'border-red-500 focus:ring-red-400'}`}
              />
              {errors.fullName && (
                <p className="error-text text-red-500 mt-1 text-xs">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="label text-sm font-medium text-slate-700 dark:text-slate-300">
                Work Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`input mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email && 'border-red-500 focus:ring-red-400'}`}
              />
              {errors.email && <p className="error-text text-red-500 mt-1 text-xs">{errors.email.message}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="label text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className={`input mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password && 'border-red-500 focus:ring-red-400'}`}
                />
              </div>
              <div className="flex flex-col">
                <label className="label text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm
                </label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className={`input mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword && 'border-red-500 focus:ring-red-400'}`}
                />
              </div>
            </div>

            {(errors.password || errors.confirmPassword) && (
              <p className="error-text text-red-500 text-xs">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2 py-1">
              <input
                type="checkbox"
                {...register('terms')}
                className="checkbox mt-1 accent-blue-500"
              />
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <span className="text-blue-600 dark:text-blue-300 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Terms
                </span>{' '}
                and{' '}
                <span className="text-blue-600 dark:text-blue-300 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {errors.terms && <p className="error-text text-xs">{errors.terms.message}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn-primary w-full py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  Register Account <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-4">
              Already a member?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
