import { z } from 'zod';

export const DataSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email(),
  gender: z.enum(['male', 'female']),
});

export type Data = z.infer<typeof DataSchema>;
