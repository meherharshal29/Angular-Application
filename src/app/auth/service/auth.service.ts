import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface User {
  id?: number;
  fullName: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Restore user on app start
    if (this.isBrowser) {
      const token = this.getToken();
      const savedUser = localStorage.getItem('current_user');
      if (token && savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
        // Attempt to refresh user data from backend
        this.loadUserProfile();
      }
    }
  }

  // Register
  register(user: { fullName: string; email: string; password: string }): Observable<boolean> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap((newUser) => {
        if (this.isBrowser) {
          localStorage.setItem('current_user', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
      }),
      map(() => true),
      catchError(this.handleError)
    );
  }

  // Login
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (res.token && res.user && this.isBrowser) {
          this.saveToken(res.token);
          this.saveUser(res.user);
          this.currentUserSubject.next(res.user);
        }
      }),
      map(() => true),
      catchError(this.handleError)
    );
  }

  // Update User
  updateUser(user: User): Observable<boolean> {
    return this.http.put<User>(`${this.apiUrl}/me`, user, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
    }).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        this.saveUser(updatedUser);
      }),
      map(() => true),
      catchError(this.handleError)
    );
  }

  // Logout
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('current_user');
    }
    this.currentUserSubject.next(null);
  }

  // Token Methods
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('jwt_token');
  }

  private saveToken(token: string): void {
    if (this.isBrowser) localStorage.setItem('jwt_token', token);
  }

  private saveUser(user: User): void {
    if (this.isBrowser) localStorage.setItem('current_user', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Load user profile from backend
  private loadUserProfile(): void {
    const token = this.getToken();
    const savedUser = this.isBrowser ? localStorage.getItem('current_user') : null;
    if (token && savedUser) {
      this.http.get<User>(`${this.apiUrl}/me`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      }).subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.saveUser(user);
        },
        error: () => {
          // Fallback to saved user instead of logging out
          this.currentUserSubject.next(JSON.parse(savedUser));
        }
      });
    }
  }

  // Get all users (admin)
  getUsers(): Observable<User[]> {
    if (!this.isBrowser) return of([]);
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error || 'Invalid credentials or email already in use.';
          break;
        case 401:
          errorMessage = 'Unauthorized: Invalid or expired token.';
          break;
        case 403: 
          errorMessage = 'Forbidden: You do not have access to this resource.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}