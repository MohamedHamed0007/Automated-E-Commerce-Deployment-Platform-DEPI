import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { IUserSafe } from '@/types/user';
import { createInternalError } from '../ApiErrors/ApiErrors';

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
