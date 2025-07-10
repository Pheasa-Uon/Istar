import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from './user.service';

export interface RolePermission {
    id?: number | undefined;
    name?: string;
    status?: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.roles;

    constructor(private http: HttpClient) {}

    // ✅ Get all roles
    getRolePermissionMedium(): Promise<RolePermission[]> {
        return firstValueFrom(this.http.get<RolePermission[]>(this.apiUrl));
    }

    // ✅ Get a single role
    getRoleById(id: number): Observable<RolePermission> {
        return this.http.get<RolePermission>(`${this.apiUrl}/${id}`);
    }

    // ✅ Create new role
    addRolePermission(role: RolePermission): Observable<RolePermission> {
        return this.http.post<RolePermission>(this.apiUrl, role);
    }

    // ✅ Update existing role
    updateRolePermission(role: RolePermission): Observable<RolePermission> {
        return this.http.put<RolePermission>(`${this.apiUrl}/${role.id}`, role);
    }

    // ✅ Delete role
    deleteRole(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
    }

    // ✅ Save role-feature permissions (if needed)
    saveRolePermissions(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/permissions/save`, payload);
    }
}
