/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {

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
  
  const config = new DocumentBuilder()
  .setTitle('API for ControlloOreX')
  .setDescription('API for ControlloOreX')
  .setVersion('0.1')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
