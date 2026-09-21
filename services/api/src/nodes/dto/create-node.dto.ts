import { z } from 'zod';

export const createNodeSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  // Plain text (not sanitized HTML) — a single short authored payoff line,
  // not rich content. Optional and nullable: omitted means "don't touch
  // it" on update, null explicitly clears a previously-set one.
  ahaMoment: z.string().trim().min(1).max(500).nullable().optional(),
});

export type CreateNodeDto = z.infer<typeof createNodeSchema>;
