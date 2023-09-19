import { SetMetadata } from '@nestjs/common';

/**
 * Use Public Decorator in module/controller/endpoint to bypass auth guard
 * that is implemented globally (see main.ts).
 *
 */
export const IsPublic = (): any => SetMetadata('isPublic', true);
