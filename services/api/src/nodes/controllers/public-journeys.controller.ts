import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import type { Journey } from '@prisma/client';
import {
  JourneysService,
  type PublicJourney,
} from '../../journeys/services/journeys.service';
import { NodesService } from '../services/nodes.service';

@Controller('public/journeys')
export class PublicJourneysController {
  constructor(
    private readonly journeysService: JourneysService,
    private readonly nodesService: NodesService,
  ) {}

  // Must come before the ':slug' route below, or NestJS would match
  // "random" as a slug value.
  @Get('random')
  findRandom(): Promise<Journey> {
    return this.journeysService.findRandomPublished();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Promise<PublicJourney> {
    return this.journeysService.findPublishedBySlug(slug);
  }

  @Get(':slug/nodes/:position')
  findNodeByPosition(
    @Param('slug') slug: string,
    @Param('position', ParseIntPipe) position: number,
  ) {
    return this.nodesService.findPublishedNodeByPosition(slug, position);
  }
}
