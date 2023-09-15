import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthToken } from './auth-token.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        AuthToken,
      ]),
      UserModule,
    ],
    controllers: [
      AuthController,
    ],
    providers: [
      AuthService,
    ],
  })
  export class AuthModule {}
  