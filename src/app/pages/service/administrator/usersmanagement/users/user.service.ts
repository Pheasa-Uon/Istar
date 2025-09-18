import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolePermission } from '../../../../model/administrator/usermanagement/RolePermission';

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
    private userUrl = environment.apiBase + environment.apiEndpoints.usersManagement.users;
    private roleUrl = environment.apiBase + environment.apiEndpoints.usersManagement.userRoles;

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.userUrl).pipe(
            map(users =>
                users.map(user => ({
                    ...user,
                    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
                }))
            )
        );
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.userUrl}/${userId}`).pipe(
            map(user => ({
                ...user,
                lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
            }))
        );
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.userUrl, user);
    }

    updateUser(user: Partial<User> & { id: number }): Observable<User> {
        return this.http.put<User>(`${this.userUrl}/edit/${user.id}`, user);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.userUrl}/${userId}`);
    }

    resetPassword(userId: number): Observable<User> {
        return this.http.put<User>(`${this.userUrl}/${userId}/reset-password`, {});
    }

    searchUsers(keyword: string): Observable<User[]> {
        const token = localStorage.getItem('authToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });

        const url = `${this.userUrl}/search?keyword=${encodeURIComponent(keyword)}`;

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
