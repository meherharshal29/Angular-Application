import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
[x: string]: any;
  fullName: string;
  email: string;
  password: string;
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
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  register(user: User): boolean {
    const users = this.getUsers();
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) return false;

    users.push({ ...user, email: user.email.toLowerCase() });
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    }
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      }
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
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
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  private getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  updateUser(updatedUser: User, oldEmail?: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === (oldEmail || updatedUser.email).toLowerCase());
    if (index !== -1) {
      users[index] = { ...updatedUser, email: updatedUser.email.toLowerCase() };
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      // Handle items migration if email changed
      if (oldEmail && oldEmail.toLowerCase() !== updatedUser.email.toLowerCase()) {
        const items = localStorage.getItem(`${this.itemsKeyPrefix}${oldEmail.toLowerCase()}`);
        if (items) {
          localStorage.setItem(`${this.itemsKeyPrefix}${updatedUser.email.toLowerCase()}`, items);
          localStorage.removeItem(`${this.itemsKeyPrefix}${oldEmail.toLowerCase()}`);
        }
      }
    }
  }

  saveUserItems(email: string, items: Item[]): void {
    localStorage.setItem(`${this.itemsKeyPrefix}${email.toLowerCase()}`, JSON.stringify(items));
  }

  getUserItems(email: string): Item[] | null {
    const items = localStorage.getItem(`${this.itemsKeyPrefix}${email.toLowerCase()}`);
    return items ? JSON.parse(items) : null;
  }
}