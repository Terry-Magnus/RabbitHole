import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JourneysModule } from '../journeys/journeys.module';
import { BookmarksController } from './controllers/bookmarks.controller';
import { BookmarksRepository } from './repositories/bookmarks.repository';
import { BookmarksService } from './services/bookmarks.service';

@Module({
  imports: [AuthModule, JourneysModule],
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksRepository],
})
export class UsersModule {}
