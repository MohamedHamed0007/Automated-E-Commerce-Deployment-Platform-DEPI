import { z } from "zod";

// ----------------------
export const usernameSchema = z
  .string()
    .nonempty("Username is required")
  .min(3, "Username must be at least 3 characters");
export const emailSchema = z
  .string()
  .nonempty("Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .nonempty("Password is required")
  .min(6, "Password must be at least 6 characters");

// ----------------------
// Register Schema
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ----------------------
// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ----------------------
// Refresh Token Schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ----------------------
// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// ----------------------
// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ----------------------
// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().nonempty("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });