// permission.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RoleFeaturePermission } from '../model/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private api = environment.apiBase + '/permissions';

    constructor(private http: HttpClient) {}

    getPermissionsByUser(token: string | null): Observable<RoleFeaturePermission[]> {
        if (!token) {
            return of([]); // Return empty array if no token
        }
        return this.http.get<RoleFeaturePermission[]>(`${this.api}/user/permissions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
