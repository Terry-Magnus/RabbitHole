import { Injectable } from '@nestjs/common';
import type { JourneyDifficulty } from '@prisma/client';
import { JourneysService } from '../../journeys/services/journeys.service';
import {
  BookmarksRepository,
  type BookmarkWithJourney,
} from '../repositories/bookmarks.repository';

export interface BookmarkedJourney {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
}

function toSummary(row: BookmarkWithJourney): BookmarkedJourney {
  return {
    id: row.journey.id,
    slug: row.journey.slug,
    title: row.journey.title,
    description: row.journey.description,
    difficulty: row.journey.difficulty,
  };
}

@Injectable()
export class BookmarksService {
  constructor(
    private readonly bookmarksRepository: BookmarksRepository,
    private readonly journeysService: JourneysService,
  ) {}

  async addBookmark(userId: string, slug: string): Promise<void> {
    const journey = await this.journeysService.findPublishedBySlug(slug);
    await this.bookmarksRepository.upsert(userId, journey.id);
  }

  async removeBookmark(userId: string, slug: string): Promise<void> {
    const journey = await this.journeysService.findPublishedBySlug(slug);
    await this.bookmarksRepository.deleteIfExists(userId, journey.id);
  }

  async isBookmarked(userId: string, slug: string): Promise<boolean> {
    const journey = await this.journeysService.findPublishedBySlug(slug);
    return this.bookmarksRepository.exists(userId, journey.id);
  }

  async getBookmarks(userId: string): Promise<BookmarkedJourney[]> {
    const rows = await this.bookmarksRepository.findByUser(userId);
    return rows.map(toSummary);
  }
}
