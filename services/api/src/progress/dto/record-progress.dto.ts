import { z } from 'zod';

export const recordProgressSchema = z.object({
  nodePosition: z.number().int().positive(),
});

export type RecordProgressDto = z.infer<typeof recordProgressSchema>;
