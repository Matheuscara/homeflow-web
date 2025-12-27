import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { AuthResponse, CreateUserDto, LoginDto, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private userService = inject(UserService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => this.handleAuthResponse(response)),
      switchMap(() => this.loadFullUserData())
    );
  }

  register(userData: CreateUserDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => this.handleAuthResponse(response)),
      switchMap(() => this.loadFullUserData())
    );
  }

  loadFullUserData(): Observable<any> {
    return this.userService.getMe().pipe(
      tap(userData => {
        // Update currentUser with full data
        this.currentUser.set(userData);
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);

        // Fetch fresh user data from backend
        this.loadFullUserData().subscribe({
          error: (err) => {
            // If token is invalid, logout
            if (err.status === 401) {
              this.logout();
            }
          }
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('access_token');
  }
}
