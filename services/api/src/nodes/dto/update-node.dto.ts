import { z } from 'zod';
import { createNodeSchema } from './create-node.dto';

export const updateNodeSchema = createNodeSchema.partial();

export type UpdateNodeDto = z.infer<typeof updateNodeSchema>;
