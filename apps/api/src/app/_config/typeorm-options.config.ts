import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export async function typeormOptionsModuleFactory(configService: ConfigService): Promise<TypeOrmModuleOptions> {
  return {
    type: 'postgres',
    synchronize: configService.get<'true' | 'false'>('ORM_SYNCHRONIZE') === 'true',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    database: configService.get<string>('DATABASE_SCHEMA'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    password: configService.get<string>('DATABASE_PASSWORD'),
    username: configService.get<string>('DATABASE_USERNAME'),
    autoLoadEntities: true,
  };
}
