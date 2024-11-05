import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().min(1, {
    message: "email is required",
  }),
  password: z
    .string()
    .min(8, {
      message: "password must be at least 8 characters.",
    })
    .max(32),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(1, {
      message: "name is required",
    }),
    email: z.string().email().min(1, {
      message: "email is required",
    }),
    password: z
      .string()
      .min(8, {
        message: "password must be at least 8 characters.",
      })
      .max(32)
      .refine(
        (value) => {
          return /[a-z]/.test(value);
        },
        { message: "Password must contain at least one lowercase letter" }
      )
      .refine(
        (value) => {
          return /[A-Z]/.test(value);
        },
        { message: "Password must contain at least one uppercase letter" }
      )
      .refine(
        (value) => {
          return /[\W_]/.test(value);
        },
        { message: "Password must contain at least one special case letter" }
      ),
    confirmPassword: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    { message: "password must match", path: ["confirmPassword"] }
  );

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type LoginSchemaType = z.infer<typeof LoginSchema>;
