import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import { LoginDtoV } from './login.dtov';
import { User } from '@modules/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

  constructor(private _authService: AuthService) {}

  @IsPublic()
  @Post('login')
  login(@Body() body: LoginDtoV): Promise<{ user: User, token: string }>{
    return this._authService.login(body);
  }

}
