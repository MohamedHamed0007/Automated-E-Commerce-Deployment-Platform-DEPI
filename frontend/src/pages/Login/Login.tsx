import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

// Redux imports
import { loginUser } from '../../redux/thunk/loginThunk';
import type { AppDispatch, RootState } from '../../redux/store';

// Validation Schema
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Select auth state from Redux
  const { loading, error: serverError } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    const resultAction = await dispatch(loginUser(data));
    console.log('Login result:', resultAction);

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Logged in successfully!');
      navigate('/user');
    } else {
      // Display the error message returned from the backend/thunk
      toast.error( 'Login failed - Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen lg:h-screen grid lg:grid-cols-2 bg-white dark:bg text-gray-900 dark:text-white">
      <div className="hidden lg:flex flex-col h-full px-20 py-12 bg-[#0E1526] border-r border-slate-700/20 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-blue-600/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-purple-600/30 rounded-full blur-[160px]" />
        </div>

        {/* Title Section */}
        <div className="relative z-10">
          <h1 className="text-6xl font-black leading-[1.1] mb-6 text-white tracking-tight mix-blend-screen">
            Compare 
            <span className="text-blue-400 italic drop-shadow-lg "> shipping</span> rates globally.
          </h1>

          <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
            The world's most advanced logistics comparison platform. Save up to 40% on your
            international freight costs today.
          </p>
        </div>

        {/* Image */}
        <div className="relative z-10 group mt-10">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            alt="Logistics"
            className="
        rounded-2xl shadow-2xl w-full aspect-video object-cover border border-white/10
        grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-[1.02]
      "
          />
        </div>

        <div className="relative z-10 text-slate-400 text-sm mt-4">Enterprise Grade Security</div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="flex items-center justify-center h-full px-6 bg-gray-50 dark:bg-slate-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl transition-colors duration-300"
        >
          <h2 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8">
            Please enter your details to sign in to your account.
          </p>

          {/* EMAIL INPUT */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 dark:text-slate-300">Email address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              className={`mt-1 w-full px-4 py-3 rounded-lg border outline-none transition
          focus:ring-2 focus:ring-blue-500
          ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}
          bg-white dark:bg-slate-900 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder:text-slate-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD INPUT */}
          <div className="mb-6">
            <div className="flex justify-between text-sm">
              <label className="text-gray-700 dark:text-slate-300">Password</label>
              <Link to="/forgot" className="text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`mt-1 w-full px-4 py-3 rounded-lg border outline-none transition
          focus:ring-2 focus:ring-blue-500
          ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}
          bg-white dark:bg-slate-900 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder:text-slate-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                 hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm mt-7 text-gray-700 dark:text-slate-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 cursor-pointer hover:underline">
              Sign up for free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
