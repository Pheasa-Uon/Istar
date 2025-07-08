// src/app/pages/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Make sure this path is correct
import { Observable } from 'rxjs';

interface LoginResponse {
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) {}

    // login(username: string, password: string): Observable<string> {
    //     return this.http.post(
    //         `${environment.apiEndpoints.auth}/login`,
    //         { username, password },
    //         { responseType: 'text' }
    //     );
    // }

    login(username: string, password: string): Observable<string> {
        const url = environment.apiBase + environment.apiEndpoints.auth + '/login';
        return this.http.post(
            url,
            { username, password },
            { responseType: 'text' }
        );
    }


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

    logout(): void {
        const token = localStorage.getItem('authToken');
        if (token) {
            const url = environment.apiBase + environment.apiEndpoints.auth + '/logout';

            this.http.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'text'
            }).subscribe({
                next: () => {
                    localStorage.removeItem('authToken');
                },
                error: err => {
                    console.error('Logout failed', err);
                }
            });
        }
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
