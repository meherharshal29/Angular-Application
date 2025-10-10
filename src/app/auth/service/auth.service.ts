import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  fullName: string;
  email: string;
  password: string;
  isActive?: boolean;
}

interface Item {
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageKey = 'users';
  private currentUserKey = 'currentUser';
  private itemsKeyPrefix = 'items_';
  private activeUsersKey = 'activeUsers';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  register(user: User): boolean {
    const users = this.getUsers();
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) return false;

    users.push({ ...user, email: user.email.toLowerCase(), isActive: false });
    if (this.isBrowser()) localStorage.setItem(this.storageKey, JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      // Set all users to inactive
      users.forEach(u => u.isActive = false);
      // Set only the logged-in user to active
      user.isActive = true;
      if (this.isBrowser()) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        this.addActiveUserEmail(user.email);
      }
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    const user = this.getCurrentUser();
    if (user && this.isBrowser()) {
      const users = this.getUsers();
      const updatedUsers = users.map(u => 
        u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, isActive: false } : u
      );
      localStorage.setItem(this.storageKey, JSON.stringify(updatedUsers));
      this.removeActiveUserEmail(user.email);
      localStorage.removeItem(this.currentUserKey);
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getCurrentUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  getUsers(): User[] {
    if (!this.isBrowser()) return [];
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  getUserData(): User[] {
    return this.getUsers();
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (index !== -1) {
      // Preserve isActive status of the current user
      const isActive = users[index].isActive;
      users[index] = { ...updatedUser, isActive };
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    // If current logged-in user is updated, update currentUser
    const current = this.getCurrentUser();
    if (current && current.email.toLowerCase() === updatedUser.email.toLowerCase()) {
      localStorage.setItem(this.currentUserKey, JSON.stringify({ ...updatedUser, isActive: current.isActive }));
      this.currentUserSubject.next({ ...updatedUser, isActive: current.isActive });
    }
  }

  getActiveUsersEmails(): string[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(this.activeUsersKey);
    return data ? JSON.parse(data) : [];
  }

  private addActiveUserEmail(email: string): void {
    if (!this.isBrowser()) return;
    const activeEmails = this.getActiveUsersEmails();
    if (!activeEmails.includes(email.toLowerCase())) {
      activeEmails.push(email.toLowerCase());
      localStorage.setItem(this.activeUsersKey, JSON.stringify(activeEmails));
    }
  }

  private removeActiveUserEmail(email: string): void {
    if (!this.isBrowser()) return;
    const activeEmails = this.getActiveUsersEmails().filter(e => e !== email.toLowerCase());
    localStorage.setItem(this.activeUsersKey, JSON.stringify(activeEmails));
  }

  saveUserItems(email: string, items: Item[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(`${this.itemsKeyPrefix}${email.toLowerCase()}`, JSON.stringify(items));
    }
  }

  getUserItems(email: string): Item[] | null {
    if (!this.isBrowser()) return null;
    const items = localStorage.getItem(`${this.itemsKeyPrefix}${email.toLowerCase()}`);
    return items ? JSON.parse(items) : null;
  }
}