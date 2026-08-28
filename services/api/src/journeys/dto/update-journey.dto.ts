import { z } from 'zod';
import { createJourneySchema } from './create-journey.dto';

export const updateJourneySchema = createJourneySchema.partial();

export type UpdateJourneyDto = z.infer<typeof updateJourneySchema>;
