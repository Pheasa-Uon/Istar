import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // ✅ adjust based on path
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolePermission } from '../model/RolePermission';
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

@Injectable({ providedIn: 'root' })
export class UserService {
    private usersUrl = environment.apiBase + environment.apiEndpoints.users.usersprofile;
    private userStatusesUrl = environment.apiBase + environment.apiEndpoints.users.userstatuses;
    private roleUrl = environment.apiBase + environment.apiEndpoints.userroles;

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.usersUrl).pipe(
            map(users =>
                users.map(user => ({
                    ...user,
                    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
                }))
            )
        );
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.usersUrl}/${userId}`).pipe(
            map(user => ({
                ...user,
                lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
            }))
        );
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.usersUrl, user);
    }

    updateUser(user: Partial<User> & { id: number }): Observable<User> {
        return this.http.put<User>(`${this.usersUrl}/edit/${user.id}`, user);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.usersUrl}/${userId}`);
    }

    resetPassword(userId: number): Observable<User> {
        return this.http.put<User>(`${this.usersUrl}/${userId}/reset-password`, {});
    }

    searchUsers(keyword: string): Observable<User[]> {
        const token = localStorage.getItem('authToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.usersUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<User[]>(url, { headers });
    }

    assignRole(data: { userId: number; roleId: number }) {
        return this.http.post(`${this.roleUrl}/assign`, data);
    }

    removeRole(data: { userId: number; roleId: number }) {
        return this.http.post(`${this.roleUrl}/remove`, data);
    }

    getUserRoles(userId: number): Observable<RolePermission[]> {
        return this.http.get<RolePermission[]>(`${this.roleUrl}/${userId}`);
    }
}
