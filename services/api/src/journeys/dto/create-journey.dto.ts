import { JourneyDifficulty } from '@prisma/client';
import { z } from 'zod';

export const createJourneySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  difficulty: z.nativeEnum(JourneyDifficulty),
  slug: z.string().min(1).max(200).optional(),
});

export type CreateJourneyDto = z.infer<typeof createJourneySchema>;
