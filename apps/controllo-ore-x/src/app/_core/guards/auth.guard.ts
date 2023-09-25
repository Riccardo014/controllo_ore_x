import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isUserLoggedIn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

  if (_authService.isAuthenticated()) {
    return true;
  } else {
    _router.navigate(['/']);
    return false;
  }
};

export const isUserNotLoggedIn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

  if (!_authService.isAuthenticated()) {
    return true;
  } else {
    _router.navigate(['/auth']);
    return false;
  }
};
