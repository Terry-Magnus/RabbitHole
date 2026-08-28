import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

const targetJourneySelect = {
  id: true,
  slug: true,
  title: true,
  difficulty: true,
  status: true,
} satisfies Prisma.JourneySelect;

export type DiscoveryLinkWithTarget = Prisma.DiscoveryLinkGetPayload<{
  include: { targetJourney: { select: typeof targetJourneySelect } };
}>;

@Injectable()
export class DiscoveryLinksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(nodeId: string): Promise<DiscoveryLinkWithTarget[]> {
    return this.prisma.discoveryLink.findMany({
      where: { nodeId },
      include: { targetJourney: { select: targetJourneySelect } },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(id: string): Promise<DiscoveryLinkWithTarget | null> {
    return this.prisma.discoveryLink.findUnique({
      where: { id },
      include: { targetJourney: { select: targetJourneySelect } },
    });
  }

  create(
    data: Prisma.DiscoveryLinkCreateInput,
  ): Promise<DiscoveryLinkWithTarget> {
    return this.prisma.discoveryLink.create({
      data,
      include: { targetJourney: { select: targetJourneySelect } },
    });
  }

  update(
    id: string,
    data: Prisma.DiscoveryLinkUpdateInput,
  ): Promise<DiscoveryLinkWithTarget> {
    return this.prisma.discoveryLink.update({
      where: { id },
      data,
      include: { targetJourney: { select: targetJourneySelect } },
    });
  }

  delete(id: string): Promise<DiscoveryLinkWithTarget> {
    return this.prisma.discoveryLink.delete({
      where: { id },
      include: { targetJourney: { select: targetJourneySelect } },
    });
  }
}
