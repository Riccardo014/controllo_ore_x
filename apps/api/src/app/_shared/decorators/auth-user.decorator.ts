import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser: any = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: any = ctx.switchToHttp().getRequest();
  return request.auth?.user;
});
