// src/app/pages/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Make sure this path is correct
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
    token: string;
}

interface DecodedToken {
    roles?: string[];
    sub?: string;
    exp?: number;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {


    private apiUrl = environment.apiBase + environment.apiEndpoints.auth;

    constructor(private http: HttpClient, private router: Router) {}

    // login(username: string, password: string) {
    //     return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
    //         username,
    //         password
    //     });
    // }


    // login(username: string, password: string): Observable<any> {
    //     return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
    //         tap(response => {
    //             const token = response.token;
    //             this.saveToken(token);
    //
    //             // Decode JWT to get roles
    //             const decoded: DecodedToken = jwtDecode(token);
    //             const roles = decoded.roles || [];
    //
    //             // Save roles to localStorage
    //             localStorage.setItem('roles', JSON.stringify(roles));
    //         })
    //     );
    // }

    login(username: string, password: string): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
            tap(response => {
                const token = response.token;

                if (typeof token === 'string' && token.trim() !== '') {
                    this.saveToken(token);

                    // Decode JWT to get roles
                    let decoded: DecodedToken;
                    try {
                        decoded = jwtDecode(token);
                        const roles = decoded.roles || [];

                        // Save roles to localStorage
                        localStorage.setItem('roles', JSON.stringify(roles));
                    } catch (err) {
                        console.error('JWT decoding failed:', err);
                        // Optionally handle error or logout
                    }
                } else {
                    console.error('Invalid or missing token in login response:', response);
                    // Optionally throw an error or show notification
                }
            })
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

    getUserRoles(): string[] {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles) : [];
    }


    // logout(): void {
    //     localStorage.removeItem('authToken');
    // }

    logout(): Observable<any> {
        const rawToken = localStorage.getItem('authToken');
        const token = rawToken?.replace(/"/g, '').trim(); // remove quotes if any

        if (!token) {
            // If no token, just clear storage and navigate immediately
            console.log('No token found, clearing storage and redirecting...');
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
        localStorage.removeItem('roles');
        sessionStorage.clear();
        //localStorage.clear();
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
