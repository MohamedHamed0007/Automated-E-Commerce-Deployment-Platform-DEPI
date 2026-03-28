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
    // التعديل هنا ليتوافق مع الباك اند
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
      <div className="hidden lg:flex flex-col justify-between h-full px-20 py-16 bg-[#0E1526] border-r border-slate-700/20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-600/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-purple-600/30 rounded-full blur-[160px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 text-white animate-pulse">
            🚢
          </div>
          <span className="text-2xl font-black tracking-tight text-white">ShipSphere</span>
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
      <div className="flex items-center justify-center px-8 lg:px-16 py-12 overflow-y-auto">
        <div className="w-full max-w-[460px] bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 rounded-2xl shadow-2xl p-10 animate-fadeIn">
          {/* Header */}
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight">Create Account</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Join thousands of businesses globally.
            </p>
          </header>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* FULLNAME */}
            <div>
              <label className="label">Full Name</label>
              <input
                {...register('fullName')}
                placeholder="Ex: John Doe"
                className={`input ${errors.fullName && 'input-error'}`}
              />
              {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="label">Work Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`input ${errors.email && 'input-error'}`}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* PASSWORDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className={`input ${errors.password && 'input-error'}`}
                />
              </div>
              <div>
                <label className="label">Confirm</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className={`input ${errors.confirmPassword && 'input-error'}`}
                />
              </div>
            </div>

            {(errors.password || errors.confirmPassword) && (
              <p className="error-text">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            {/* TERMS */}
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" {...register('terms')} className="checkbox" />
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <span className="text-blue-600 dark:text-blue-300 underline cursor-pointer">
                  Terms
                </span>{' '}
                and{' '}
                <span className="text-blue-600 dark:text-blue-300 underline cursor-pointer">
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {errors.terms && <p className="error-text">{errors.terms.message}</p>}

            {/* BUTTON */}
            <button type="submit" disabled={!isValid || loading} className="btn-primary">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  Register Account <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-6">
              Already a member?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 underline font-semibold"
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
