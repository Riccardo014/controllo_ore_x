import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private _logger: Logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, baseUrl: url } = request;
    const startAt: [number, number] = process.hrtime();

    response.on('close', () => {
      const { statusCode } = response;
      const diff: [number, number] = process.hrtime(startAt);
      const responseTime: number = diff[0] * 1e3 + diff[1] * 1e-6;

      this._logger.log(
        `{${method}} ${url} - ${statusCode} - ${responseTime.toFixed(2)}ms - ${ip}`
      );
    });

    next();
  }
}
