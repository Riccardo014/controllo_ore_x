/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  INestApplication,
  Logger,
  NestApplicationOptions,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { UserAuthGuard } from '@shared/guards/user-auth.guard';
import { ResponseWrapperInterceptor } from '@shared/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const nestApplicationOptions: NestApplicationOptions = {
    cors: true,
  };

  // Remove other logs in production environment
  if (process.env.NODE_ENV === 'production') {
    nestApplicationOptions.logger = ['error'];
  }

  const app: INestApplication = await NestFactory.create(
    AppModule,
    nestApplicationOptions,
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Response wrapping
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());

  // Set authentication guard
  const reflector: Reflector = app.get(Reflector);
  const authSvc: AuthService = app.get(AuthService);
  app.useGlobalGuards(new UserAuthGuard(reflector, authSvc));

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
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
