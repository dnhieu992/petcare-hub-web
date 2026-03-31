import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z
      .string()
      .trim()
      .min(1, 'Work email is required')
      .email('Enter a valid work email address'),
    companyName: z.string().trim().min(1, 'Company name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
