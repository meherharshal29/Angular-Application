import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.addDefaultAdmin();
      this.checkLoginStatus(); 
    }
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
      this.isLoggedInSubject.next(true); // Notify login status change
      return true;
    }
    return false;
  }

  // Admin logout
  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem('currentAdmin');
    this.isLoggedInSubject.next(false); // Notify login status change
    this.router.navigate(['/modules/admin/admin']); // Redirect to admin login page
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

  // Check login status and update BehaviorSubject
  checkLoginStatus(): void {
    if (!this.isBrowser) return;
    const isLoggedIn = !!localStorage.getItem('currentAdmin');
    this.isLoggedInSubject.next(isLoggedIn);
  }
}