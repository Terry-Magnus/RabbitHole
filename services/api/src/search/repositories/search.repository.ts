import { Injectable } from '@nestjs/common';
import type { JourneyDifficulty } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';

export interface SearchResultRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}

const RESULT_LIMIT = 20;

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  // searchVector is a GENERATED ALWAYS ... STORED column (see the
  // add_journey_search_vector migration) — Prisma's fluent API can't express
  // full-text queries against it, so this is a raw query. Prisma's
  // tagged-template $queryRaw parameterizes `query` safely; it is never
  // string-concatenated into the SQL.
  searchPublishedJourneys(query: string): Promise<SearchResultRow[]> {
    return this.prisma.$queryRaw<SearchResultRow[]>`
      SELECT "id", "slug", "title", "description", "difficulty"
      FROM "journey"
      WHERE "status" = 'PUBLISHED'
        AND "searchVector" @@ websearch_to_tsquery('english', ${query})
      ORDER BY ts_rank("searchVector", websearch_to_tsquery('english', ${query})) DESC
      LIMIT ${RESULT_LIMIT};
    `;
  }
}
