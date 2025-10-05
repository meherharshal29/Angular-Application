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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.addDefaultAdmin();
  }

  // Add default admin (only if not present in localStorage)
  private addDefaultAdmin() {
    if (!this.isBrowser) return;

    const defaultAdmin: RegisterUser = {
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'admin'
    };

    let users: RegisterUser[] = [];
    const localUsers = localStorage.getItem('admins');
    if (localUsers) {
      users = JSON.parse(localUsers);
    }

    if (!users.some(user => user.email === defaultAdmin.email)) {
      users.push(defaultAdmin);
      localStorage.setItem('admins', JSON.stringify(users));
    }
  }

  // Admin login
  login(email: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const admins: RegisterUser[] = JSON.parse(localStorage.getItem('admins') || '[]');
    const admin = admins.find(u => u.email === email && u.password === password);
    if (admin) {
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      return true;
    }
    return false;
  }

  // Admin logout
  logout(): void {
    localStorage.removeItem('currentAdmin');
    this.router.navigate(['/modules/admin/admin']); // redirect to admin login page
  }

  // Check if admin is logged in
  isAdminLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const currentAdmin = localStorage.getItem('currentAdmin');
    return !!currentAdmin;
  }

  // Get current admin details
  getCurrentAdmin(): RegisterUser | null {
    if (!this.isBrowser) return null;
    const currentAdmin = localStorage.getItem('currentAdmin');
    return currentAdmin ? JSON.parse(currentAdmin) : null;
  }
}
