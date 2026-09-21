import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

const journeySelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  difficulty: true,
} satisfies Prisma.JourneySelect;

export type BookmarkWithJourney = Prisma.BookmarkGetPayload<{
  include: { journey: { select: typeof journeySelect } };
}>;

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  // A genuine no-op `update` if the row already exists — simpler than
  // catching a unique-constraint violation for the same idempotent result.
  upsert(userId: string, journeyId: string): Promise<BookmarkWithJourney> {
    return this.prisma.bookmark.upsert({
      where: { userId_journeyId: { userId, journeyId } },
      create: {
        user: { connect: { id: userId } },
        journey: { connect: { id: journeyId } },
      },
      update: {},
      include: { journey: { select: journeySelect } },
    });
  }

  // deleteMany (not delete) specifically because it doesn't throw when
  // nothing matches — unbookmarking something that isn't bookmarked stays
  // a harmless no-op.
  async deleteIfExists(userId: string, journeyId: string): Promise<void> {
    await this.prisma.bookmark.deleteMany({ where: { userId, journeyId } });
  }

  async exists(userId: string, journeyId: string): Promise<boolean> {
    const count = await this.prisma.bookmark.count({
      where: { userId, journeyId },
    });

    return count > 0;
  }

  findByUser(userId: string): Promise<BookmarkWithJourney[]> {
    return this.prisma.bookmark.findMany({
      where: { userId, journey: { status: 'PUBLISHED' } },
      include: { journey: { select: journeySelect } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
