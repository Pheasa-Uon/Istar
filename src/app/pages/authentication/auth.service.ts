import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    username: string;
    branchId: number;
}

interface DecodedToken {
    branchId?: number;
    sub?: string;
    exp?: number;
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.authentication;
    private TOKEN_KEY = 'auth_token';
    private REFRESH_TOKEN_KEY = 'refresh_token';
    private BRANCH_KEY = 'branch_id';
    private USERNAME_KEY = 'username';

    constructor(private http: HttpClient, private router: Router) {}

    /** LOGIN METHOD */
    login(username: string, password: string): Observable<LoginResponse> {
        const url = `${this.apiUrl}/login`;
        const body = { username, password };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        //console.log('🔐 Login request:', { url, body });

        return this.http.post<LoginResponse>(url, body, { headers }).pipe(
            tap(response => {
                //console.log('✅ Login response:', response);

                if (!response.accessToken) {
                    throw new Error('❌ No access token returned from API');
                }

                // Save tokens and info
                this.saveToken(response.accessToken);
                this.saveRefreshToken(response.refreshToken);
                localStorage.setItem(this.USERNAME_KEY, response.username);
                localStorage.setItem(this.BRANCH_KEY, response.branchId.toString());

                // Optionally decode the token
                try {
                    const decoded: DecodedToken = jwtDecode(response.accessToken);
                    //console.log('🧩 Decoded Token:', decoded);
                } catch (err) {
                    console.error('⚠️ Failed to decode JWT:', err);
                }
            })
        );
    }

    /** TOKEN HANDLING */
    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    saveRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    getBranchId(): number | null {
        const branchId = localStorage.getItem(this.BRANCH_KEY);
        return branchId ? Number(branchId) : null;
    }

    getUsername(): string | null {
        return localStorage.getItem(this.USERNAME_KEY);
    }

    /** CHECK LOGIN STATUS */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /** LOGOUT METHOD */
    logout(): Observable<any> {
        const token = this.getToken();
        if (!token) {
            this.clearStorageAndRedirect();
            return new Observable(observer => {
                observer.next(null);
                observer.complete();
            });
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const url = `${this.apiUrl}/logout`;

        //console.log('🚪 Logging out...');

        return this.http.post(url, {}, { headers, responseType: 'text' }).pipe(
            tap({
                next: () => this.clearStorageAndRedirect(),
                error: () => this.clearStorageAndRedirect(),
            })
        );
    }

    /** CLEAR LOCAL STORAGE AND REDIRECT */
    private clearStorageAndRedirect() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USERNAME_KEY);
        localStorage.removeItem(this.BRANCH_KEY);
        sessionStorage.clear();

        //console.log('🧹 Cleared session. Redirecting to login...');
        this.router.navigate(['/auth/login']);
    }
}
