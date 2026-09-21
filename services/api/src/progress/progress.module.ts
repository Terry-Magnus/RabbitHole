import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JourneysModule } from '../journeys/journeys.module';
import { ProgressController } from './controllers/progress.controller';
import { ProgressRepository } from './repositories/progress.repository';
import { ProgressService } from './services/progress.service';

@Module({
  imports: [AuthModule, JourneysModule],
  controllers: [ProgressController],
  providers: [ProgressService, ProgressRepository],
})
export class ProgressModule {}
