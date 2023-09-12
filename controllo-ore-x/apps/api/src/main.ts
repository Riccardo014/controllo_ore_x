/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {

  const nestApplicationOptions: NestApplicationOptions = {
    cors: true,
  };

  // Remove other logs in production environment
  if (process.env.NODE_ENV === 'production') {
    nestApplicationOptions.logger = [
      'error',
    ];
  }
  
  const app: INestApplication = await NestFactory.create(AppModule, nestApplicationOptions);
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
