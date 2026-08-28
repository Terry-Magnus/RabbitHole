import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { JourneyNode } from '@prisma/client';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import { createNodeSchema, type CreateNodeDto } from '../dto/create-node.dto';
import {
  reorderNodesSchema,
  type ReorderNodesDto,
} from '../dto/reorder-nodes.dto';
import { updateNodeSchema, type UpdateNodeDto } from '../dto/update-node.dto';
import { NodesService } from '../services/nodes.service';

@Controller('journeys/:journeyId/nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  findAll(@Param('journeyId') journeyId: string): Promise<JourneyNode[]> {
    return this.nodesService.findAll(journeyId);
  }

  @Get(':id')
  findById(
    @Param('journeyId') journeyId: string,
    @Param('id') id: string,
  ): Promise<JourneyNode> {
    return this.nodesService.findById(journeyId, id);
  }

  @Post()
  create(
    @Param('journeyId') journeyId: string,
    @Body(new ZodValidationPipe(createNodeSchema)) dto: CreateNodeDto,
  ): Promise<JourneyNode> {
    return this.nodesService.create(journeyId, dto);
  }

  @Patch(':id')
  update(
    @Param('journeyId') journeyId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateNodeSchema)) dto: UpdateNodeDto,
  ): Promise<JourneyNode> {
    return this.nodesService.update(journeyId, id, dto);
  }

  @Delete(':id')
  delete(
    @Param('journeyId') journeyId: string,
    @Param('id') id: string,
  ): Promise<JourneyNode> {
    return this.nodesService.delete(journeyId, id);
  }

  @Post('reorder')
  reorder(
    @Param('journeyId') journeyId: string,
    @Body(new ZodValidationPipe(reorderNodesSchema)) dto: ReorderNodesDto,
  ): Promise<JourneyNode[]> {
    return this.nodesService.reorder(journeyId, dto);
  }
}
