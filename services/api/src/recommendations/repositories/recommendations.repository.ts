import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import type { HomepageJourney } from '../services/recommendations.service';

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // searchVector is the GENERATED ALWAYS ... STORED column from Unit 10
  // (context/specs/10-search.md) — Prisma's fluent API can't express
  // full-text queries against it, so this is a raw query. `query` and
  // `excludeId` are safely parameterized by Prisma's tagged-template
  // $queryRaw, never string-concatenated into the SQL.
  async findMostSimilarPublished(
    query: string,
    excludeId: string,
  ): Promise<HomepageJourney | null> {
    const rows = await this.prisma.$queryRaw<HomepageJourney[]>`
      SELECT "id", "slug", "title", "description", "difficulty"
      FROM "journey"
      WHERE "status" = 'PUBLISHED'
        AND "id" != ${excludeId}
        AND "searchVector" @@ websearch_to_tsquery('english', ${query})
      ORDER BY ts_rank("searchVector", websearch_to_tsquery('english', ${query})) DESC
      LIMIT 1;
    `;

    return rows[0] ?? null;
  }
}
