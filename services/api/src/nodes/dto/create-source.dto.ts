import { z } from 'zod';

export const createSourceSchema = z.object({
  label: z.string().min(1).max(200),
  url: z.string().url(),
});

export type CreateSourceDto = z.infer<typeof createSourceSchema>;
