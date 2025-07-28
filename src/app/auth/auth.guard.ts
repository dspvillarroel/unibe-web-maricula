import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@app/service/auth.service';
import {JwtService} from '@app/service/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtService = inject(JwtService);

  let currentRoute = route;
  while (currentRoute.firstChild) {
    currentRoute = currentRoute.firstChild;
  }

  const expectedRoles = currentRoute.data['roles'] as string[];

  if (authService.isLoggedIn() && jwtService.hasRole(expectedRoles)) {
    return true
  } else {
    router.navigate(['/login']);
    return false;
  }
};
