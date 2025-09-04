import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { PermissionFlags, PermissionMap } from '../model/permission.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {

    private Url = environment.apiBase + environment.apiEndpoints.permission;
    // private cache?: PermissionMap;
    // constructor(private http: HttpClient) {}
    // load(): Observable<PermissionMap> {
    //     if (this.cache) return of(this.cache);
    //     return this.http.get<PermissionMap>(`${this.Url}/me/permissions`).pipe(
    //         tap(permissions => this.cache = permissions),
    //         shareReplay(1)
    //     );
    // }
    // has(feature: string, action: 'SEARCH' | 'ADD' | 'VIEW' | 'EDIT' | 'APPROVE' | 'REJECT' | 'DELETED' | 'SAVE' | 'CLEAR' | 'CANCEL' | 'PROCESS' | 'IMPORT' | 'EXPORT'): boolean {
    //     const f = this.cache?.[feature];
    //     if (!f) return false;
    //     const key = action.toLowerCase() as keyof typeof f;
    //     return !!f[key];
    // }

    private permissions: PermissionMap = {};
    constructor(private http: HttpClient) {}

    loadPerminsions(){
        return this.http.get<PermissionMap>(`${this.Url}/feature/me`).subscribe((permissions) => {

            this.permissions = permissions;
            localStorage.setItem('permissions', JSON.stringify(permissions));
        });
    }

    getPermission(feature: string, action: keyof PermissionFlags): boolean {
        return this.permissions?.[feature]?.[action] ?? false;
    }

    loadFromCache(){
        const cached = localStorage.getItem('permissions');
        if (cached) {
            this.permissions = JSON.parse(cached);
        }
    }
}
