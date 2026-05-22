// Zod is a popular, TypeScript-first schema declaration and validation library
import * as z from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["contributor", "maintainer"])
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});