import { Module } from '@nestjs/common';
import { JourneysModule } from '../journeys/journeys.module';
import { HomepageController } from './controllers/homepage.controller';
import { RelatedJourneyController } from './controllers/related-journey.controller';
import { RecommendationsRepository } from './repositories/recommendations.repository';
import { RecommendationsService } from './services/recommendations.service';

@Module({
  imports: [JourneysModule],
  controllers: [HomepageController, RelatedJourneyController],
  providers: [RecommendationsService, RecommendationsRepository],
})
export class RecommendationsModule {}
