import { Controller, Get, Param } from '@nestjs/common';
import {
  DiscoveryLinksService,
  type PublicDiscoveryLink,
} from '../services/discovery-links.service';

@Controller('public/nodes/:nodeId/discovery-links')
export class PublicDiscoveryLinksController {
  constructor(private readonly discoveryLinksService: DiscoveryLinksService) {}

  @Get()
  findForNode(@Param('nodeId') nodeId: string): Promise<PublicDiscoveryLink[]> {
    return this.discoveryLinksService.findPublicLinksForNode(nodeId);
  }
}
