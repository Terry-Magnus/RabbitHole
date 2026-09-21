import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionGuard } from '../../auth/guards/session.guard';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import {
  recordProgressSchema,
  type RecordProgressDto,
} from '../dto/record-progress.dto';
import {
  ProgressService,
  type ProgressJourneySummary,
} from '../services/progress.service';

@UseGuards(SessionGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('journeys/:slug')
  recordProgress(
    @Req() request: Request,
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(recordProgressSchema)) dto: RecordProgressDto,
  ): Promise<ProgressJourneySummary> {
    return this.progressService.recordProgress(
      // SessionGuard always attaches request.user before a route runs.
      request.user!.id,
      slug,
      dto.nodePosition,
    );
  }

  @Post('journeys/:slug/complete')
  markComplete(
    @Req() request: Request,
    @Param('slug') slug: string,
  ): Promise<ProgressJourneySummary> {
    return this.progressService.markComplete(request.user!.id, slug);
  }

  @Get('continue-learning')
  getContinueLearning(
    @Req() request: Request,
  ): Promise<ProgressJourneySummary[]> {
    return this.progressService.getContinueLearning(request.user!.id);
  }

  @Get('library')
  getLibrary(@Req() request: Request): Promise<ProgressJourneySummary[]> {
    return this.progressService.getLibrary(request.user!.id);
  }
}
