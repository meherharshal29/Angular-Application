import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface RegisterUser {
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  addDefaultAdmin() {
    if (!this.isBrowser) return; 

    const defaultAdmin: RegisterUser = {
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'admin'
    };

    let users: RegisterUser[] = [];
    const localUsers = localStorage.getItem('users');
    if (localUsers) {
      users = JSON.parse(localUsers);
    }

    if (!users.some(user => user.email === defaultAdmin.email)) {
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

    logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/modules/admin/admin']);
  }

  // New: Check if admin is logged in
  isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        return user.role === 'admin';
      }
    }
    return false;
  }

  
}
