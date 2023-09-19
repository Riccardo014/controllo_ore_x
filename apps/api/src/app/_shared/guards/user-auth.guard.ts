import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@modules/user/entities/user.entity';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class UserAuthGuard {
  constructor(private readonly _reflector: Reflector, private _authService: AuthService) {}

  /**
   * Determines whether a user can access a route.
   * @param context the execution context.
   * @returns true if the endpoint is public or if the user is authenticated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const isPublic: boolean = this._reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    const request: any = context.switchToHttp().getRequest();

    const tokenInQueryParam: any = request?.query?.bearer;
    const tokenInHeaderAuthorization: any = request.headers.authorization?.replace('Bearer ', '');

    const token: string = tokenInQueryParam ?? tokenInHeaderAuthorization;
    if (!token) {
      throw new ForbiddenException();
    }

    const user: User = await this._authService.authenticate(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    request.auth = { user };

    return true;

  }
}
