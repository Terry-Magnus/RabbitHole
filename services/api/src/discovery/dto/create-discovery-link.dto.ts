import { z } from 'zod';

export const createDiscoveryLinkSchema = z.object({
  targetJourneyId: z.string().min(1),
  label: z.string().min(1).max(200).optional(),
});

export type CreateDiscoveryLinkDto = z.infer<typeof createDiscoveryLinkSchema>;
