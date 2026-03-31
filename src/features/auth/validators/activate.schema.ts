import { z } from 'zod'

export const activateSchema = z.object({
  passcode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit activation code'),
})

export type ActivateFormValues = z.infer<typeof activateSchema>
