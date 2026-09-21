import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JourneysController } from './controllers/journeys.controller';
import { JourneysRepository } from './repositories/journeys.repository';
import { JourneysService } from './services/journeys.service';

@Module({
  imports: [AuthModule],
  controllers: [JourneysController],
  providers: [JourneysService, JourneysRepository],
  exports: [JourneysService],
})
export class JourneysModule {}
