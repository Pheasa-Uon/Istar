import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RolePermissionModel } from '../../../../model/administrator/userManagement/role.permission.model';
import { UserRequest, UserResponse } from '../../../../model/administrator/userManagement/user.model';
import { UserBranchModel } from '../../../../model/administrator/userManagement/user.branch';

@Injectable({ providedIn: 'root' })
export class UserService {
    private userUrl = environment.apiBase + environment.apiEndpoints.usersManagement.users;
    private roleUrl = environment.apiBase + environment.apiEndpoints.usersManagement.userRoles;
    private branchUrl = environment.apiBase + environment.apiEndpoints.usersManagement.userBranch;

    constructor(private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
    }

    addUser(user: Omit<UserRequest, 'id'>): Observable<UserRequest> {
        return this.http.post<UserRequest>(this.userUrl, user, { headers: this.getAuthHeaders() });
    }

    getAllUsers(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(this.userUrl, { headers: this.getAuthHeaders() });
    }

    getUserById(id: number): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.userUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateUser(user: Partial<UserResponse> & { id: number }): Observable<UserResponse> {
        return this.http.put<UserResponse>(`${this.userUrl}/edit/${user.id}`, user, { headers: this.getAuthHeaders() });
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.userUrl}/${userId}`, { headers: this.getAuthHeaders() });
    }

    resetPassword(userId: number): Observable<UserResponse> {
        return this.http.put<UserResponse>(`${this.userUrl}/${userId}/reset-password`, {}, { headers: this.getAuthHeaders() });
    }

    searchUsers(keyword: string): Observable<UserResponse[]> {
        const url = `${this.userUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<UserResponse[]>(url, { headers: this.getAuthHeaders() });
    }

    // ---- ROLE MANAGEMENT ----
    assignRole(data: { userId: number; roleId: number }): Observable<any> {
        return this.http.post(`${this.roleUrl}/assign`, data, { headers: this.getAuthHeaders() });
    }

    removeRole(data: { userId: number; roleId: number }): Observable<any> {
        return this.http.post(`${this.roleUrl}/remove`, data, { headers: this.getAuthHeaders() });
    }

    getUserRoles(userId: number): Observable<RolePermissionModel[]> {
        return this.http.get<RolePermissionModel[]>(`${this.roleUrl}/${userId}`, { headers: this.getAuthHeaders() });
    }

    // ---- BRANCH MANAGEMENT ----
    assignBranch(data: { userId: number; branchId: number }): Observable<any> {
        return this.http.post(`${this.branchUrl}/assign`, data, { headers: this.getAuthHeaders() });
    }

    removeBranch(data: { userId: number; branchId: number }): Observable<any> {
        return this.http.post(`${this.branchUrl}/remove`, data, { headers: this.getAuthHeaders() });
    }

    getUserBranches(userId: number): Observable<UserBranchModel[]> {
        return this.http.get<UserBranchModel[]>(`${this.branchUrl}/${userId}`, { headers: this.getAuthHeaders() });
    }
}
