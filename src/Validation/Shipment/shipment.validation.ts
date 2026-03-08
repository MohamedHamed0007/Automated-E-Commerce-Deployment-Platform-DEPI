import { z } from "zod";

export const createShipmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required"),

  description: z
    .string()
    .min(5, "Description is required"),

  weight: z
    .number()
    .positive("Weight must be positive"),

  origin: z
    .string()
    .min(2, "Origin is required"),

  destination: z
    .string()
    .min(2, "Destination is required"),

  price: z
    .number()
    .positive("Price must be positive"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;