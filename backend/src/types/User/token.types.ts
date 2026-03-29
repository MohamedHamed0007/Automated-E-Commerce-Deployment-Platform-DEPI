export interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin" | "customer" | "driver";
}