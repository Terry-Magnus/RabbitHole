import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../shared/zod-validation.pipe';
import {
  createDiscoveryLinkSchema,
  type CreateDiscoveryLinkDto,
} from '../dto/create-discovery-link.dto';
import {
  updateDiscoveryLinkSchema,
  type UpdateDiscoveryLinkDto,
} from '../dto/update-discovery-link.dto';
import type { DiscoveryLinkWithTarget } from '../repositories/discovery-links.repository';
import { DiscoveryLinksService } from '../services/discovery-links.service';

@Controller('nodes/:nodeId/discovery-links')
export class DiscoveryLinksController {
  constructor(private readonly discoveryLinksService: DiscoveryLinksService) {}

  @Get()
  findAll(@Param('nodeId') nodeId: string): Promise<DiscoveryLinkWithTarget[]> {
    return this.discoveryLinksService.findAll(nodeId);
  }

  @Post()
  create(
    @Param('nodeId') nodeId: string,
    @Body(new ZodValidationPipe(createDiscoveryLinkSchema))
    dto: CreateDiscoveryLinkDto,
  ): Promise<DiscoveryLinkWithTarget> {
    return this.discoveryLinksService.create(nodeId, dto);
  }

  @Patch(':id')
  update(
    @Param('nodeId') nodeId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDiscoveryLinkSchema))
    dto: UpdateDiscoveryLinkDto,
  ): Promise<DiscoveryLinkWithTarget> {
    return this.discoveryLinksService.update(nodeId, id, dto);
  }

  @Delete(':id')
  delete(
    @Param('nodeId') nodeId: string,
    @Param('id') id: string,
  ): Promise<DiscoveryLinkWithTarget> {
    return this.discoveryLinksService.delete(nodeId, id);
  }
}
