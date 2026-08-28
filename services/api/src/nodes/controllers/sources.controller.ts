import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Source } from '@prisma/client';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import {
  createSourceSchema,
  type CreateSourceDto,
} from '../dto/create-source.dto';
import {
  updateSourceSchema,
  type UpdateSourceDto,
} from '../dto/update-source.dto';
import { NodesService } from '../services/nodes.service';

@Controller('nodes/:nodeId/sources')
export class SourcesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  findAll(@Param('nodeId') nodeId: string): Promise<Source[]> {
    return this.nodesService.findSources(nodeId);
  }

  @Post()
  create(
    @Param('nodeId') nodeId: string,
    @Body(new ZodValidationPipe(createSourceSchema)) dto: CreateSourceDto,
  ): Promise<Source> {
    return this.nodesService.createSource(nodeId, dto);
  }

  @Patch(':id')
  update(
    @Param('nodeId') nodeId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSourceSchema)) dto: UpdateSourceDto,
  ): Promise<Source> {
    return this.nodesService.updateSource(nodeId, id, dto);
  }

  @Delete(':id')
  delete(
    @Param('nodeId') nodeId: string,
    @Param('id') id: string,
  ): Promise<Source> {
    return this.nodesService.deleteSource(nodeId, id);
  }
}
