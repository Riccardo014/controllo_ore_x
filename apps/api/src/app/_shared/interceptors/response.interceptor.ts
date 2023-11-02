import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiPaginatedResponse, ApiResponse } from '@api-interfaces';

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | ApiPaginatedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | ApiPaginatedResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (response) {
          if (response.data) {
            return response;
          }
          return { data: response };
        }
      })
    );
  }
}
