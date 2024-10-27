import { z } from 'zod';

export const DataSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email(),
  gender: z.enum(['male', 'female']),
  agree: z.boolean().refine((v) => v, {
    message: 'You must agree to the terms and conditions.',
  }),
});

export type Data = z.infer<typeof DataSchema>;
