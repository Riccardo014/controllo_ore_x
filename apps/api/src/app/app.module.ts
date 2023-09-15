import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppService } from './app.service';
import { join } from 'path';
import { HttpLoggerMiddleware } from '@shared/middlewares/http-logger.middleware';
import { typeormOptionsModuleFactory } from '@config/typeorm-options.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
      ],
      inject: [
        ConfigService,
      ],
      useFactory: typeormOptionsModuleFactory,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'controllo-ore-x'),
      exclude: [
        '/api*',
      ],
    }),

    UserModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
