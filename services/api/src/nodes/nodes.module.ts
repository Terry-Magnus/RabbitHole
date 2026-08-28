import { Module } from '@nestjs/common';
import { JourneysModule } from '../journeys/journeys.module';
import { UploadsModule } from '../uploads/uploads.module';
import { NodeImageController } from './controllers/node-image.controller';
import { NodesController } from './controllers/nodes.controller';
import { PublicJourneysController } from './controllers/public-journeys.controller';
import { SourcesController } from './controllers/sources.controller';
import { NodesRepository } from './repositories/nodes.repository';
import { NodesService } from './services/nodes.service';

@Module({
  imports: [JourneysModule, UploadsModule],
  controllers: [
    NodesController,
    SourcesController,
    NodeImageController,
    PublicJourneysController,
  ],
  providers: [NodesService, NodesRepository],
  exports: [NodesService],
})
export class NodesModule {}
