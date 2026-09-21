import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionGuard } from '../../auth/guards/session.guard';
import {
  BookmarksService,
  type BookmarkedJourney,
} from '../services/bookmarks.service';

@UseGuards(SessionGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('journeys/:slug')
  async addBookmark(
    @Req() request: Request,
    @Param('slug') slug: string,
  ): Promise<{ bookmarked: true }> {
    // SessionGuard always attaches request.user before a route runs.
    await this.bookmarksService.addBookmark(request.user!.id, slug);
    return { bookmarked: true };
  }

  @Delete('journeys/:slug')
  async removeBookmark(
    @Req() request: Request,
    @Param('slug') slug: string,
  ): Promise<{ bookmarked: false }> {
    await this.bookmarksService.removeBookmark(request.user!.id, slug);
    return { bookmarked: false };
  }

  @Get('journeys/:slug')
  async isBookmarked(
    @Req() request: Request,
    @Param('slug') slug: string,
  ): Promise<{ bookmarked: boolean }> {
    const bookmarked = await this.bookmarksService.isBookmarked(
      request.user!.id,
      slug,
    );
    return { bookmarked };
  }

  @Get()
  getBookmarks(@Req() request: Request): Promise<BookmarkedJourney[]> {
    return this.bookmarksService.getBookmarks(request.user!.id);
  }
}
