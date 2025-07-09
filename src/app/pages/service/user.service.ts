import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // ✅ adjust based on path
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { User } from '../../models/user.model'; // or wherever your User model is

export interface User {
    id?: number;
    userCode?: string;
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    userStatus: string; // ✅ add this line
    description?: string;
    lastLoginAt?: Date;

}


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiBase + environment.apiEndpoints.users;

    constructor(private http: HttpClient) {}

    // getAllUsers(): Observable<User[]> {
    //     return this.http.get<User[]>(this.apiUrl);
    // }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(
            map(users =>
                users.map(user => ({
                    ...user,
                    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
                }))
            )
        );
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(user: Partial<User> & { id: number }): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/edit/${user.id}`, user);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`);
    }

    // getUserById(userId: number): Observable<User> {
    //     return this.http.get<User>(`${this.apiUrl}/${userId}`);
    // }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
            map(user => ({
                ...user,
                lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
            }))
        );
    }

    resetPassword(userId: number): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/reset-password`, {});
    }

    // searchUsers(keyword?: string): Observable<User[]> {
    //     let params = new HttpParams();
    //     if (keyword) {
    //         params = params.set('keyword', keyword);
    //     }
    //     return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
    // }

    searchUsers(keyword: string): Observable<User[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<User[]>(url, { headers });
    }

}
