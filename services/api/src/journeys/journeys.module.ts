import { Module } from '@nestjs/common';
import { JourneysController } from './controllers/journeys.controller';
import { JourneysRepository } from './repositories/journeys.repository';
import { JourneysService } from './services/journeys.service';

@Module({
  controllers: [JourneysController],
  providers: [JourneysService, JourneysRepository],
  exports: [JourneysService],
})
export class JourneysModule {}
