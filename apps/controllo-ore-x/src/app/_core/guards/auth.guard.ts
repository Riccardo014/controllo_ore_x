import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authFunctionalGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

    if (_authService.isAuthenticated() ) {
      return true;
    }
    else{
      _router.navigate(['/']);
      return false;
    }

};

export const unauthFunctionalGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  
  const _authService: AuthService = inject(AuthService);
  const _router: Router = inject(Router);

    if (!_authService.isAuthenticated() ) {
      return true;
    }
    else{
      _router.navigate(['/auth']);
      return false;
    }

};
