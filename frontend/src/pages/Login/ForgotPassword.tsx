import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link } from "react-router-dom";

/* ================= SCHEMA ================= */

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

/* ================= PAGE ================= */

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("RESET EMAIL:", data.email);
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-gray-100 to-gray-200
                    dark:bg-slate-800 transition-colors">

      <div className="w-full max-w-md
                      bg-white dark:bg-slate-700
                      p-8 rounded-2xl shadow-xl text-center
                      transition-colors">

        {/* ICON */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl
                        bg-blue-600 text-white
                        flex items-center justify-center
                        text-2xl shadow">
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
          <p className="text-green-600 dark:text-green-400 font-medium">
            Reset link sent successfully ✅
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL */}
            <input
              {...register("email")}
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-lg border mb-4 outline-none transition
                focus:ring-2 focus:ring-blue-500
                ${errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-slate-600"}
                bg-white dark:bg-slate-700
                text-gray-900 dark:text-black
                placeholder-gray-400 dark:placeholder:text-gray-500
              `}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mb-3">
                {errors.email.message}
              </p>
            )}

            {/* BUTTON */}
            <button
              disabled={!isValid}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                         hover:bg-blue-700 transition
                         disabled:opacity-50"
            >
              Send Reset Link →
            </button>
          </form>
        )}

        {/* BACK */}
        <Link
          to="/"
          className="block mt-6 text-sm text-gray-500 dark:text-slate-400
                     hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          ← Back to login
        </Link>

      </div>
    </div>
  );
}