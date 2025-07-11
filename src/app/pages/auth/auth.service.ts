// src/app/pages/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Make sure this path is correct
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private apiUrl = environment.apiBase + environment.apiEndpoints.auth;

    constructor(private http: HttpClient, private router: Router) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
            username,
            password
        });
    }


    // login(username: string, password: string): Observable<string> {
    //     const url = environment.apiBase + environment.apiEndpoints.auth + '/login';
    //     return this.http.post(
    //         url,
    //         { username, password },
    //         { responseType: 'text' }
    //     );
    // }


    saveToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // logout(): void {
    //     localStorage.removeItem('authToken');
    // }

    logout(): Observable<any> {
        const rawToken = localStorage.getItem('authToken');
        const token = rawToken?.replace(/"/g, '').trim(); // remove quotes if any

        if (!token) {
            // If no token, just clear storage and navigate immediately
            this.clearStorageAndRedirect();
            return new Observable((observer) => {
                observer.next(null);
                observer.complete();
            });
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(`${this.apiUrl}/logout`, {}, { headers, responseType: 'text' }).pipe(
            tap({
                next: () => this.clearStorageAndRedirect(),
                error: () => this.clearStorageAndRedirect(),
            })
        );
    }

    private clearStorageAndRedirect() {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    private clearAndRedirect() {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
