import { z } from 'zod';

export const createNodeSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
});

export type CreateNodeDto = z.infer<typeof createNodeSchema>;
