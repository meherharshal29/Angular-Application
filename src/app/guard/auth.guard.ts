import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const snackBar = inject(MatSnackBar);
  const notification = inject(NotificationService);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    return true;
  } else {
    setTimeout(() => {
      // notification.showNotification('Please login to access this page', 'warning');
      router.navigate(['/auth/login']);
    },100);
    return false;
  }
};
