import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  canActivate(): boolean {
    if (this.authService.getRole() === 'user') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
