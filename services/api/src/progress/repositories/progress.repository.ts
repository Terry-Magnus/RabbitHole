import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

const journeySelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  difficulty: true,
  _count: { select: { nodes: true } },
} satisfies Prisma.JourneySelect;

export type JourneyProgressWithJourney = Prisma.JourneyProgressGetPayload<{
  include: { journey: { select: typeof journeySelect } };
}>;

export interface UpsertProgressData {
  userId: string;
  journeyId: string;
  lastNodePosition: number;
  completedAt?: Date;
}

@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(data: UpsertProgressData): Promise<JourneyProgressWithJourney> {
    const { userId, journeyId, lastNodePosition, completedAt } = data;

    return this.prisma.journeyProgress.upsert({
      where: { userId_journeyId: { userId, journeyId } },
      create: {
        user: { connect: { id: userId } },
        journey: { connect: { id: journeyId } },
        lastNodePosition,
        completedAt,
      },
      // completedAt is only ever passed by markComplete — recordProgress
      // leaves it untouched (an undefined field is omitted from a Prisma
      // update, never nulled out).
      update: {
        lastNodePosition,
        ...(completedAt ? { completedAt } : {}),
      },
      include: { journey: { select: journeySelect } },
    });
  }

  findByUser(
    userId: string,
    options?: { limit?: number },
  ): Promise<JourneyProgressWithJourney[]> {
    return this.prisma.journeyProgress.findMany({
      where: { userId, journey: { status: 'PUBLISHED' } },
      include: { journey: { select: journeySelect } },
      orderBy: { updatedAt: 'desc' },
      take: options?.limit,
    });
  }
}
