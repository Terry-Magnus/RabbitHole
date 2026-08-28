import { Module } from '@nestjs/common';
import { JourneysModule } from '../journeys/journeys.module';
import { NodesModule } from '../nodes/nodes.module';
import { DiscoveryLinksController } from './controllers/discovery-links.controller';
import { PublicDiscoveryLinksController } from './controllers/public-discovery-links.controller';
import { DiscoveryLinksRepository } from './repositories/discovery-links.repository';
import { DiscoveryLinksService } from './services/discovery-links.service';

@Module({
  imports: [NodesModule, JourneysModule],
  controllers: [DiscoveryLinksController, PublicDiscoveryLinksController],
  providers: [DiscoveryLinksService, DiscoveryLinksRepository],
})
export class DiscoveryModule {}
