import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { IUserSafe } from '@/types/User/user.mongoose.types';
import { createInternalError } from '../ApiErrors/ApiErrors';
import { env } from '../../config/env/env';

let transporter: Transporter | null = null;

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const initializeEmailTransporter = (): void => {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

export const sendEmail = async (options: EmailOptions): Promise<SentMessageInfo> => {
  if (!transporter) initializeEmailTransporter();
  if (!transporter) throw createInternalError('Email transporter not initialized');

  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_FROM || '',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw createInternalError('Failed to send email');
  }
};

export const sendWelcomeEmail = async (user: IUserSafe): Promise<SentMessageInfo> => {
  const subject = `Welcome to ${process.env.APP_NAME || 'ShipSphere'}!`;
  const html = `
    <h1>Welcome ${user.fullName}</h1>
    <h2>Thanks for using our website</h2>
  `;

  return sendEmail({ to: user.email, subject, html });
};

interface PasswordResetEmailParams {
  firstName: string;
  email: string;
}

export const sendPasswordResetEmail = async (
  user: PasswordResetEmailParams,
  resetToken: string
): Promise<SentMessageInfo> => {
  const resetURL = `${env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Hi${user.firstName},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetURL}">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

export const verifyEmailTransporter = async () => {
  try {
    if (!transporter) initializeEmailTransporter();
    if (!transporter) throw new Error('Email transporter initialization failed');
    await transporter.verify();

    return true;
  } catch (error) {
    return false;
  }
};
