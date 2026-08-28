import { Controller, Get } from '@nestjs/common';
import {
  RecommendationsService,
  type Homepage,
} from '../services/recommendations.service';

@Controller('public/homepage')
export class HomepageController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  getHomepage(): Promise<Homepage> {
    return this.recommendationsService.getHomepage();
  }
}
