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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100 font-sans">
      {/* LEFT PANEL: Branding */}
      <div className="hidden lg:flex flex-col justify-between h-full px-20 py-16 bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 text-white">
              🚢
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              ShipSphere
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[0.95] mb-6 text-white tracking-tighter uppercase">
            Start your <br />
            <span className="text-blue-500 italic">Journey</span> here.
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-sm">
            Join the most advanced logistics network and start optimizing your global freight costs.
          </p>
        </div>

        <div className="relative z-10 group">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            alt="Logistics"
            className="relative rounded-2xl shadow-2xl w-full aspect-video object-cover border border-white/5 grayscale-[0.3] group-hover:grayscale-0 transition duration-500"
          />
        </div>
      </div>

      {/* RIGHT PANEL: Signup Form */}
      <div className="flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          <header className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Join thousands of businesses globally.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* FULL NAME */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Full Name
              </label>
              <input
                {...register('fullName')}
                placeholder="Ex: John Doe"
                className={`w-full px-5 py-3.5 rounded-xl border transition-all duration-300
                  bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-white 
                  placeholder:text-slate-400 dark:placeholder:text-slate-300/60
                  outline-none focus:ring-4 focus:ring-blue-500/10
                  ${errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Work Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`w-full px-5 py-3.5 rounded-xl border transition-all duration-300
                  bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-white 
                  placeholder:text-slate-400 dark:placeholder:text-slate-300/60
                  outline-none focus:ring-4 focus:ring-blue-500/10
                  ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/40 
                    text-slate-900 dark:text-white placeholder:text-slate-300/60 outline-none
                    ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/40 
                    text-slate-900 dark:text-white placeholder:text-slate-300/60 outline-none
                    ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`}
                />
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            {/* TERMS */}
            <div className="flex items-start gap-3 py-2 px-1">
              <input
                id="terms"
                type="checkbox"
                {...register('terms')}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"
              />
              <label
                htmlFor="terms"
                className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight"
              >
                I agree to the{' '}
                <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-blue-600 dark:text-blue-400 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-[10px] font-bold ml-1">{errors.terms.message}</p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl disabled:opacity-40 flex justify-center items-center gap-3"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Register Account <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 pt-6">
              Already a member?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-500 hover:underline decoration-2 underline-offset-4"
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
