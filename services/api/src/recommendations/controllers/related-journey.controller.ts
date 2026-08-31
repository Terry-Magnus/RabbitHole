import { Controller, Get, Param } from '@nestjs/common';
import {
  RecommendationsService,
  type HomepageJourney,
} from '../services/recommendations.service';

export interface RelatedJourneyResponse {
  related: HomepageJourney | null;
}

@Controller('public/journeys/:slug/related')
export class RelatedJourneyController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  // Wrapped in an object rather than returning a bare `HomepageJourney |
  // null` — confirmed directly against the real running server that Nest
  // sends a truly empty body (Content-Length: 0, no Content-Type) for a
  // bare `null` return, not the JSON text "null". A bare fetch().json() on
  // the frontend would throw on that empty body. Wrapping in
  // `{ related: ... }` is never falsy, so it always serializes as real JSON.
  @Get()
  async findRelated(
    @Param('slug') slug: string,
  ): Promise<RelatedJourneyResponse> {
    const related = await this.recommendationsService.findRelatedJourney(slug);
    return { related };
  }
}
