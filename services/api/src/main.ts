import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import express, { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { Env } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Better Auth needs the raw, unparsed request body — exclude it from the global JSON parser.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api/auth')) {
      next();
      return;
    }
    express.json()(req, res, next);
  });

  const config = app.get<ConfigService<Env, true>>(ConfigService);

  app.enableCors({
    origin: config.get('WEB_APP_ORIGIN', { infer: true }),
    credentials: true,
  });

  const port = config.get('PORT', { infer: true });

  await app.listen(port);
}

void bootstrap();
