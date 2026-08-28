import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { Journey } from '@prisma/client';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import {
  createJourneySchema,
  type CreateJourneyDto,
} from '../dto/create-journey.dto';
import {
  updateJourneySchema,
  type UpdateJourneyDto,
} from '../dto/update-journey.dto';
import { JourneysService } from '../services/journeys.service';

@Controller('journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Get()
  findAll(): Promise<Journey[]> {
    return this.journeysService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Journey> {
    return this.journeysService.findById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createJourneySchema)) dto: CreateJourneyDto,
  ): Promise<Journey> {
    return this.journeysService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateJourneySchema)) dto: UpdateJourneyDto,
  ): Promise<Journey> {
    return this.journeysService.update(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string): Promise<Journey> {
    return this.journeysService.publish(id);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string): Promise<Journey> {
    return this.journeysService.archive(id);
  }

  @Post(':id/feature')
  feature(@Param('id') id: string): Promise<Journey> {
    return this.journeysService.feature(id);
  }

  @Post(':id/unfeature')
  unfeature(@Param('id') id: string): Promise<Journey> {
    return this.journeysService.unfeature(id);
  }
}
