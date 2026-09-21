import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.validation';
import { DiscoveryModule } from './discovery/discovery.module';
import { JourneysModule } from './journeys/journeys.module';
import { NodesModule } from './nodes/nodes.module';
import { ProgressModule } from './progress/progress.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './shared/prisma.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    JourneysModule,
    NodesModule,
    UploadsModule,
    DiscoveryModule,
    RecommendationsModule,
    SearchModule,
    ProgressModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
