import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this._authService.authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this._authService.authToken,
        },
      });
    }

    return next.handle(request).pipe(
      tap({
        error: (error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this._authService.logout();
            this._router.navigateByUrl('/');
          }
        },
      }),
    );
  }
}
