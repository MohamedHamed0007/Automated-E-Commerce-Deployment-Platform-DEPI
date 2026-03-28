import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Truck } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

const onSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    localStorage.setItem("signupData", JSON.stringify({
      email: data.email,
      password: data.password,
    }));

    toast.success("Account created successfully!");
    navigate("/login"); 

  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div  className=" lg:h-screen grid lg:grid-cols-2 pt-24 lg:pt-0 container">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between h-full px-16 py-12 bg-linear-to-br from-blue-600 to-blue-800 text-white">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Truck className="text-white" size={24} />
          </div>
          <span className="text-xl font-semibold tracking-wide">
            ShipSphere
          </span>
        </div>

        {/* TEXT */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Join the future of logistics
          </h1>
          <p className="text-lg opacity-90">
            Create an account to start comparing shipping rates and saving on
            your international freight costs today.
          </p>
        </div>

        {/* IMAGE */}

        <div className="mt-8 mb-6 flex justify-center">
          <div className="relative"></div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center h-full px-6 pt-5 pb-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            {/* TITLE */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Create Account
              </h2>
              <p className="text-gray-500">
                Join thousands of businesses optimizing their shipping costs
              </p>
            </div>

            {/* FULL NAME */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                {...register("fullName")}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                {...register("email")}
                placeholder="name@company.com"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* TERMS AND CONDITIONS */}
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600     
  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                  hover:bg-blue-700 transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </button>

            {/* DIVIDER */}
            {/* <div className="flex items-center gap-4 my-6 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              OR CONTINUE WITH
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div> */}

            {/* GOOGLE SIGNUP */}
            {/* <button
              type="button"
              className="w-full border border-gray-300 dark:border-gray-600 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700      
  transition font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74
  3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99    
  20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18
  4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6      
  3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button> */}

            {/* LOGIN LINK */}
            <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium dark:text-blue-400"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
