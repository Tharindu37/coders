import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.getCurrentUser().pipe(
    map((user) => {
      if (user) return true;
      else {
        router.navigate(['/user'], { queryParams: { returnUrl: state.url } });
        localStorage.setItem('returnUrl', state.url ? state.url : '/');
        return false;
      }
    })
  );
};
