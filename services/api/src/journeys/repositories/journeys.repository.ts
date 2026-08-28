import { Injectable } from '@nestjs/common';
import type { Journey, Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

// Includes node `content` — needed transiently to compute reading time
// (see journeys.service.ts). The service strips it before returning the
// public-facing shape; the actual HTTP response never ships full node
// content from this query.
export type JourneyWithNodeContent = Prisma.JourneyGetPayload<{
  include: {
    nodes: {
      select: { id: true; title: true; order: true; content: true };
    };
  };
}>;

const NODE_SELECT_WITH_CONTENT = {
  id: true,
  title: true,
  order: true,
  content: true,
} satisfies Prisma.JourneyNodeSelect;

@Injectable()
export class JourneysRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<Journey[]> {
    return this.prisma.journey.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  findById(id: string): Promise<Journey | null> {
    return this.prisma.journey.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<Journey | null> {
    return this.prisma.journey.findUnique({ where: { slug } });
  }

  findPublishedBySlugWithNodes(
    slug: string,
  ): Promise<JourneyWithNodeContent | null> {
    return this.prisma.journey.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        nodes: {
          select: NODE_SELECT_WITH_CONTENT,
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  findManyPublished(): Promise<Journey[]> {
    return this.prisma.journey.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    });
  }

  create(data: Prisma.JourneyCreateInput): Promise<Journey> {
    return this.prisma.journey.create({ data });
  }

  update(id: string, data: Prisma.JourneyUpdateInput): Promise<Journey> {
    return this.prisma.journey.update({ where: { id }, data });
  }
}
