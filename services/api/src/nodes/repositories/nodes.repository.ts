import { Injectable } from '@nestjs/common';
import type { JourneyNode, Prisma, Source } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

export type JourneyNodeWithSources = Prisma.JourneyNodeGetPayload<{
  include: { sources: true };
}>;

@Injectable()
export class NodesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(journeyId: string): Promise<JourneyNode[]> {
    return this.prisma.journeyNode.findMany({
      where: { journeyId },
      orderBy: { order: 'asc' },
    });
  }

  findById(id: string): Promise<JourneyNodeWithSources | null> {
    return this.prisma.journeyNode.findUnique({
      where: { id },
      include: { sources: true },
    });
  }

  async findMaxOrder(journeyId: string): Promise<number | null> {
    const result = await this.prisma.journeyNode.aggregate({
      where: { journeyId },
      _max: { order: true },
    });

    return result._max.order;
  }

  create(data: Prisma.JourneyNodeCreateInput): Promise<JourneyNode> {
    return this.prisma.journeyNode.create({ data });
  }

  update(
    id: string,
    data: Prisma.JourneyNodeUpdateInput,
  ): Promise<JourneyNode> {
    return this.prisma.journeyNode.update({ where: { id }, data });
  }

  delete(id: string): Promise<JourneyNode> {
    return this.prisma.journeyNode.delete({ where: { id } });
  }

  // The @@unique([journeyId, order]) constraint is checked per-statement (Prisma
  // doesn't support DEFERRABLE constraints), so directly assigning final order
  // values in one pass can collide with another node's current value mid-transaction.
  // Move everything to guaranteed-unique negative placeholders first, then to the
  // real values, both inside the same transaction.
  async reorder(journeyId: string, nodeIds: string[]): Promise<JourneyNode[]> {
    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        nodeIds.map((id, index) =>
          tx.journeyNode.update({
            where: { id },
            data: { order: -(index + 1) },
          }),
        ),
      );

      await Promise.all(
        nodeIds.map((id, index) =>
          tx.journeyNode.update({ where: { id }, data: { order: index } }),
        ),
      );

      return tx.journeyNode.findMany({
        where: { journeyId },
        orderBy: { order: 'asc' },
      });
    });
  }

  findSourceById(id: string): Promise<Source | null> {
    return this.prisma.source.findUnique({ where: { id } });
  }

  createSource(data: Prisma.SourceCreateInput): Promise<Source> {
    return this.prisma.source.create({ data });
  }

  updateSource(id: string, data: Prisma.SourceUpdateInput): Promise<Source> {
    return this.prisma.source.update({ where: { id }, data });
  }

  deleteSource(id: string): Promise<Source> {
    return this.prisma.source.delete({ where: { id } });
  }
}
