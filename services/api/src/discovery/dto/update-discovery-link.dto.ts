import { z } from 'zod';

export const updateDiscoveryLinkSchema = z.object({
  targetJourneyId: z.string().min(1).optional(),
  label: z.string().min(1).max(200).nullable().optional(),
});

export type UpdateDiscoveryLinkDto = z.infer<typeof updateDiscoveryLinkSchema>;
