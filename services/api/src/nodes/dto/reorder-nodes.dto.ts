import { z } from 'zod';

export const reorderNodesSchema = z.object({
  nodeIds: z.array(z.string().min(1)).min(1),
});

export type ReorderNodesDto = z.infer<typeof reorderNodesSchema>;
