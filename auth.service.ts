import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'ecom_user';
  private readonly base = `${environment.apiUrl}/users`;
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;

  private currentUser$ = new BehaviorSubject<User | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    try {
      const s = localStorage.getItem(this.storageKey);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(res => {
        if (res) {
          // The API returns user data directly, create a token from the response
          const user: User = {
            id: res.id,
            name: res.username || res.firstName || 'User', // Use username or firstName as name
            username: res.username,
            email: res.email,
            role: res.role,
            token: 'dummy-token' // Since the API doesn't return a token, use a dummy one
          };
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          this.currentUser$.next(user);
        }
      })
    );
  }

  // ✅ Register new user
  register(payload: {
    username: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    dateOfBirth?: string;
    gender?: string;
  }): Observable<any> {
    return this.http.post<any>(this.base, payload);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser$.next(null);
  }

  get currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getToken(): string | null {
    return this.getStoredUser()?.token || null;
  }

  get currentUserValue(): User | null {
    return this.currentUser$.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
