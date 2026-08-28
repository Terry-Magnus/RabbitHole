import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.validation';
import { PrismaModule } from '../shared/prisma.module';
import { PrismaService } from '../shared/prisma.service';
import { AUTH_INSTANCE } from './auth.constants';
import { AuthController } from './auth.controller';
import { createAuth } from './auth.instance';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_INSTANCE,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService<Env, true>) =>
        createAuth(
          prisma,
          config.get('BETTER_AUTH_SECRET', { infer: true }),
          config.get('BETTER_AUTH_URL', { infer: true }),
        ),
    },
  ],
})
export class AuthModule {}
