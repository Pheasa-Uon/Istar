import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { RolePermissionModel } from '../../../../model/administrator/usermanagement/role.permission.model';

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.usersManagement.roles;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getAllRolePermission(): Observable<RolePermissionModel[]> {
        const token = localStorage.getItem('authToken'); // your login token
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<RolePermissionModel[]>(this.apiUrl, { headers });
    }

    // ✅ Get a single role
    getRoleById(id: number): Observable<RolePermissionModel> {
        return this.http.get<RolePermissionModel>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addRolePermission(role: { id?: number | undefined; roleCode?: string; roleName?: string; roleStatus: string | undefined; description: string; checked?: boolean }): Observable<RolePermissionModel> {
        return this.http.post<RolePermissionModel>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateRolePermission(role: RolePermissionModel): Observable<RolePermissionModel> {
        return this.http.put<RolePermissionModel>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteRole(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    // ✅ Save role-feature permissions (if needed)
    saveRolePermissions(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/permissions/save`, payload);
    }

    searchRoles(keyword: string): Observable<RolePermissionModel[]> {
        const token = localStorage.getItem('authToken'); // or wherever you store your token

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token || ''}`
        });

        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;

        return this.http.get<RolePermissionModel[]>(url, { headers });
    }
}
