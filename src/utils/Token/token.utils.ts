import jwt from "jsonwebtoken";
import { env } from "../../config/env/env";

const SECRET_KEY: string = env.JWT_SECRET;

// Generate Token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "7d",
  });
};

// Verify Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};