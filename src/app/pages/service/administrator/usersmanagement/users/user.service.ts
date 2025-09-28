import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RolePermissionModel } from '../../../../model/administrator/userManagement/role.permission.model';
import { User } from '../../../../model/administrator/userManagement/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private userUrl = environment.apiBase + environment.apiEndpoints.usersManagement.users;
    private roleUrl = environment.apiBase + environment.apiEndpoints.usersManagement.userRoles;

    constructor(private http: HttpClient) {}

    addUser(user: { id: undefined; userCode: string; username: string; name: string; password: string; email: string; userStatus: string; description: string; lastLoginAt?: string | Date }): Observable<User> {
        return this.http.post<User>(this.userUrl, user);
    }

    getAllUsers(): Observable<User[]> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<User[]>(`${this.userUrl}`, { headers });
    }

    getUserById(id: number): Observable<User> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<User>(`${this.userUrl}/${id}`, { headers });
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
            Authorization: `Bearer ${token || ''}`
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

    getUserRoles(userId: number): Observable<RolePermissionModel[]> {
        return this.http.get<RolePermissionModel[]>(`${this.roleUrl}/${userId}`);
    }
}
