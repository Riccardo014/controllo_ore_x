import { typeormOptionsModuleFactory } from '@config/typeorm-options.config';
import { AuthModule } from '@modules/auth/auth.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { IndexConfigurationModule } from '@modules/index-configuration/index-configuration.module';
import { ProjectModule } from '@modules/project/project.module';
import { UserHoursModule } from '@modules/user-hours/user-hours.module';
import { UserModule } from '@modules/user/user.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpLoggerMiddleware } from '@shared/middlewares/http-logger.middleware';
import { join } from 'path';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormOptionsModuleFactory,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'controllo-ore-x'),
      exclude: ['/api*'],
    }),

    UserModule,
    AuthModule,
    CustomerModule,
    ProjectModule,
    UserHoursModule,
    IndexConfigurationModule,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
